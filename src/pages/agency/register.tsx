import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Users2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function AgencyRegisterPage() {
  const router = useRouter();
  const { signUpAgency, isConfigured } = useAuth();
  const { setActiveRole } = useApp();

  const [agencyName, setAgencyName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (isConfigured) {
      const { data, error } = await signUpAgency({
        email,
        password,
        fullName,
        phone,
        agencyName,
        licenseNo,
      });

      if (error) {
        setErrorMessage(error.message || 'Agency registration failed.');
        setIsSubmitting(false);
        return;
      }
    }

    setActiveRole('agency');
    setIsSubmitting(false);
    router.push('/agency/dashboard');
  };

  return (
    <>
      <Head>
        <title>Agency & Contractor Registration • UdyogSetu</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-industrial-100/50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-industrial-200 p-8 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center mx-auto shadow-sm">
              <Users2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-industrial-900 tracking-tight">Contractor Registration</h1>
            <p className="text-xs text-industrial-500">
              For licensed manpower contractors supplying industrial labor in Chakan.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <Input
              label="Agency / Contractor Name"
              placeholder="e.g. Pragati Manpower Services"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              required
            />

            <Input
              label="Labour Contractor License Number"
              placeholder="LAB-CON-REG-XXXX-XX"
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
              required
            />

            <Input
              label="Agency Representative Full Name"
              placeholder="e.g. Sachin Deshmukh"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Official Agency Email"
              type="email"
              placeholder="contact@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Portal Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <Input
              label="Authorized Contact Mobile"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold bg-indigo-700 hover:bg-indigo-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Agency Profile'}
            </Button>
          </form>

          <div className="pt-4 border-t border-industrial-100 text-center text-xs text-industrial-600">
            <span>Already registered? </span>
            <Link href="/agency/login" className="font-bold text-indigo-700 hover:underline">
              Sign In to Agency Portal
            </Link>
          </div>

          <div className="bg-industrial-50 rounded-xl p-3 border border-industrial-200 text-2xs text-industrial-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Valid Contract Labour (Regulation & Abolition) license required for verification.</span>
          </div>
        </div>
      </div>
    </>
  );
}
