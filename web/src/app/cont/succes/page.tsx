"use client";

import OrSection from "@/c/orsection";
import { css } from "@emotion/react";
import { Button } from "@mui/joy";
import Link from "next/link";


export default function Page() {
  
  return (
    <div
      css={css`
        width: 323px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-item: center;
        text-align: center;
      `}
    >
      <p>Contul a fost creat, te rog verifică adresa de email pentru activare.</p>
      <OrSection>după care</OrSection>
      <Link href="/login">
        <Button variant="outlined">Întră în cont</Button>
      </Link>
    </div>
  );
}
