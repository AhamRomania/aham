"use client";

import { getCompletedAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemAvailable from "@/c/Widget/AdListItemAvailable";
import Loading from "@/c/Widget/Loading";
import NoResults from "@/c/Widget/NoResults";
import useSocket from "@/c/ws";
import { Button } from "@mui/joy";
import Link from "next/link";
import { useContext, useEffect, useState, useReducer } from "react";

export default function Page() {
  const socket = useSocket();
  const [ads, setAds] = useState<Ad[]|null>(null);
  const { setPath } = useContext(AccountLayoutContext);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Disponibile</span>
      </>
    );
  }, []);

  const update = () => {
    getCompletedAds().then((ads)=>{
      setAds(ads);
      forceUpdate();
    });
  }

  useEffect(() => {
    update();
  }, []);

  useEffect(() => {
      return socket.on<Ad>("ad.complete", () => update());
  }, []);

  if (ads == null) {
    return <Loading/>
  }

  if (ads != null && ads.length === 0) {
    return (
        <NoResults after={(
            <Link href="/u/anunturi/creaza">
                <Button>Adaugă anunț</Button>
            </Link>
        )}/>
    )
  }

  return (
    <>
      <PageName>Anunțuri Disponibile</PageName>
      {ads?.map((ad, index) => (
        <AdListItemAvailable onChange={() => update()} key={index} ad={ad} />
      ))}
    </>
  );
}
