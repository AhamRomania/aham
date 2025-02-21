"use client";

import { getCompletedAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemAvailable from "@/c/Widget/AdListingItemAvailable";
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
    getCompletedAds().then(setAds);
  }, []);

  return (
    <>
      <PageName>Anunțuri Disponibile</PageName>
      {ads?.map((ad, index) => (
        <AdListItemAvailable key={index} ad={ad} />
      ))}
    </>
  );
}
