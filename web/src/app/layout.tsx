import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google'
import { Quicksand } from "next/font/google";
import "./globals.css";
import getConfig from "next/config";

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

  const {publicRuntimeConfig} = getConfig();

  return (
    <html lang="en">
      <body className={`${qs.className}`}>
        {children}
      </body>
      <GoogleAnalytics gaId={publicRuntimeConfig.googleAnalyticsID} />
    </html>
  );
}
