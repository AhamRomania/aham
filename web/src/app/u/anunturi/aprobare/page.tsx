"use client";

import { getPendingAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemPending from "@/c/Widget/AdListItemPending";
import Loading from "@/c/Widget/Loading";
import NoResults from "@/c/Widget/NoResults";
import { Button, CircularProgress } from "@mui/joy";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [ads, setAds] = useState<Ad[] | null>(null);
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Aprobare</span>
      </>
    );
  }, []);

  useEffect(() => {
    getPendingAds().then(setAds);
  }, []);

  if (ads == null) {
    return <Loading />;
  }

  if (ads != null && ads.length === 0) {
    return (
      <NoResults
        after={
          <Link href="/u/anunturi/creaza">
            <Button>Adaugă anunț</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageName>
        Aprobare Anunțuri <CircularProgress size="sm" />
      </PageName>
      {ads?.map((ad, index) => (
        <AdListItemPending key={index} ad={ad} />
      ))}
    </>
  );
}
