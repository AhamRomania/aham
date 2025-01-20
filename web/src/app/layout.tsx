"use client";

import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Quicksand } from "next/font/google";
import { MaterialTheme } from "./theme";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Global } from '@emotion/react'
import globalstyles from './css'

const cache = createCache({ key: "aham" });

import "./globals.css";

const qs = Quicksand({
  weight: "400",
  subsets: ["latin"],
});

import {
  extendTheme as materialExtendTheme,
  CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

const materialTheme = materialExtendTheme();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="aham">
      <body className={`${qs.className}`}>
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
