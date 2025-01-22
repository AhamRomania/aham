"use client"

import { MainLayout } from "@/c/Layout";

export default function NotFound() {
  return (
    <MainLayout>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "242px 0"
      }}>
        Eroare 404 la acest URL '<em>{window.location.pathname}</em>', această pagină nu a fost găsită.
      </div>
    </MainLayout>
  );
}
