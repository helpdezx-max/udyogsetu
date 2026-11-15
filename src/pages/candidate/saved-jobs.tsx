import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Bookmark, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { JobCard } from '../../components/common/JobCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export default function CandidateSavedJobsPage() {
  const { savedJobIds, jobs } = useApp();

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <CandidateLayout>
      <Head>
        <title>Saved Industrial Vacancies • UdyogSetu</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-industrial-900">Saved Vacancies</h2>
            <p className="text-xs text-industrial-500 mt-0.5">
              Review and apply to positions you bookmarked across Chakan MIDC.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
            {savedJobs.length} Bookmarked
          </span>
        </div>

        {savedJobs.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="w-8 h-8" />}
            title="No Bookmarked Vacancies"
            description="Browse industrial jobs and click the bookmark icon on any job card to save it for quick access."
            action={
              <Link href="/jobs">
                <Button variant="primary">Browse Openings</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
