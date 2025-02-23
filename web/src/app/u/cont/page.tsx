"use client";

import { getReferrerURL } from "@/api/common";
import { destroyAccessToken } from "@/c/Auth";
import Confirm from "@/c/Dialog/Confirm";
import getDomain, { Domain } from "@/c/domain";
import { track } from "@/c/funcs";
import { Centred, PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import AccountSection from "@/c/Widget/Section";
import { Check, ContentCopy } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Input, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [refferrerURL, setRefferrerURL] = useState<string | null>();
  const [referrerCopied, setReferrerCopied] = useState(false);
  const [downloadingData, setDownloadingData] = useState(false);
  const [accountDeleting, setAccountDeleting] = useState(false);
  const [showAccountDeleteConfirm, setShowAccountDeleteConfirm] = useState(false);
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

  const downloadData = () => {
    setDownloadingData(true);
    track('account/download');
  }

  const deleteAccountIntent = () => {
    track('account/delete/intent');
    setShowAccountDeleteConfirm(true);
  };

  const deleteAccount = (proceed?: boolean) => {
    
    if (proceed) {
        track('account/delete/confirmed');
        setAccountDeleting(true);
        setTimeout(() => {
            destroyAccessToken().then(() => {
                window.location.href = getDomain(Domain.Web,'?uiref=account-removing');
            })
        }, 7000);
    }

    setShowAccountDeleteConfirm(false);
  }

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
      <AccountSection title="Profil">
        Change avatar, phone number, city
      </AccountSection>
      <AccountSection title="Securitate">
        Change password form
      </AccountSection>
      <AccountSection title="Url referință">
        <Stack>
          <Input
            size="lg"
            value={refferrerURL ?? ""}
            endDecorator={
              <IconButton onClick={copyReferrerURL}>
                {referrerCopied ? <Check/> : <ContentCopy />}
              </IconButton>
            }
          />
          <p style={{ marginTop: "10px", fontSize:"14px" }}>
            Distribuie acest link și <strong>primești 300 credit</strong> pentru a promova
            anunțuri gratuit.
          </p>
        </Stack>
      </AccountSection>
      <AccountSection title="Zonă periculoasă">
        <Stack gap={2} flexDirection="row">
        <Button onClick={deleteAccountIntent} disabled={accountDeleting} startDecorator={accountDeleting?<CircularProgress thickness={2} size="sm"/>:null} size="lg" variant="solid" color="danger">
            Șterge Cont
        </Button>
        <Button onClick={downloadData} size="lg" disabled={accountDeleting||downloadingData} startDecorator={downloadingData?<CircularProgress thickness={2} size="sm"/>:null} variant="solid" color="neutral">
            Descarcă Date
        </Button>
        </Stack>
      </AccountSection>
      {showAccountDeleteConfirm && <Confirm color="danger" message="Ești sigur că vrei să ștergi contul?" onResponse={deleteAccount}/>}
    </Centred>
  );
}
