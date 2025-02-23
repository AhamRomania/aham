"use client";

import { getFixingAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemFixing from "@/c/Widget/AdListItemFixing";
import Loading from "@/c/Widget/Loading";
import NoResults from "@/c/Widget/NoResults";
import { Button } from "@mui/joy";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [ads, setAds] = useState<Ad[]|null>(null);
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Retușare</span>
      </>
    );
  }, []);

  const update = () => getFixingAds().then(setAds);

  useEffect(() => {
    update();
  }, []);

  if (ads == null) {
    return <Loading/>
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
      <PageName>Anunțuri Pentru Validare</PageName>
      {ads?.map((ad, index) => (
        <AdListItemFixing onChange={() => update()} key={index} ad={ad} />
      ))}
    </>
  );
}
