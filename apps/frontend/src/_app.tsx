import type { AppProps } from 'next/app';
import './index.css';

export default function App({ Component, pageProps }: AppProps) {
  <Component {...pageProps} />;
}
