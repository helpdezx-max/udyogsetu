import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CHAKAN_PILOT_LOCATIONS } from '../../data/pilot-locations';
import { fireConfettiBlast } from '../../utils/confetti';

export default function EmployerSignupPage() {
  const router = useRouter();
  const { signUpEmployer } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Representative
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('HR Manager / Recruitment Lead');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 2: Company Details
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState<'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Proprietorship' | 'Foreign Subsidiary'>('Private Limited');
  const [industry, setIndustry] = useState('Auto Components Tier-1');
  const [website, setWebsite] = useState('');
  const [clusterId, setClusterId] = useState('chakan-phase-1');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter the authorized representative name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid official work email address.');
      return;
    }

    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters with letters and numbers.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must accept the Employer Terms of Service.');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!companyName.trim()) {
      setErrorMessage('Please enter the registered company name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, companyId, error } = await signUpEmployer({
        email: email.trim().toLowerCase(),
        password,
        fullName: fullName.trim(),
        phone: phone.replace(/[^0-9]/g, ''),
        designation,
        companyName: companyName.trim(),
        businessType,
        industry,
        website: website.trim() || undefined,
        clusterId,
      });

      if (error) {
        setErrorMessage(error.message || 'Employer registration failed. Please review the details.');
        setIsSubmitting(false);
        return;
      }

      setRegistrationComplete(true);
      setIsSubmitting(false);

      // Fire celebratory confetti blast
      fireConfettiBlast();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('just_signed_in', 'true');
      }

      setTimeout(() => {
        router.push('/employer/onboarding');
      }, 1500);

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Employer Registration • Rozzy Chakan</title>
        <meta
          name="description"
          content="Register your manufacturing plant, automotive supplier or factory on Rozzy for verified hiring in Chakan & Pune."
        />
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-industrial-200 p-7 sm:p-9 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-industrial-950 tracking-tight">
              Employer Registration
            </h1>
            <p className="text-xs sm:text-sm text-industrial-600">
              Create your corporate hiring workspace for Chakan MIDC & Pune industrial clusters.
            </p>

            {/* Stepper indicator */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 1 ? 'text-amber-700' : 'text-emerald-600'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-3xs ${step === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900'}`}>
                  {step > 1 ? '✓' : '1'}
                </span>
                <span>Representative</span>
              </div>
              <div className="w-8 h-0.5 bg-industrial-200" />
              <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 2 ? 'text-amber-700' : 'text-industrial-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-3xs ${step === 2 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-industrial-100 text-industrial-500'}`}>
                  2
                </span>
                <span>Company Details</span>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {registrationComplete && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Employer Account & Company Workspace Created!</span>
              </div>
              <p className="text-xs text-emerald-700">
                Company status: <strong>Pending Verification</strong>. Redirecting you to the verification checklist and onboarding...
              </p>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {!registrationComplete && step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                  Authorized Representative Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rameshwar Patil"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Official Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hr@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9822000000"
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                  Designation / Role in Company *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. HR Head / Plant Director"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-industrial-400 hover:text-industrial-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="emp-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-industrial-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="emp-terms" className="text-xs text-industrial-600 leading-relaxed">
                  I confirm that I am an authorized corporate representative of the company and accept the{' '}
                  <Link href="/terms" target="_blank" className="font-bold text-industrial-900 underline">
                    Employer Terms of Service
                  </Link>{' '}
                  and anti-extortion recruitment guidelines.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Continue to Company Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {!registrationComplete && step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                  Registered Company Legal Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Sahyadri Precision Engineering Pvt. Ltd."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Business Entity Type *
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-industrial-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium bg-white"
                  >
                    <option value="Private Limited">Private Limited Company</option>
                    <option value="Public Limited">Public Limited Company</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="Partnership">Registered Partnership Firm</option>
                    <option value="Proprietorship">Sole Proprietorship</option>
                    <option value="Foreign Subsidiary">Foreign Subsidiary / MNC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Manufacturing Industry Sector *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-industrial-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium bg-white"
                  >
                    <option value="Auto Components Tier-1">Auto Components (Tier-1 / Tier-2)</option>
                    <option value="Automotive OEM">Automotive OEM (4W / 2W / EV)</option>
                    <option value="Tool & Die Fabrication">Tool, Die & Stamping Tooling</option>
                    <option value="EV Powertrain & Battery">EV Powertrain & Battery Packaging</option>
                    <option value="Heavy Engineering">Heavy Engineering & Structural Welding</option>
                    <option value="Plastic Injection Molding">Automotive Plastic Injection Trims</option>
                    <option value="Warehousing & Logistics">Industrial 3PL Warehousing & Logistics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Primary Plant Cluster (Location) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      value={clusterId}
                      onChange={(e) => setClusterId(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-industrial-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium bg-white appearance-none"
                    >
                      {CHAKAN_PILOT_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.pincode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Company Website (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Statutory Verification Notice</span>
                </div>
                <p className="text-3xs text-amber-800">
                  Initial registration creates a <strong>Pending Verification</strong> workspace. You will be prompted in the subsequent onboarding step to upload GSTIN / Udyam registration certificates before job publishing.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-5 rounded-xl border border-industrial-300 text-industrial-700 font-bold text-xs hover:bg-industrial-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Employer Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Switch to Signin */}
          <div className="text-center pt-4 border-t border-industrial-100">
            <p className="text-xs text-industrial-600">
              Already have an employer account?{' '}
              <Link href="/signin" className="font-bold text-amber-700 hover:underline">
                Sign in to Employer Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
