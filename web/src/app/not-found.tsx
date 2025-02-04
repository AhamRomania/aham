"use client"

import { MainLayout } from "@/c/Layout";
import { css } from "@emotion/react";

export default function NotFound() {
  return (
    <MainLayout>
      <div
        css={css`
          padding: 200px 0;  
        `}
      >
        Eroare 404 la acest URL &apos;<em>{(typeof(window) != 'undefined') ? window.location.pathname : '...'}</em>&apos;, această pagină nu a fost găsită.
      </div>
    </MainLayout>
  );
}
