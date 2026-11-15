import { BaseConnector } from './BaseConnector';
import { DiscoverySource, ConnectorResult, RawDiscoveredJob } from './types';

export class ManualSubmissionConnector extends BaseConnector {
  public async collectVacancies(source: DiscoverySource): Promise<ConnectorResult> {
    try {
      const { content, ok, status } = await this.fetchPublicContent(
        source.website_url,
        source.rate_limit_per_minute || 10
      );

      if (!ok) {
        return {
          success: false,
          sourceId: source.id,
          vacanciesFound: [],
          error: `HTTP ${status} while reviewing manually submitted URL`,
          rateLimitDelayMs: 1000,
          robotsCompliant: true
        };
      }

      // Extract title from <title> or <h1>
      const titleMatch = /<title[^>]*>(.*?)<\/title>/i.exec(content) || /<h1[^>]*>(.*?)<\/h1>/i.exec(content);
      const extractedTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Submitted Factory Opening';

      const vacancy: RawDiscoveredJob = {
        sourceId: source.id,
        sourceName: source.name || 'Manual Vacancy Submission',
        externalId: `manual-${Date.now()}`,
        title: extractedTitle.split('|')[0].split('-')[0].trim() || 'Manufacturing Vacancy',
        companyName: source.source_owner || 'Chakan Industrial Employer',
        rawLocation: 'Chakan MIDC, Pune',
        description: `Direct manufacturing vacancy submitted for verification. Source link: ${source.website_url}`,
        originalUrl: source.website_url,
        postedDate: new Date().toISOString()
      };

      return {
        success: true,
        sourceId: source.id,
        vacanciesFound: [vacancy],
        rateLimitDelayMs: 1000,
        robotsCompliant: true
      };
    } catch (err: any) {
      return {
        success: false,
        sourceId: source.id,
        vacanciesFound: [],
        error: err.message || 'Error processing manual URL',
        rateLimitDelayMs: 1000,
        robotsCompliant: true
      };
    }
  }
}
