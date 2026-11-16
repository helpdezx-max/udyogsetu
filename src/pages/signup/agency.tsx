import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AgencySignupPage() {
  const router = useRouter();
  const { signUpAgency } = useAuth();

  const [agencyName, setAgencyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [businessType, setBusinessType] = useState('Private Limited');
  const [website, setWebsite] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [specialization, setSpecialization] = useState('CNC Machinists, Welders & Assembly Line Manpower');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agencyName.trim()) {
      setErrorMessage('Please enter the registered recruitment agency / staffing firm name.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter the authorized representative name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid official business email.');
      return;
    }

    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters with numbers and letters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must accept the Recruitment Agency Terms & Statutory Compliance Guidelines.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, agencyId, error } = await signUpAgency({
        email: email.trim().toLowerCase(),
        password,
        fullName: fullName.trim(),
        phone: phoneClean,
        agencyName: agencyName.trim(),
        businessType,
        website: website.trim() || undefined,
        licenseNo: licenseNo.trim() || undefined,
        specialization,
      });

      if (error) {
        setErrorMessage(error.message || 'Agency registration failed. Please review the details.');
        setIsSubmitting(false);
        return;
      }

      setRegistrationComplete(true);
      setIsSubmitting(false);

      setTimeout(() => {
        router.push('/agency/verification');
      }, 1500);

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during agency signup.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Recruitment Agency Registration • UdyogSetu Chakan</title>
        <meta
          name="description"
          content="Register an authorized staffing agency or manpower contractor on UdyogSetu industrial network in Chakan & Pune."
        />
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-industrial-200 p-7 sm:p-9 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-industrial-950 tracking-tight">
              Recruitment Agency Registration
            </h1>
            <p className="text-xs sm:text-sm text-industrial-600">
              Staffing firms, manpower contractors & industrial recruitment consultants.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-3xs font-extrabold text-purple-900">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>CONTRACT LABOR REGULATION (CLRA) COMPLIANCE REQUIRED</span>
            </div>
          </div>

          {registrationComplete && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Agency Account Created!</span>
              </div>
              <p className="text-xs text-emerald-700">
                Agency status: <strong>Pending Verification</strong>. Redirecting you to the compliance documentation page...
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {!registrationComplete && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                  Recruitment Agency / Staffing Firm Name *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. Pune Industrial Staffing Solutions LLP"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-industrial-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Authorized Representative Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sandeep Kadam"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Official Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sandeep@punestaffing.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      placeholder="9823000000"
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Labor License / CLRA No. (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      placeholder="e.g. CLRA/PUN/2026/894"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                  Recruitment Specialization *
                </label>
                <input
                  type="text"
                  required
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. VMC Machine Operators, Stamping Press Toolmakers, Assembly Line"
                  className="w-full px-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-industrial-900 font-medium"
                />
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
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-industrial-900 font-medium"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agency-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-industrial-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="agency-terms" className="text-xs text-industrial-600 leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="font-bold text-industrial-900 underline">
                    Agency Terms of Service
                  </Link>
                  . I agree to recruit strictly under verified employer client mandates and pledge never to demand placement fees or security deposits from job seekers.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registering Recruitment Agency...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Agency Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-4 border-t border-industrial-100">
            <p className="text-xs text-industrial-600">
              Already have an agency account?{' '}
              <Link href="/signin" className="font-bold text-purple-600 hover:underline">
                Sign in to Agency Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
