"use client";

import { getCompletedAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemAvailable from "@/c/Widget/AdListingItemAvailable";
import useSocket from "@/c/ws";
import { useContext, useEffect, useState, useReducer } from "react";

export default function Page() {
  const socket = useSocket();
  const [ads, setAds] = useState<Ad[]>();
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

  return (
    <>
      <PageName>Anunțuri Disponibile</PageName>
      {ads?.map((ad, index) => (
        <AdListItemAvailable onChange={() => update()} key={index} ad={ad} />
      ))}
    </>
  );
}
