"use client";

import { Centred, PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import NextFeature from "@/c/Widget/Feature";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Cont</span>
      </>
    );
  }, []);

  return (
    <Centred>
      <PageName>Statistici</PageName>
      <NextFeature>Statistici pentru anunțuri</NextFeature>
    </Centred>
  );
}
