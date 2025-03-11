// pages/_app.tsx
import { Inter, Poppins, Roboto_Mono } from 'next/font/google'
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CryptoProvider } from '../context/CryptoContext';
import { useState } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono'
})

function MyApp({ Component, pageProps }: AppProps) {
  // Create a new QueryClient instance for each session
  // This ensures data isn't shared between users and requests
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <CryptoProvider>
        <div className={`${inter.variable} ${poppins.variable} ${robotoMono.variable}`}>
          <Component {...pageProps} />
        </div>
      </CryptoProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default MyApp;