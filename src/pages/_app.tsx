import '~/styles/global.css';
import type { AppProps } from 'next/app';
import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google';
import { lazy, Suspense, useEffect, useState } from 'react';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { SidebarProvider } from '../contexts/SidebarContext';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';

export interface SharedPageProps {
  draftMode: boolean;
  token: string;
}

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'));

const mono = IBM_Plex_Mono({
  variable: '--font-family-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
});

const sans = Inter({
  variable: '--font-family-sans',
  subsets: ['latin'],
  weight: ['500', '700', '800'],
});

const serif = PT_Serif({
  variable: '--font-family-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
});

const ClassHelper = () => (
  <div className="hidden">
    <div className="grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5"></div>
  </div>
);

export default function App({ Component, pageProps }: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps;
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <FavoritesProvider>
        <Head>
          <link rel='icon' href='/core.png' />
        </Head>
        <Suspense fallback={<div>Loading...</div>}>
          <SidebarProvider>
            {draftMode ? (
              <PreviewProvider token={token}>
                <Component {...pageProps} session={session} />
              </PreviewProvider>
            ) : (
              <Component {...pageProps} session={session} />
            )}
          </SidebarProvider>
        </Suspense>
      </FavoritesProvider>
    </>
  );
}
