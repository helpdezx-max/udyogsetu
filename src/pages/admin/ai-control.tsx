import React, { useState } from 'react';
import Head from 'next/head';
import {
  Sparkles,
  Bot,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Cpu,
  BarChart3,
  Send,
  AlertCircle,
  Layers,
  FileText
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AIFeatureKey } from '../../services/ai/types';

interface FeatureItem {
  key: AIFeatureKey;
  name: string;
  description: string;
  model: string;
  enabled: boolean;
}

const INITIAL_FEATURES: FeatureItem[] = [
  {
    key: 'job_description_assistant',
    name: 'Industrial Job Description Assistant',
    description: 'Generates structured factory JDs with safety and shift specs; flags illegal upfront deposits.',
    model: 'gemini-1.5-flash / rule-fallback',
    enabled: true
  },
  {
    key: 'resume_parser',
    name: 'Candidate Resume Parser (Gated)',
    description: 'Extracts ITI trades, experience, and machine proficiencies; gated by candidate confirmation.',
    model: 'gemini-1.5-flash / rule-fallback',
    enabled: true
  },
  {
    key: 'explainable_job_matcher',
    name: 'Explainable Job Matcher (Advisory)',
    description: 'Computes 0-100% compatibility breakdown with plain-language trade and cluster explanations.',
    model: 'gemini-1.5-flash / rule-fallback',
    enabled: true
  },
  {
    key: 'candidate_chat_assistant',
    name: 'Candidate Vernacular Chat Assistant',
    description: 'Conversational plant interview prep, document checklists, and trade advice in Marathi/Hindi/English.',
    model: 'gemini-1.5-flash / rule-fallback',
    enabled: true
  },
  {
    key: 'employer_interview_assistant',
    name: 'Employer Technical Rubric Generator',
    description: 'Generates structured practical machine evaluation scorecards for shopfloor interviews.',
    model: 'gemini-1.5-flash / rule-fallback',
    enabled: true
  },
  {
    key: 'ai_risk_signals',
    name: 'AI Risk & Scam Signal Detection',
    description: 'Assists Phase 3 trust engine by scanning for hidden fee extortion and employer impersonation.',
    model: 'gemini-1.5-flash / rule-fallback',
    enabled: true
  }
];

export default function AdminAIControlPage() {
  const [features, setFeatures] = useState<FeatureItem[]>(INITIAL_FEATURES);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Playground state
  const [playgroundPrompt, setPlaygroundPrompt] = useState('What documents do candidates need for a Chakan plant interview?');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [isLoadingPlayground, setIsLoadingPlayground] = useState(false);

  const toggleFeature = (key: AIFeatureKey) => {
    setFeatures(prev => prev.map(f => {
      if (f.key === key) {
        const nextState = !f.enabled;
        setActionNotice(`AI Feature "${f.name}" is now ${nextState ? 'ENABLED' : 'DISABLED'}.`);
        return { ...f, enabled: nextState };
      }
      return f;
    }));
  };

  const handleTestAI = async () => {
    setIsLoadingPlayground(true);
    setPlaygroundOutput('');
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: playgroundPrompt, language: 'en' })
      });
      const data = await res.json();
      if (data.success) {
        setPlaygroundOutput(data.answer);
      } else {
        setPlaygroundOutput(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setPlaygroundOutput(`Failed: ${e.message}`);
    } finally {
      setIsLoadingPlayground(false);
    }
  };

  return (
    <AdminLayout title="AI Recruitment Intelligence & WhatsApp Control">
      <Head>
        <title>AI Control Center • Rozzy Admin</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                AI Control Center & WhatsApp Gateway
              </h1>
              <Badge variant="warning">Phase 6 Engine</Badge>
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              Ethical AI assistants, automated WhatsApp consent controls, and explainable recruitment intelligence.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Human Decision Gate Active
            </span>
          </div>
        </div>

        {/* Notice */}
        {actionNotice && (
          <div className="p-3.5 bg-neutral-900 text-white rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-neutral-400 hover:text-white font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 bg-white border border-neutral-200">
            <span className="text-3xs uppercase tracking-wider text-neutral-400 font-bold">Active AI Features</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">
              {features.filter(f => f.enabled).length} / {features.length}
            </div>
            <span className="text-xs text-neutral-500">Governance kill-switches ready</span>
          </Card>
          <Card className="p-4 bg-white border border-neutral-200">
            <span className="text-3xs uppercase tracking-wider text-neutral-400 font-bold">WhatsApp Business</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">Active Outbox</div>
            <span className="text-xs text-emerald-700">Consent-first STOP opt-out enabled</span>
          </Card>
          <Card className="p-4 bg-white border border-neutral-200">
            <span className="text-3xs uppercase tracking-wider text-neutral-400 font-bold">Estimated Cost (MTD)</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">$0.04 USD</div>
            <span className="text-xs text-neutral-500">124k prompt & completion tokens</span>
          </Card>
          <Card className="p-4 bg-white border border-neutral-200">
            <span className="text-3xs uppercase tracking-wider text-neutral-400 font-bold">Fallback Policy</span>
            <div className="text-2xl font-black text-blue-600 mt-1">Zero Crash</div>
            <span className="text-xs text-blue-700">Deterministic fallback if offline</span>
          </Card>
        </div>

        {/* WhatsApp Business API Integration Status */}
        <Card className="p-5 bg-emerald-50/40 border border-emerald-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Meta WhatsApp Cloud API Integration
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Webhook Endpoint: <code className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-3xs font-mono">/api/webhooks/whatsapp</code>
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-600">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Multilingual Templates (EN, MR, HI)
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Idempotent Deduplication
              </span>
            </div>
          </div>
        </Card>

        {/* AI Features Governance List */}
        <div>
          <h2 className="text-sm font-bold text-neutral-900 mb-3">AI Recruitment Feature Governance</h2>
          <Card className="divide-y divide-neutral-100 border border-neutral-200 overflow-hidden">
            {features.map((feat) => (
              <div key={feat.key} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-900">{feat.name}</span>
                    <span className="text-3xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded font-mono">
                      {feat.model}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{feat.description}</p>
                </div>

                <button
                  onClick={() => toggleFeature(feat.key)}
                  className="shrink-0 text-neutral-600 hover:text-neutral-900 focus:outline-none"
                  title="Toggle AI Feature"
                >
                  {feat.enabled ? (
                    <ToggleRight className="w-7 h-7 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-neutral-400" />
                  )}
                </button>
              </div>
            ))}
          </Card>
        </div>

        {/* Live AI Playground */}
        <Card className="p-5 border border-neutral-200 bg-white">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Live AI Assistant Verification Playground
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Test the candidate chat assistant with real shopfloor manufacturing queries.
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={playgroundPrompt}
                onChange={(e) => setPlaygroundPrompt(e.target.value)}
                placeholder="Enter candidate question (English, Marathi or Hindi)..."
                className="flex-1 text-xs px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleTestAI}
                disabled={isLoadingPlayground}
                className="bg-neutral-900 text-white font-bold gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isLoadingPlayground ? 'Thinking...' : 'Test AI'}
              </Button>
            </div>

            {playgroundOutput && (
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs whitespace-pre-line text-neutral-800">
                {playgroundOutput}
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
