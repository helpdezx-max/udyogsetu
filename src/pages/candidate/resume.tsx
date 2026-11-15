import React, { useState } from 'react';
import Head from 'next/head';
import { FileText, Upload, CheckCircle2, AlertCircle, Info, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { Card } from '../../components/ui/Card';
import { candidateService } from '../../services/candidateService';

export default function CandidateResumePage() {
  const { candidateProfile, updateCandidateProfile } = useApp();
  const { user, isConfigured } = useAuth();

  const [resumeName, setResumeName] = useState(candidateProfile.resumeFileName || 'Mahesh_Shinde_ITI_Resume.pdf');
  const [uploadedTime, setUploadedTime] = useState('10-Nov-2026');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadError(null);
      setIsUploading(true);

      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setUploadError('Only PDF files (max 10MB) are allowed for factory verification.');
        setIsUploading(false);
        return;
      }

      if (isConfigured && user) {
        const { error } = await candidateService.uploadResume(user.id, candidateProfile.id, file);
        if (error) {
          setUploadError(error.message || 'Failed to upload resume to Supabase Storage.');
          setIsUploading(false);
          return;
        }
      }

      const fileName = file.name;
      setResumeName(fileName);
      setUploadedTime('Just now');
      await updateCandidateProfile({ resumeFileName: fileName });
      setUploadSuccess(true);
      setIsUploading(false);
      setTimeout(() => setUploadSuccess(false), 4000);
    }
  };

  return (
    <CandidateLayout>
      <Head>
        <title>Resume & Trade Certificates • Candidate Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Resume & Educational Certificates</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Uploaded resumes are encrypted and stored in private Supabase Storage buckets. Only employers who receive your application can view them.
          </p>
        </div>

        {uploadError && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Primary Resume Box */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-industrial-100">
            <h3 className="font-bold text-sm text-industrial-900">Current Active Resume (PDF Only)</h3>
            {uploadSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded to Private Storage
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-industrial-50 border border-industrial-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-100 text-brand-700 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-industrial-900">{resumeName}</h4>
                <p className="text-2xs text-industrial-500">
                  Uploaded {uploadedTime} • Protected by Row Level Security
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className={`cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <span className="inline-flex items-center justify-center font-medium rounded-lg text-xs px-3 py-1.5 gap-1.5 bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  {isUploading ? 'Uploading to Supabase...' : 'Upload New PDF Version'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 text-2xs text-industrial-500 bg-industrial-100/60 p-3 rounded-lg">
            <Lock className="w-3.5 h-3.5 text-industrial-700 shrink-0" />
            <span>
              Resumes in UdyogSetu are non-public. They cannot be crawled by search engines or downloaded by unauthorized parties.
            </span>
          </div>
        </Card>

        {/* Verified Technical Certificates */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-sm text-industrial-900">Trade Credentials (NCVT / MSBTE / DTE)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ITI National Trade Certificate (NTC)
                </span>
                <span className="text-2xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Trade: Machinist
                </span>
              </div>
              <p className="text-2xs text-emerald-700">
                Issued by Government ITI Aundh / Chakan. Verified by standard manufacturing guidelines.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-industrial-200 bg-industrial-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-industrial-900">Apprenticeship Certificate (NAPS)</span>
                <span className="text-2xs bg-industrial-200 text-industrial-700 font-bold px-2 py-0.5 rounded">
                  Pending Document
                </span>
              </div>
              <p className="text-2xs text-industrial-500">
                Upload your 1-year Apprenticeship completion certificate to qualify for Grade-A technician vacancies.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </CandidateLayout>
  );
}
