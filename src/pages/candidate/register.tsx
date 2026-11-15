import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function CandidateRegisterPage() {
  const router = useRouter();
  const { signUpCandidate, isConfigured } = useAuth();
  const { setActiveRole, updateCandidateProfile } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('ITI (Fitter/Machinist/Turner/Welder/Electrician)');
  const [preferredLanguage, setPreferredLanguage] = useState<'mr' | 'hi' | 'en'>('mr');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (isConfigured) {
      const { data, error } = await signUpCandidate({
        email,
        password,
        fullName,
        phone,
        highestQualification: qualification,
        preferredLanguage,
      });

      if (error) {
        setErrorMessage(error.message || 'Registration failed. Please check your details.');
        setIsSubmitting(false);
        return;
      }
    }

    // Update local profile state
    await updateCandidateProfile({
      fullName: fullName || 'New Registered Candidate',
      phone: phone || '+91 98000 00000',
      email: email || 'candidate@example.com',
      highestQualification: qualification,
    });

    setActiveRole('candidate');
    setIsSubmitting(false);
    router.push('/candidate/onboarding');
  };

  return (
    <>
      <Head>
        <title>Candidate Registration • UdyogSetu Chakan</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-industrial-100/50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-industrial-200 p-8 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-industrial-900 tracking-tight">Create Candidate Account</h1>
            <p className="text-xs text-industrial-500">
              100% Free registration for industrial job seekers in Chakan & Pune.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Mahesh Shinde"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email Address (Login ID)"
              type="email"
              placeholder="e.g. mahesh.shinde@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Create Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <Input
              label="Mobile Number (WhatsApp)"
              placeholder="10-digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<span className="text-xs font-bold text-industrial-500">+91</span>}
              required
            />

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                Highest Qualification
              </label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
              >
                <option value="10th / 12th">10th / 12th Pass</option>
                <option value="ITI (Fitter/Machinist/Turner/Welder/Electrician)">
                  ITI (Fitter / Machinist / Turner / Welder / Electrician)
                </option>
                <option value="Diploma (Mechanical/Auto/Electrical)">
                  Diploma (Mechanical / Auto / Electrical / Production)
                </option>
                <option value="B.E. / B.Tech (Mechanical/Prod)">B.E. / B.Tech (Mechanical / Production)</option>
                <option value="Any Graduate">Any Graduate (B.Com / B.Sc / B.A)</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                Preferred Interface Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mr', label: 'मराठी' },
                  { id: 'hi', label: 'हिन्दी' },
                  { id: 'en', label: 'English' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setPreferredLanguage(l.id as any)}
                    className={`py-2 text-xs font-bold rounded-lg border text-center transition-colors ${
                      preferredLanguage === l.id
                        ? 'border-brand-600 bg-brand-50 text-brand-900'
                        : 'border-industrial-200 text-industrial-600 hover:border-industrial-300'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full font-bold" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Register & Build Industrial Bio'}
            </Button>
          </form>

          <div className="pt-4 border-t border-industrial-100 text-center text-xs text-industrial-600">
            <span>Already have an account? </span>
            <Link href="/candidate/login" className="font-bold text-brand-600 hover:underline">
              Sign In
            </Link>
          </div>

          <div className="bg-industrial-50 rounded-xl p-3 border border-industrial-200 text-2xs text-industrial-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero recruitment charges. Never pay money for any industrial interview in Chakan.</span>
          </div>
        </div>
      </div>
    </>
  );
}
