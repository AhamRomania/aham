"use client";

import { getFavouriteAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemAvailable from "@/c/Widget/AdListingItemAvailable";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    getFavouriteAds().then(setAds);
  }, []);

  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Favorite</span>
      </>
    );
  }, []);

  return (
    <>
      <PageName>Anunțuri Favorite</PageName>
      {ads?.map((ad, index) => (
        <AdListItemAvailable onChange={() => {}} key={index} ad={ad} />
      ))}
    </>
  );
}
