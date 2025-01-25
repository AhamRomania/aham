"use client";

import OrSection from "@/c/orsection";
import { css } from "@emotion/react";
import { CheckCircleOutline } from "@mui/icons-material";
import { Button } from "@mui/joy";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


export default function Page() {
  const searchParams = new URLSearchParams(window.location.search);
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
      <div>
        <CheckCircleOutline css={css`color: green; width: 40px; height: 40px; margin-bottom: 20px;`}/>
      </div>
      <p><strong>{searchParams.get('name')}</strong>, contul a fost creat, te rog verifică adresa de email pentru activare.</p>
      <OrSection>după care</OrSection>
      <Link href="/login">
        <Button variant="outlined">Întră în cont</Button>
      </Link>
    </div>
  );
}
