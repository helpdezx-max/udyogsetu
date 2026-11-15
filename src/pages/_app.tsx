import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ApplyModal } from '../components/common/ApplyModal';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthProvider>
      <AppProvider>
        <Head>
          <title>UdyogSetu • Hyperlocal Industrial Employment Network (Chakan MIDC)</title>
          <meta
            name="description"
            content="Genuine factory, manufacturing and industrial job vacancies across Chakan MIDC, Khed City, Kuruli, and Pune industrial clusters. Transparent salary and direct plant hiring."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* 1. DARK CHARCOAL OUTER BACKGROUND FRAMING (Locked 100vh app viewport) */}
        <div className="h-screen h-[100dvh] max-h-screen max-h-[100dvh] bg-[#18181B] p-2.5 sm:p-5 lg:p-6 flex flex-col overflow-hidden selection:bg-neutral-900 selection:text-white">
          
          {/* 2. STATIC TOP NAVIGATION BAR (Fixed at top) */}
          <div className="shrink-0 w-full mb-2.5 sm:mb-3 lg:mb-4 z-40">
            <Header />
          </div>

          {/* 3. SCROLLABLE MIDDLE SECTION (Only this container moves) */}
          <div className="flex-1 min-h-0 w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-800/10 flex flex-col overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400">
            <main className="flex-1 flex flex-col min-h-0">
              <Component {...pageProps} />
            </main>
          </div>

          {/* 4. STATIC BOTTOM FOOTER (Fixed at bottom) */}
          <div className="shrink-0 w-full pt-2.5 sm:pt-3 lg:pt-3.5 z-20">
            <Footer />
          </div>

          <ApplyModal />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}
