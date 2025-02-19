"use client";

import { getDraftAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItem from "@/c/Widget/AdListItem";
import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [ads, setAds] = useState<Ad[]>();
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Ciorne</span>
        <Link href="/u/anunturi/creaza">
          <IconButton size="sm">
            <Add />
          </IconButton>
        </Link>
      </>
    );
  }, []);

  useEffect(() => {
    getDraftAds().then(setAds);
  }, []);

  const onRemoveAd = () => {
    getDraftAds().then(setAds);
  }

  return (
    <>
      <PageName>Ciorne</PageName>
      {ads?.map((ad, index) => (
        <AdListItem onRemove={onRemoveAd} key={index} ad={ad} />
      ))}
    </>
  );
}
