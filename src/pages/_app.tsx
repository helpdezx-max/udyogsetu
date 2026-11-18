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

        {/* Clean full-bleed Mobbin-style application shell */}
        <div className="min-h-screen bg-white text-zinc-900 flex flex-col antialiased selection:bg-zinc-950 selection:text-white">
          {/* Sticky Header */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 w-full">
            <Component {...pageProps} />
          </main>

          {/* Clean Footer */}
          <Footer />

          <ApplyModal />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}
