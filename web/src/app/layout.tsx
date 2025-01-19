"use client";

import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Quicksand } from "next/font/google";
import { MaterialTheme } from "./theme";

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
    <html lang="en">
      <body className={`${qs.className}`}>
        <AppRouterCacheProvider options={{ key: "aham" }}>
          <ThemeProvider theme={MaterialTheme}>
            <MaterialCssVarsProvider
              theme={{ [MATERIAL_THEME_ID]: materialTheme }}
            >
              <JoyCssVarsProvider>
                <CssBaseline enableColorScheme />
                {children}
              </JoyCssVarsProvider>
            </MaterialCssVarsProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
      <GoogleAnalytics gaId="G-1X7Y30KPPK" />
    </html>
  );
}
