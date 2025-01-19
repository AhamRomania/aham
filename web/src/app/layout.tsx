import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { GoogleAnalytics } from '@next/third-parties/google'
import { Quicksand } from "next/font/google";
import "./globals.css";
import getConfig from "next/config";
import { ThemeProvider } from "@mui/material";
import theme from './theme';

const qs = Quicksand({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Aham: Bazarul tău",
  description: "Începe explorarea în bazarul tău preferat unde găsești și cunoști o grămadă de lucruri.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { publicRuntimeConfig } = getConfig();

  return (
    <html lang="en">
      <body className={`${qs.className}`}>
        <AppRouterCacheProvider options={{ key: 'aham' }}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
      <GoogleAnalytics gaId={publicRuntimeConfig.googleAnalyticsID} />
    </html>
  );
}
