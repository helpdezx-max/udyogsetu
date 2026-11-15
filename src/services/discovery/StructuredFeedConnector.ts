import { BaseConnector } from './BaseConnector';
import { DiscoverySource, ConnectorResult, RawDiscoveredJob } from './types';

export class StructuredFeedConnector extends BaseConnector {
  public async collectVacancies(source: DiscoverySource): Promise<ConnectorResult> {
    if (source.permission_status !== 'approved') {
      return {
        success: false,
        sourceId: source.id,
        vacanciesFound: [],
        error: `Collection blocked: Source permission status is '${source.permission_status}'.`,
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
          error: `HTTP ${status} from feed endpoint`,
          rateLimitDelayMs: 1500,
          robotsCompliant: true
        };
      }

      let vacancies: RawDiscoveredJob[] = [];

      // Check if response is JSON API
      if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
        vacancies = this.parseJsonFeed(content, source);
      } else {
        // Assume RSS / XML feed
        vacancies = this.parseRssXml(content, source);
      }

      return {
        success: true,
        sourceId: source.id,
        vacanciesFound: vacancies,
        rateLimitDelayMs: 1500,
        robotsCompliant: true
      };
    } catch (err: any) {
      return {
        success: false,
        sourceId: source.id,
        vacanciesFound: [],
        error: err.message || 'Feed parse error',
        rateLimitDelayMs: 1500,
        robotsCompliant: true
      };
    }
  }

  public parseJsonFeed(jsonStr: string, source: DiscoverySource): RawDiscoveredJob[] {
    const results: RawDiscoveredJob[] = [];
    try {
      const data = JSON.parse(jsonStr);
      const items = Array.isArray(data) ? data : data.jobs || data.items || data.data || [];

      for (const item of items) {
        if (item.title) {
          results.push({
            sourceId: source.id,
            sourceName: source.name,
            externalId: String(item.id || item.job_id || Math.random().toString(36).substring(7)),
            title: item.title,
            companyName: item.company || item.company_name || source.source_owner || 'Chakan Industrial Partner',
            rawLocation: item.location || 'Chakan MIDC, Pune',
            rawSalary: item.salary ? String(item.salary) : undefined,
            description: item.description || '',
            originalUrl: item.url || item.link || source.website_url,
            postedDate: item.date || item.created_at || new Date().toISOString()
          });
        }
      }
    } catch {
      // Malformed JSON
    }
    return results;
  }

  public parseRssXml(xmlStr: string, source: DiscoverySource): RawDiscoveredJob[] {
    const results: RawDiscoveredJob[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xmlStr)) !== null) {
      const itemBlock = match[1];
      const titleMatch = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i.exec(itemBlock);
      const linkMatch = /<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/i.exec(itemBlock);
      const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i.exec(itemBlock);
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/i.exec(itemBlock);

      if (titleMatch && titleMatch[1]) {
        results.push({
          sourceId: source.id,
          sourceName: source.name,
          externalId: `rss-${results.length + 1}`,
          title: titleMatch[1].trim(),
          companyName: source.source_owner || 'Chakan MIDC Industrial Network',
          rawLocation: 'Chakan, Pune',
          description: descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '',
          originalUrl: linkMatch ? linkMatch[1].trim() : source.website_url,
          postedDate: pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString()
        });
      }
    }

    return results;
  }
}
