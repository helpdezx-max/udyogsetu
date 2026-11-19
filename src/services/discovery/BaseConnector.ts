import { DiscoverySource, ConnectorResult, RawDiscoveredJob } from './types';

export abstract class BaseConnector {
  public static readonly USER_AGENT = 'RozzyBot/1.0 (+https://rozzy.in/bot; Hyperlocal Industrial Recruitment Pune)';
  protected lastRequestTime: number = 0;

  /**
   * Check robots.txt compliance before hitting any target URL
   */
  public async checkRobotsPermission(targetUrl: string): Promise<boolean> {
    try {
      const parsed = new URL(targetUrl);
      const robotsUrl = `${parsed.protocol}//${parsed.host}/robots.txt`;

      const response = await fetch(robotsUrl, {
        headers: { 'User-Agent': BaseConnector.USER_AGENT },
        signal: AbortSignal.timeout(5000)
      }).catch(() => null);

      if (!response || !response.ok) {
        // If robots.txt doesn't exist (404), crawling is permitted under standard RFC 9309
        return true;
      }

      const txt = await response.text();
      const lines = txt.split('\n').map(l => l.trim().toLowerCase());

      let relevantSection = false;
      let pathBlocked = false;
      const targetPath = parsed.pathname.toLowerCase();

      for (const line of lines) {
        if (line.startsWith('user-agent:')) {
          const agent = line.replace('user-agent:', '').trim();
          relevantSection = agent === '*' || agent.includes('rozzybot') || agent.includes('udyogsetubot');
        } else if (relevantSection && line.startsWith('disallow:')) {
          const disallowedPath = line.replace('disallow:', '').trim();
          if (disallowedPath && targetPath.startsWith(disallowedPath)) {
            pathBlocked = true;
            break;
          }
        }
      }

      return !pathBlocked;
    } catch {
      // In case of DNS/network check error, default to safe permit if not explicitly blocked
      return true;
    }
  }

  /**
   * Rate-limiting queue delay
   */
  protected async enforceRateLimit(rateLimitPerMinute: number = 10): Promise<number> {
    const minDelayMs = Math.max(1000, Math.floor(60000 / Math.max(1, rateLimitPerMinute)));
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;

    if (elapsed < minDelayMs) {
      const waitTime = minDelayMs - elapsed;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
    return minDelayMs;
  }

  /**
   * Safe fetch with standard headers and ethical identification
   */
  public async fetchPublicContent(url: string, rateLimitPerMinute: number = 10): Promise<{ content: string; ok: boolean; status: number }> {
    const isPermitted = await this.checkRobotsPermission(url);
    if (!isPermitted) {
      throw new Error(`Robots.txt Disallow rule blocks crawling on: ${url}`);
    }

    await this.enforceRateLimit(rateLimitPerMinute);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': BaseConnector.USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7',
        'Accept-Language': 'en-IN,en;q=0.9,mr-IN;q=0.8,hi-IN;q=0.7'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (res.status === 403 || res.status === 401) {
      throw new Error(`Access restricted (HTTP ${res.status}). Requires explicit partner authorization.`);
    }

    const text = await res.text();

    // Anti-bot detection
    if (text.includes('cf-chl-bypass') || text.includes('g-recaptcha') || text.includes('Cloudflare Turnstile')) {
      throw new Error('Automated bypass prohibited: Source requires interactive anti-bot verification.');
    }

    return { content: text, ok: res.ok, status: res.status };
  }

  public abstract collectVacancies(source: DiscoverySource): Promise<ConnectorResult>;
}
