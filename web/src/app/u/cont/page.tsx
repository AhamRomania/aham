"use client";

import { getReferrerURL } from "@/api/common";
import { track } from "@/c/funcs";
import { Centred, PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import AccountSection from "@/c/Widget/Section";
import { Check, ContentCopy } from "@mui/icons-material";
import { IconButton, Input, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [refferrerURL, setRefferrerURL] = useState<string | null>();
  const [referrerCopied, setReferrerCopied] = useState(false);
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Cont</span>
      </>
    );
  }, []);

  useEffect(() => {
    getReferrerURL().then(setRefferrerURL);
  }, []);

  const copyReferrerURL = () => {
    navigator.clipboard.writeText(refferrerURL!).then(
      () => {
        track("account/referrer/copy");
        setReferrerCopied(true);
        setTimeout(() => setReferrerCopied(false), 500);
      },
      () => {
        alert("Nu am putut copia URL");
      }
    );
  };

  return (
    <Centred>
      <PageName>Cont</PageName>
      <AccountSection title="Url referință">
        <Stack>
          <p style={{ marginBottom: "10px" }}>
            Distribuie acest link și primești 300 credit pentru a promova
            anunțuri gratuit.
          </p>
          <Input
            size="lg"
            value={refferrerURL ?? ""}
            endDecorator={
              <IconButton onClick={copyReferrerURL}>
                {referrerCopied ? <Check/> : <ContentCopy />}
              </IconButton>
            }
          />
        </Stack>
      </AccountSection>
    </Centred>
  );
}
