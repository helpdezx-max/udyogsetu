import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MapPin, Building2, Bus, ArrowRight } from 'lucide-react';
import { INDUSTRIAL_CLUSTERS } from '../../data/demo-data';

export default function IndustrialLocationsPage() {
  const palettes = [
    { bg: 'bg-[#F7F8FA]', border: 'border-[#E4E6EB]' },
    { bg: 'bg-[#F1F8F4]', border: 'border-[#D5ECE0]' },
    { bg: 'bg-[#F2F6FD]', border: 'border-[#D8E6FA]' },
    { bg: 'bg-[#FAF4F0]', border: 'border-[#F4E3DA]' },
    { bg: 'bg-[#FFF9EE]', border: 'border-[#FAECBF]' },
    { bg: 'bg-[#F7F4FC]', border: 'border-[#E8E0F5]' },
  ];

  return (
    <>
      <Head>
        <title>Industrial Clusters & Manufacturing Hubs • UdyogSetu Chakan & Pune MIDC</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 space-y-7">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-3xs font-bold uppercase tracking-wider border border-neutral-200">
            <MapPin className="w-3.5 h-3.5 text-neutral-600" />
            <span>Hyperlocal Geographies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
            Chakan & Surrounding Industrial Belts
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
            Detailed breakdown of manufacturing clusters, transit routes, key industries, and open plant vacancies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INDUSTRIAL_CLUSTERS.map((cluster, idx) => {
            const p = palettes[idx % palettes.length];

            return (
              <div
                key={cluster.id}
                id={cluster.id}
                className={`${p.bg} ${p.border} border rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-card transition-all`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-3xs font-bold text-neutral-700 bg-white px-2.5 py-0.5 rounded-full border border-neutral-200 shadow-2xs">
                        PIN {cluster.pincode} • {cluster.zone}
                      </span>
                      <h2 className="text-lg font-bold text-neutral-950 mt-2">{cluster.name}</h2>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200/80 shadow-2xs">
                      {cluster.openJobsCount} Openings
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">{cluster.description}</p>

                  <div className="p-3.5 bg-white/80 rounded-2xl border border-neutral-200/60 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-3xs uppercase tracking-wider text-neutral-500">Key Landmark:</span>{' '}
                        <span className="text-neutral-800 text-xs">{cluster.landmark}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bus className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-3xs uppercase tracking-wider text-neutral-500">Public Transit Access:</span>{' '}
                        <span className="text-neutral-800 text-xs">{cluster.transitAccess}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                  <span className="text-3xs text-neutral-500">
                    <span className="font-bold text-neutral-900">{cluster.activeCompaniesCount}</span> manufacturing units
                  </span>
                  <Link href={`/jobs?cluster=${encodeURIComponent(cluster.name)}`}>
                    <button className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1">
                      <span>Explore Vacancies</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
