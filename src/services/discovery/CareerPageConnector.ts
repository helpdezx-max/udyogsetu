import { BaseConnector } from './BaseConnector';
import { DiscoverySource, ConnectorResult, RawDiscoveredJob } from './types';

export class CareerPageConnector extends BaseConnector {
  public async collectVacancies(source: DiscoverySource): Promise<ConnectorResult> {
    if (source.permission_status !== 'approved') {
      return {
        success: false,
        sourceId: source.id,
        vacanciesFound: [],
        error: `Collection blocked: Source permission status is '${source.permission_status}'. Must be 'approved'.`,
        rateLimitDelayMs: 0,
        robotsCompliant: true
      };
    }

    try {
      const { content, ok, status } = await this.fetchPublicContent(
        source.website_url,
        source.rate_limit_per_minute
      );

      if (!ok) {
        return {
          success: false,
          sourceId: source.id,
          vacanciesFound: [],
          error: `HTTP ${status} returned from career portal`,
          rateLimitDelayMs: 2000,
          robotsCompliant: true
        };
      }

      const vacancies = this.parseCareerHtml(content, source);

      return {
        success: true,
        sourceId: source.id,
        vacanciesFound: vacancies,
        rateLimitDelayMs: 2000,
        robotsCompliant: true
      };
    } catch (err: any) {
      return {
        success: false,
        sourceId: source.id,
        vacanciesFound: [],
        error: err.message || 'Unknown crawl error',
        rateLimitDelayMs: 2000,
        robotsCompliant: !err.message?.includes('Robots.txt')
      };
    }
  }

  /**
   * Parse HTML for JSON-LD JobPosting schema or structured job cards
   */
  public parseCareerHtml(html: string, source: DiscoverySource): RawDiscoveredJob[] {
    const results: RawDiscoveredJob[] = [];

    // 1. Check for Schema.org JobPosting JSON-LD
    const jsonLdRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const rawJson = JSON.parse(match[1].trim());
        const postings = Array.isArray(rawJson)
          ? rawJson
          : rawJson['@graph']
          ? rawJson['@graph']
          : [rawJson];

        for (const p of postings) {
          if (p['@type'] === 'JobPosting' || p.title) {
            const loc = p.jobLocation?.address?.addressLocality ||
              p.jobLocation?.address?.streetAddress ||
              (typeof p.jobLocation === 'string' ? p.jobLocation : 'Chakan, Pune');

            const sal = p.baseSalary?.value?.value ||
              (p.baseSalary?.value?.minValue && p.baseSalary?.value?.maxValue
                ? `${p.baseSalary.value.minValue} - ${p.baseSalary.value.maxValue}`
                : undefined);

            results.push({
              sourceId: source.id,
              sourceName: source.name,
              externalId: String(p.identifier?.value || p.id || Math.random().toString(36).substring(7)),
              title: p.title || 'Industrial Machine Operator',
              companyName: p.hiringOrganization?.name || source.source_owner || 'Chakan Manufacturing Plant',
              rawLocation: loc,
              rawSalary: sal ? String(sal) : undefined,
              description: p.description ? p.description.replace(/<[^>]+>/g, ' ').substring(0, 1000) : '',
              originalUrl: p.url || source.website_url,
              postedDate: p.datePosted || new Date().toISOString()
            });
          }
        }
      } catch {
        // Continue if single JSON-LD block is malformed
      }
    }

    // 2. If no JSON-LD found, parse common HTML vacancy structures (headings + keywords)
    if (results.length === 0) {
      const headingRegex = /<(h[2-4]|strong)[^>]*>(.*?(?:Operator|Welder|Fitter|Electrician|Machinist|Inspector|Engineer|Supervisor|Technician).*?)<\/\1>/gi;
      let hMatch;
      let counter = 1;

      while ((hMatch = headingRegex.exec(html)) !== null && counter <= 5) {
        const cleanTitle = hMatch[2].replace(/<[^>]+>/g, '').trim();
        if (cleanTitle.length > 5 && cleanTitle.length < 80) {
          results.push({
            sourceId: source.id,
            sourceName: source.name,
            externalId: `parsed-${counter++}`,
            title: cleanTitle,
            companyName: source.source_owner || source.name.split(' ')[0],
            rawLocation: 'Chakan MIDC Phase 2, Pune',
            description: `Aggregated direct manufacturing opportunity discovered on ${source.name}. Contact official career portal for walk-in or plant application details.`,
            originalUrl: source.website_url,
            postedDate: new Date().toISOString()
          });
        }
      }
    }

    return results;
  }
}
