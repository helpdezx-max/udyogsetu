import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Globe,
  Plus,
  Play,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DiscoverySource, DiscoveryRunSummary } from '../../services/discovery/types';

const INITIAL_SOURCES: DiscoverySource[] = [
  {
    id: 'src-1',
    name: 'Mahindra & Mahindra Chakan Plant Direct Careers',
    website_url: 'https://jobs.mahindra.com/search/?q=chakan',
    category: 'career_page',
    source_owner: 'Mahindra & Mahindra Ltd.',
    access_method: 'http_get',
    permission_status: 'approved',
    crawl_frequency_minutes: 720,
    last_successful_crawl: '2026-11-15T18:30:00Z',
    last_attempted_crawl: '2026-11-15T18:30:00Z',
    reliability_score: 98,
    is_enabled: true,
    rate_limit_per_minute: 6,
    admin_notes: 'Direct OEM career portal for Chakan automotive manufacturing facility. Schema.org JobPosting compliant.'
  },
  {
    id: 'src-2',
    name: 'Bajaj Auto Chakan Production Openings',
    website_url: 'https://www.bajajauto.com/careers/openings',
    category: 'career_page',
    source_owner: 'Bajaj Auto Ltd.',
    access_method: 'http_get',
    permission_status: 'approved',
    crawl_frequency_minutes: 720,
    last_successful_crawl: '2026-11-15T18:30:00Z',
    last_attempted_crawl: '2026-11-15T18:30:00Z',
    reliability_score: 96,
    is_enabled: true,
    rate_limit_per_minute: 6,
    admin_notes: 'Two-wheeler and commercial vehicle assembly, press shop and weld shop roles.'
  },
  {
    id: 'src-3',
    name: 'Tata Motors Pune Passenger & Commercial Plant',
    website_url: 'https://www.tatamotors.com/careers/opportunities',
    category: 'career_page',
    source_owner: 'Tata Motors Ltd.',
    access_method: 'http_get',
    permission_status: 'approved',
    crawl_frequency_minutes: 720,
    last_successful_crawl: '2026-11-15T18:30:00Z',
    last_attempted_crawl: '2026-11-15T18:30:00Z',
    reliability_score: 95,
    is_enabled: true,
    rate_limit_per_minute: 5,
    admin_notes: 'Pimpri and Chakan CVBU/PVBU manufacturing shifts and shopfloor apprenticeships.'
  },
  {
    id: 'src-4',
    name: 'Bharat Forge Chakan Industrial Complex',
    website_url: 'https://www.bharatforge.com/careers',
    category: 'career_page',
    source_owner: 'Bharat Forge Ltd.',
    access_method: 'http_get',
    permission_status: 'approved',
    crawl_frequency_minutes: 1440,
    last_successful_crawl: '2026-11-15T12:00:00Z',
    last_attempted_crawl: '2026-11-15T12:00:00Z',
    reliability_score: 94,
    is_enabled: true,
    rate_limit_per_minute: 6,
    admin_notes: 'Precision forging, machining, heat treatment and metallurgical quality roles.'
  },
  {
    id: 'src-5',
    name: 'Chakan MIDC Industrial Association Walk-in Feed',
    website_url: 'https://chakanmidc.org/vacancies',
    category: 'industrial_announcement',
    source_owner: 'Chakan Industries Association',
    access_method: 'rss_feed',
    permission_status: 'approved',
    crawl_frequency_minutes: 360,
    last_successful_crawl: '2026-11-15T20:00:00Z',
    last_attempted_crawl: '2026-11-15T20:00:00Z',
    reliability_score: 92,
    is_enabled: true,
    rate_limit_per_minute: 10,
    admin_notes: 'Hyperlocal association bulletin for Tier 1 and Tier 2 MSME auto-ancillary suppliers.'
  },
  {
    id: 'src-6',
    name: 'General Motors / Talegaon Vendor Park Feeds',
    website_url: 'https://example.com/talegaon-vendors/jobs',
    category: 'job_board',
    source_owner: 'Talegaon Vendor Association',
    access_method: 'http_get',
    permission_status: 'review_required',
    crawl_frequency_minutes: 1440,
    last_successful_crawl: null,
    last_attempted_crawl: null,
    reliability_score: 80,
    is_enabled: false,
    rate_limit_per_minute: 5,
    admin_notes: 'Requires legal terms review before automated crawling can be enabled.'
  }
];

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<DiscoverySource[]>(INITIAL_SOURCES);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isRunningDiscovery, setIsRunningDiscovery] = useState(false);
  const [runResults, setRunResults] = useState<DiscoveryRunSummary[] | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Manual URL Intake Form State
  const [singleUrl, setSingleUrl] = useState('');
  const [singleCompany, setSingleCompany] = useState('');
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);

  // New Source Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceCategory, setNewSourceCategory] = useState<any>('career_page');
  const [newSourceOwner, setNewSourceOwner] = useState('');
  const [newSourceAccess, setNewSourceAccess] = useState<any>('http_get');
  const [newSourceRateLimit, setNewSourceRateLimit] = useState(6);

  const filteredSources = sources.filter((s) => {
    if (filterStatus === 'approved') return s.permission_status === 'approved';
    if (filterStatus === 'review_required') return s.permission_status === 'review_required';
    if (filterStatus === 'restricted') return s.permission_status === 'restricted';
    return true;
  });

  const handleRunDiscovery = async () => {
    setIsRunningDiscovery(true);
    setActionNotice('Executing ethical discovery crawl across approved Chakan sources...');
    try {
      const res = await fetch('/api/admin/discovery/run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer study-trust-secret-2026'
        }
      });
      const data = await res.json();
      if (data.success) {
        setRunResults(data.runs);
        setActionNotice(`Discovery run completed! Processed ${data.sourcesProcessed} sources. Check results below.`);
      } else {
        setActionNotice(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setActionNotice(`Discovery execution error: ${e.message}`);
    } finally {
      setIsRunningDiscovery(false);
    }
  };

  const handleUpdatePermission = (id: string, newStatus: any) => {
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          permission_status: newStatus,
          is_enabled: newStatus === 'approved'
        };
      }
      return s;
    }));
    setActionNotice(`Source permission updated to "${newStatus}".`);
  };

  const handleManualUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleUrl) return;
    setIsSubmittingUrl(true);
    try {
      const res = await fetch('/api/discovery/submit-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: singleUrl, companyName: singleCompany })
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`Vacancy submitted & parsed successfully! Extracted: "${data.extractedVacancy?.title || 'Job'}". Added to moderation queue.`);
        setSingleUrl('');
        setSingleCompany('');
      } else {
        setActionNotice(`Submission failed: ${data.error}`);
      }
    } catch (e: any) {
      setActionNotice(`Error: ${e.message}`);
    } finally {
      setIsSubmittingUrl(false);
    }
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;

    const newSource: DiscoverySource = {
      id: `src-${Date.now()}`,
      name: newSourceName,
      website_url: newSourceUrl,
      category: newSourceCategory,
      source_owner: newSourceOwner || null,
      access_method: newSourceAccess,
      permission_status: 'review_required',
      crawl_frequency_minutes: 1440,
      last_successful_crawl: null,
      last_attempted_crawl: null,
      reliability_score: 90,
      is_enabled: false,
      rate_limit_per_minute: newSourceRateLimit,
      admin_notes: 'Registered by administrator. Awaiting legal & robots.txt review.'
    };

    setSources(prev => [newSource, ...prev]);
    setShowAddModal(false);
    setNewSourceName('');
    setNewSourceUrl('');
    setNewSourceOwner('');
    setActionNotice(`Source "${newSourceName}" added in "Review Required" status.`);
  };

  return (
    <AdminLayout title="Job Sources & Vacancy Discovery Engine">
      <Head>
        <title>Discovery Engine & Sources Registry • UdyogSetu Admin</title>
      </Head>

      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                Job Sources & Automated Discovery
              </h1>
              <Badge variant="warning">Phase 5 Engine</Badge>
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              Ethical vacancy aggregation across Chakan MIDC Phases 1–4, Khed City, Kuruli & Pune manufacturing hubs.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Register Source
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRunDiscovery}
              disabled={isRunningDiscovery}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold"
            >
              <Play className={`w-4 h-4 fill-current ${isRunningDiscovery ? 'animate-spin' : ''}`} />
              {isRunningDiscovery ? 'Crawling Sources...' : 'Run Discovery Now'}
            </Button>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-amber-700 font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 bg-white border border-neutral-200">
            <span className="text-3xs uppercase tracking-wider text-neutral-400 font-bold">Total Sources</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">{sources.length}</div>
            <span className="text-xs text-neutral-500">Registered platforms & feeds</span>
          </Card>
          <Card className="p-4 bg-white border border-neutral-200">
            <span className="text-3xs uppercase tracking-wider text-neutral-400 font-bold">Approved Active</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {sources.filter(s => s.permission_status === 'approved' && s.is_enabled).length}
            </div>
            <span className="text-xs text-emerald-700">Permitted ethical collection</span>
          </Card>
          <Card className="p-4 bg-white border border-neutral-200">
            <span className="text-3xs uppercase tracking-wider text-neutral-400 font-bold">Review Required</span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {sources.filter(s => s.permission_status === 'review_required').length}
            </div>
            <span className="text-xs text-amber-700">Terms / Robots.txt pending</span>
          </Card>
          <Card className="p-4 bg-white border border-neutral-200">
            <span className="text-3xs uppercase tracking-wider text-neutral-400 font-bold">Trust Policy</span>
            <div className="text-2xl font-black text-blue-600 mt-1">100% Gated</div>
            <span className="text-xs text-blue-700">All vacancies routed to moderation</span>
          </Card>
        </div>

        {/* Quick URL Intake Tool */}
        <Card className="p-5 bg-neutral-50 border border-neutral-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-500" />
                Quick Vacancy URL Submission
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Paste a public factory career link to automatically parse and pipe it into the pre-moderation queue.
              </p>
            </div>
            <form onSubmit={handleManualUrlSubmit} className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
              <input
                type="url"
                required
                placeholder="https://example.com/careers/vmc-operator"
                value={singleUrl}
                onChange={(e) => setSingleUrl(e.target.value)}
                className="flex-1 min-w-[220px] text-xs px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <input
                type="text"
                placeholder="Company Name (Optional)"
                value={singleCompany}
                onChange={(e) => setSingleCompany(e.target.value)}
                className="w-36 text-xs px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmittingUrl}
                className="text-xs bg-neutral-900 text-white"
              >
                {isSubmittingUrl ? 'Ingesting...' : 'Ingest & Review'}
              </Button>
            </form>
          </div>
        </Card>

        {/* Live Crawl Results Drawer (If Run Triggered) */}
        {runResults && (
          <Card className="p-5 border border-emerald-300 bg-emerald-50/40">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Latest Discovery Run Telemetry
            </h3>
            <div className="mt-3 divide-y divide-emerald-200/60 text-xs">
              {runResults.map((run, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-neutral-900">{run.sourceId}</span>
                    <span className="ml-2 text-neutral-500">Status: {run.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-3xs uppercase font-bold text-neutral-600">
                    <span>Discovered: {run.vacanciesDiscovered}</span>
                    <span className="text-emerald-700">Ingested: {run.vacanciesIngested}</span>
                    <span className="text-amber-700">Duplicates Filtered: {run.duplicatesDetected}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Source Filter Tabs */}
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              All Sources ({sources.length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'approved' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Approved ({sources.filter(s => s.permission_status === 'approved').length})
            </button>
            <button
              onClick={() => setFilterStatus('review_required')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'review_required' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Review Required ({sources.filter(s => s.permission_status === 'review_required').length})
            </button>
            <button
              onClick={() => setFilterStatus('restricted')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'restricted' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Restricted ({sources.filter(s => s.permission_status === 'restricted').length})
            </button>
          </div>
        </div>

        {/* Sources Table */}
        <Card className="overflow-hidden border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Source Name & Owner</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Permission Status</th>
                  <th className="py-3 px-4">Reliability</th>
                  <th className="py-3 px-4">Rate Limit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredSources.map((source) => (
                  <tr key={source.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                        {source.name}
                        <a
                          href={source.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-400 hover:text-neutral-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="text-3xs text-neutral-500 mt-0.5">
                        {source.source_owner || 'Unspecified Owner'} • {source.website_url}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-neutral-700 font-medium">
                        {source.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {source.permission_status === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-3xs uppercase">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {source.permission_status === 'review_required' && (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-3xs uppercase">
                          <Clock className="w-3 h-3" /> Review Required
                        </span>
                      )}
                      {source.permission_status === 'restricted' && (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded text-3xs uppercase">
                          <XCircle className="w-3 h-3" /> Restricted
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                        <span>{source.reliability_score}%</span>
                        <div className="w-12 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              source.reliability_score >= 90
                                ? 'bg-emerald-500'
                                : source.reliability_score >= 70
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${source.reliability_score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {source.rate_limit_per_minute} req/min
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {source.permission_status !== 'approved' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdatePermission(source.id, 'approved')}
                            className="text-3xs py-1 px-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                          >
                            Approve
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdatePermission(source.id, 'restricted')}
                            className="text-3xs py-1 px-2 border-rose-300 text-rose-800 hover:bg-rose-50"
                          >
                            Restrict
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal: Register Source */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 bg-white shadow-2xl">
            <h3 className="text-base font-black text-neutral-900">Register New Discovery Source</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Add a manufacturing career page or partner vacancy feed. The source will be set to "Review Required" until legal terms & robots.txt are audited.
            </p>
            <form onSubmit={handleAddSource} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Endurance Technologies Chakan Careers"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Career / Feed URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://company.com/careers"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={newSourceCategory}
                    onChange={(e) => setNewSourceCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                  >
                    <option value="career_page">Career Page</option>
                    <option value="industrial_announcement">Industrial Bulletin</option>
                    <option value="job_board">Job Board</option>
                    <option value="employer_feed">Employer Feed</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Access Method</label>
                  <select
                    value={newSourceAccess}
                    onChange={(e) => setNewSourceAccess(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                  >
                    <option value="http_get">HTTP GET (HTML)</option>
                    <option value="rss_feed">RSS / XML Feed</option>
                    <option value="json_api">JSON API</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Source Owner</label>
                <input
                  type="text"
                  placeholder="e.g. Endurance Technologies Ltd."
                  value={newSourceOwner}
                  onChange={(e) => setNewSourceOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Rate Limit (Requests / Minute)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newSourceRateLimit}
                  onChange={(e) => setNewSourceRateLimit(parseInt(e.target.value, 10) || 6)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-neutral-900 text-white font-bold"
                >
                  Save Source
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
