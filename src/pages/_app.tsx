import React, { useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { ApplyModal } from '../components/common/ApplyModal';
import { fireConfettiBlast } from '../utils/confetti';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Trigger celebratory confetti blast whenever a user arrives post-signin or post-registration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const justSignedIn = sessionStorage.getItem('just_signed_in');
      if (justSignedIn === 'true') {
        sessionStorage.removeItem('just_signed_in');
        const timer = setTimeout(() => {
          fireConfettiBlast();
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [router.asPath]);

  return (
    <AuthProvider>
      <AppProvider>
        <Head>
          <title>Rozzy • Hyperlocal Industrial Employment Network (Chakan MIDC)</title>
          <meta
            name="description"
            content="Genuine factory, manufacturing and industrial job vacancies across Chakan MIDC, Khed City, Kuruli, and Pune industrial clusters. Transparent salary and direct plant hiring."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Rozzy" />
          <meta name="application-name" content="Rozzy" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preload" href="/fonts/ProductSans-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
          <link rel="preload" href="/fonts/ProductSans-Bold.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        </Head>

        {/* Clean full-bleed Mobbin-style application shell */}
        <div className="min-h-screen bg-white text-zinc-900 flex flex-col antialiased selection:bg-zinc-950 selection:text-white pb-16 md:pb-0 overflow-x-hidden w-full max-w-full">
          {/* Sticky Header */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 w-full">
            <Component {...pageProps} />
          </main>

          {/* Clean Footer */}
          <Footer />

          {/* Native Mobile Webapp Bottom Tab Bar */}
          <MobileBottomNav />

          <ApplyModal />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}
