"use client";

import { getPublishedAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemPublished from "@/c/Widget/AdListItemPublished";
import Loading from "@/c/Widget/Loading";
import NoResults from "@/c/Widget/NoResults";
import { Button } from "@mui/joy";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [ads, setAds] = useState<Ad[] | null>(null);
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Publice</span>
      </>
    );
  }, []);

  useEffect(() => {
    getPublishedAds().then(setAds);
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
      <PageName>Anunțuri Publice</PageName>
      {ads?.map((ad, index) => (
        <AdListItemPublished key={index} ad={ad} />
      ))}
    </>
  );
}
