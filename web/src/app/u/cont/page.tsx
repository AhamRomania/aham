"use client";

import { getMe, getReferrerURL } from "@/api/common";
import { destroyAccessToken } from "@/c/Auth";
import Confirm from "@/c/Dialog/Confirm";
import getDomain, { Domain } from "@/c/domain";
import { track } from "@/c/funcs";
import { Centred, PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { User } from "@/c/types";
import NextFeature from "@/c/Widget/Feature";
import AccountSection from "@/c/Widget/Section";
import { Check, ContentCopy } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Input, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [me, setMe] = useState<User | null>(null);
  const [refferrerURL, setRefferrerURL] = useState<string | null>();
  const [referrerCopied, setReferrerCopied] = useState(false);
  const [downloadingData, setDownloadingData] = useState(false);
  const [accountDeleting, setAccountDeleting] = useState(false);
  const [showAccountDeleteConfirm, setShowAccountDeleteConfirm] =
    useState(false);
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
    getMe().then(setMe);
  }, []);

  const downloadData = () => {
    setDownloadingData(true);
    track("account/download");
  };

  const deleteAccountIntent = () => {
    track("account/delete/intent");
    setShowAccountDeleteConfirm(true);
  };

  const deleteAccount = (proceed?: boolean) => {
    if (proceed) {
      track("account/delete/confirmed");
      setAccountDeleting(true);
      setTimeout(() => {
        destroyAccessToken().then(() => {
          window.location.href = getDomain(
            Domain.Web,
            "?uiref=account-removing"
          );
        });
      }, 7000);
    }

    setShowAccountDeleteConfirm(false);
  };

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
      <PageName right={<div style={{color: "#999"}}>ID: {me?.id}</div>}>Cont</PageName>
      <AccountSection title="Profil">
        <NextFeature feature="account/profile">Schimbă avatar, număr de telefon, oraș.</NextFeature>
      </AccountSection>
      <AccountSection title="Securitate">
        <NextFeature feature="account/security">Formular schimbare parolă</NextFeature>
      </AccountSection>
      <AccountSection title="Url referință">
        <Stack>
          <Input
            size="lg"
            value={refferrerURL ?? ""}
            endDecorator={
              <IconButton onClick={copyReferrerURL}>
                {referrerCopied ? <Check /> : <ContentCopy />}
              </IconButton>
            }
          />
          <p style={{ marginTop: "10px", fontSize: "14px" }}>
            Distribuie acest link și <strong>primești 300 credit</strong> pentru
            a promova anunțuri gratuit.
          </p>
        </Stack>
      </AccountSection>
      <AccountSection title="Tranzacții">
        <NextFeature feature="account/transactions">Cheltuieli anunțuri, câștiguri referințe.</NextFeature>
      </AccountSection>
      <AccountSection title="Zonă periculoasă">
        <Stack gap={2} flexDirection="row">
          <Button
            onClick={deleteAccountIntent}
            disabled={accountDeleting}
            startDecorator={
              accountDeleting ? (
                <CircularProgress thickness={2} size="sm" />
              ) : null
            }
            size="lg"
            variant="solid"
            color="danger"
          >
            Șterge Cont
          </Button>
          <Button
            onClick={downloadData}
            size="lg"
            disabled={accountDeleting || downloadingData}
            startDecorator={
              downloadingData ? (
                <CircularProgress thickness={2} size="sm" />
              ) : null
            }
            variant="solid"
            color="neutral"
          >
            Descarcă Date
          </Button>
        </Stack>
      </AccountSection>
      {showAccountDeleteConfirm && (
        <Confirm
          color="danger"
          message="Ești sigur că vrei să ștergi contul?"
          onResponse={deleteAccount}
        />
      )}
    </Centred>
  );
}
