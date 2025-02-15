"use client";

import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { MaterialTheme } from "./theme";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Global } from '@emotion/react'
import globalstyles from './css'

const cache = createCache({ key: "aham" });

import "./globals.css";

const interFont = Inter({subsets:["latin"]});

import {
  extendTheme as materialExtendTheme,
  CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import Head from "next/head";
// import CssBaseline from "@mui/material/CssBaseline";
import { register } from 'timeago.js';
import ro from 'timeago.js/lib/lang/ro';

register('ro', ro);

const materialTheme = materialExtendTheme();

console.info("Salut, scrie la admin@aham.ro pentru curiozități tehnice.");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="aham">
      <Head>
        <meta name="theme-color" defaultValue="#1F70B8"/>
        <link rel="apple-touch-icon" href="favicons/favicon-180x180.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/favicon-180x180.png"/>
        <meta name="msapplication-TileColor" content="#1F70B8"/>
        <meta name="msapplication-TileImage" content="favicons/favicon-180x180.png"/>
        <link rel="manifest" href="/aham.webmanifest"/>
        <link rel="dns-prefetch" href="//cdn.aham.ro"/>
      </Head>
      <body className={`${interFont.className}`}>
        <CacheProvider value={cache}>
          <AppRouterCacheProvider options={{ key: "aham" }}>
            <ThemeProvider theme={MaterialTheme}>
              <MaterialCssVarsProvider
                theme={{ [MATERIAL_THEME_ID]: materialTheme }}
              >
                <JoyCssVarsProvider>
                  {/*<CssBaseline enableColorScheme />*/}
                  <Global styles={globalstyles}/>
                  {children}
                </JoyCssVarsProvider>
              </MaterialCssVarsProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </CacheProvider>
      </body>
      <GoogleAnalytics gaId="G-1X7Y30KPPK" />
    </html>
  );
}
