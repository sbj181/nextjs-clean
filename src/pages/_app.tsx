import '~/styles/global.css';

import type { AppProps } from 'next/app';
import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google';
import { lazy, Suspense } from 'react';
import { SidebarProvider } from '../contexts/SidebarContext'; // Ensure the path is correct

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

export default function App({ Component, pageProps }: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps;

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
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
    </>
  );
}
