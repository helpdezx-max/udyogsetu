import assert from 'assert';
import { CareerPageConnector } from '../../src/services/discovery/CareerPageConnector';
import { StructuredFeedConnector } from '../../src/services/discovery/StructuredFeedConnector';
import { ManualSubmissionConnector } from '../../src/services/discovery/ManualSubmissionConnector';
import { BaseConnector } from '../../src/services/discovery/BaseConnector';
import { DiscoverySource } from '../../src/services/discovery/types';

console.log('--- UDYOGSETU PHASE 5: ETHICAL CONNECTORS TEST SUITE ---');

async function runTests() {
  // Test 1: User-Agent and Robots Compliance
  console.log('Test 1: User-Agent & Robots Rules');
  assert.ok(
    BaseConnector.USER_AGENT.includes('RozzyBot/1.0') || BaseConnector.USER_AGENT.includes('UdyogSetuBot/1.0'),
    'Must identify as RozzyBot or UdyogSetuBot'
  );
  assert.ok(BaseConnector.USER_AGENT.includes('/bot'), 'Must include bot info URL');
  console.log('  ✔ User-Agent identification verified (PASS)');

  // Test 2: CareerPageConnector Schema.org JSON-LD parser
  console.log('Test 2: Schema.org JobPosting JSON-LD Parsing');
  const mockHtmlWithSchema = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Careers at Bharat Forge</title>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org/",
          "@type": "JobPosting",
          "title": "CNC Turning Machine Operator",
          "description": "Looking for ITI Machinist with 2+ years experience in precision automotive shafts.",
          "datePosted": "2026-11-15",
          "hiringOrganization": {
            "@type": "Organization",
            "name": "Bharat Forge Ltd."
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Chakan MIDC Phase 1, Pune"
            }
          },
          "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "value": {
              "@type": "QuantitativeValue",
              "minValue": 18000,
              "maxValue": 24000,
              "unitText": "MONTH"
            }
          }
        }
        </script>
      </head>
      <body><h1>Careers</h1></body>
    </html>
  `;

  const careerConnector = new CareerPageConnector();
  const mockSource: DiscoverySource = {
    id: 'src-test-01',
    name: 'Bharat Forge Careers',
    website_url: 'https://bharatforge.example.com/careers',
    category: 'career_page',
    source_owner: 'Bharat Forge Ltd.',
    access_method: 'http_get',
    permission_status: 'approved',
    crawl_frequency_minutes: 720,
    last_successful_crawl: null,
    last_attempted_crawl: null,
    reliability_score: 95,
    is_enabled: true,
    rate_limit_per_minute: 6
  };

  const parsedJobs = careerConnector.parseCareerHtml(mockHtmlWithSchema, mockSource);
  assert.strictEqual(parsedJobs.length, 1, 'Should find 1 JobPosting');
  assert.strictEqual(parsedJobs[0].title, 'CNC Turning Machine Operator');
  assert.strictEqual(parsedJobs[0].companyName, 'Bharat Forge Ltd.');
  assert.ok(parsedJobs[0].rawLocation?.includes('Chakan MIDC Phase 1'));
  assert.strictEqual(parsedJobs[0].rawSalary, '18000 - 24000');
  console.log('  ✔ Schema.org JSON-LD extraction verified (PASS)');

  // Test 3: Block unapproved sources
  console.log('Test 3: Block Unapproved Source Crawl');
  const unapprovedSource: DiscoverySource = { ...mockSource, permission_status: 'review_required' };
  const blockedResult = await careerConnector.collectVacancies(unapprovedSource);
  assert.strictEqual(blockedResult.success, false, 'Unapproved source crawl must fail');
  assert.ok(blockedResult.error?.includes('review_required'), 'Error must specify permission status');
  console.log('  ✔ Permission gating enforced (PASS)');

  // Test 4: StructuredFeedConnector RSS and JSON parsing
  console.log('Test 4: Structured Feed Parsing');
  const feedConnector = new StructuredFeedConnector();
  const mockRssXml = `
    <rss version="2.0">
      <channel>
        <title>Chakan MIDC Vacancy Bulletin</title>
        <item>
          <title>MIG Welder (Automotive Chassis)</title>
          <link>https://chakanmidc.org/jobs/101</link>
          <description>Urgent requirement for 10 CO2 welders at Kuruli MIDC plant.</description>
          <pubDate>Sun, 15 Nov 2026 12:00:00 GMT</pubDate>
        </item>
      </channel>
    </rss>
  `;
  const rssJobs = feedConnector.parseRssXml(mockRssXml, mockSource);
  assert.strictEqual(rssJobs.length, 1);
  assert.strictEqual(rssJobs[0].title, 'MIG Welder (Automotive Chassis)');
  console.log('  ✔ RSS XML feed parsed successfully (PASS)');

  const mockJsonFeed = JSON.stringify({
    jobs: [
      {
        id: 'json-99',
        title: 'VMC Programmer & Operator',
        company: 'Indo-German Tooling Corp',
        location: 'Chakan Phase 2',
        salary: '22000 - 28000'
      }
    ]
  });
  const jsonJobs = feedConnector.parseJsonFeed(mockJsonFeed, mockSource);
  assert.strictEqual(jsonJobs.length, 1);
  assert.strictEqual(jsonJobs[0].title, 'VMC Programmer & Operator');
  assert.strictEqual(jsonJobs[0].companyName, 'Indo-German Tooling Corp');
  console.log('  ✔ JSON structured feed parsed successfully (PASS)');

  console.log('======================================================');
  console.log('ALL PHASE 5 ETHICAL CONNECTOR TEST ASSERTIONS PASSED!');
  console.log('======================================================');
}

runTests().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
