import React, { useState } from 'react';
import Head from 'next/head';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  FileText,
  Briefcase,
  MapPin,
  Clock,
  HelpCircle
} from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export default function CandidateAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Namaskar! I am UdyogSetu AI, your industrial career assistant. I can help you prepare for factory walk-ins in Chakan, understand ITI/Diploma machine requirements, and find jobs with company bus facilities. How can I help you today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState<'en' | 'mr' | 'hi'>('en');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: text, language: selectedLang })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: 'I encountered an error retrieving that information. Please try asking again.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to reach the assistant right now. You can continue searching verified vacancies in the Jobs directory.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CandidateLayout>
      <Head>
        <title>AI Career Assistant • Candidate Portal</title>
      </Head>

      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-500" />
              UdyogSetu AI • Factory Career Assistant
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Vernacular assistance for Chakan MIDC factory walk-ins, ITI trades, and document checklists.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedLang('en')}
              className={`px-2.5 py-1 rounded font-medium ${selectedLang === 'en' ? 'bg-white shadow-xs font-bold text-neutral-900' : 'text-neutral-600'}`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang('mr')}
              className={`px-2.5 py-1 rounded font-medium ${selectedLang === 'mr' ? 'bg-white shadow-xs font-bold text-neutral-900' : 'text-neutral-600'}`}
            >
              मराठी
            </button>
            <button
              onClick={() => setSelectedLang('hi')}
              className={`px-2.5 py-1 rounded font-medium ${selectedLang === 'hi' ? 'bg-white shadow-xs font-bold text-neutral-900' : 'text-neutral-600'}`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Quick Prompt Suggestions */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleSend('What documents do I need for a Chakan factory walk-in interview?')}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full transition-colors flex items-center gap-1.5"
          >
            📋 Interview Document Checklist
          </button>
          <button
            onClick={() => handleSend('Tell me about VMC Machine Operator duties and salary in Chakan')}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full transition-colors flex items-center gap-1.5"
          >
            ⚙️ VMC Machine Operator Details
          </button>
          <button
            onClick={() => handleSend('Which manufacturing companies offer company bus facilities from Bhosari?')}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full transition-colors flex items-center gap-1.5"
          >
            🚌 Bus Routes & Canteen Facilities
          </button>
        </div>

        {/* Chat Window */}
        <Card className="flex flex-col h-[500px] border border-neutral-200 overflow-hidden">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-neutral-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-neutral-900 text-white rounded-br-xs'
                      : 'bg-white text-neutral-800 border border-neutral-200 shadow-xs rounded-bl-xs whitespace-pre-line'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`text-3xs block mt-1.5 ${
                      m.sender === 'user' ? 'text-neutral-400 text-right' : 'text-neutral-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 italic">
                <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                <span>UdyogSetu AI is analyzing manufacturing guidance...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-neutral-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder={
                  selectedLang === 'mr'
                    ? 'कारखान्यातील नोकरी किंवा मुलाखतीबद्दल प्रश्न विचारा...'
                    : selectedLang === 'hi'
                    ? 'फैक्ट्री जॉब या इंटरव्यू के बारे में पूछें...'
                    : 'Ask about factory interviews, machine trades, or Chakan clusters...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isLoading || !inputText.trim()}
                className="bg-neutral-900 text-white font-bold gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </Button>
            </form>
            <p className="text-3xs text-neutral-400 mt-1.5 text-center">
              Advisory only. Official hiring decisions and walk-in verifications are conducted directly by plant HR teams.
            </p>
          </div>
        </Card>
      </div>
    </CandidateLayout>
  );
}
