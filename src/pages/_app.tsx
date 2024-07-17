import '~/styles/global.css';

import type { AppProps } from 'next/app';
import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { lazy, Suspense, useEffect, useRef } from 'react';

import Loading from '~/components/Loading';
import { supabase } from '~/lib/supabaseClient';

import { FavoritesProvider } from '../contexts/FavoritesContext';
import { SidebarProvider } from '../contexts/SidebarContext';

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

// Hidden helper component to ensure classes are included
const ClassHelper = () => (
  <div className="hidden">
    <div className="grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5"></div>
  </div>
);

export default function App({ Component, pageProps }: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps;
  const router = useRouter();
  const redirectHandled = useRef(false);

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (error) {
        console.error('Error handling auth redirect:', error.message);
        router.push('/error');
      } else {
        router.push('/profile');
      }
    };

    if (window.location.hash && window.location.hash.includes('access_token') && !redirectHandled.current) {
      redirectHandled.current = true; // Set the flag to prevent multiple redirects
      handleRedirect();
    }
  }, [router]);

  return (
    <>
      <FavoritesProvider>
        <Head>
          <link rel='icon' href='/core.png' />
        </Head>
        <Suspense fallback={<Loading />}>
          <SidebarProvider>
            {draftMode ? (
              <PreviewProvider token={token}>
                <Component {...pageProps} />
              </PreviewProvider>
            ) : (
              <Component {...pageProps} />
            )}
          </SidebarProvider>
        </Suspense>
      </FavoritesProvider>
    </>
  );
}
