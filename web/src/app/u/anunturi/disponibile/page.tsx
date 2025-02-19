"use client";

import { getPendingAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemPending from "@/c/Widget/AdListItemPending";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [ads, setAds] = useState<Ad[]>();
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Disponibile</span>
      </>
    );
  }, []);

  useEffect(() => {
    getPendingAds().then(setAds);
  }, []);

  return (
    <>
      <PageName>Anunțuri Disponibile</PageName>
      {ads?.map((ad, index) => (
        <AdListItemPending key={index} ad={ad} />
      ))}
    </>
  );
}
