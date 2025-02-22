"use client";

import { getFavouriteAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemFavourite from "@/c/Widget/AddListItemFavourite";
import Loading from "@/c/Widget/Loading";
import NoResults from "@/c/Widget/NoResults";
import { Button } from "@mui/joy";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  const [ads, setAds] = useState<Ad[]|null>(null);

  useEffect(() => {
    update();
  }, []);

  const update = () => getFavouriteAds().then(setAds);

  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Favorite</span>
      </>
    );
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
      <PageName>Anunțuri Favorite</PageName>
      {ads?.map((ad, index) => (
        <AdListItemFavourite onRemove={() => update()} key={index} ad={ad} />
      ))}
    </>
  );
}
