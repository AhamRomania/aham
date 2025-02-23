"use client";

import { getReferrerURL, getShortURL } from "@/api/common";
import { Centred, PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Input } from "@mui/joy";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [refferrerURL, setRefferrerURL] = useState<string | null>();
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Cont</span>
      </>
    );
  }, []);

  useEffect(() => {
    getReferrerURL().then(setRefferrerURL);
  }, []);

  return (
    <Centred>
      <PageName>Cont</PageName>
      <Input value={refferrerURL??''}/>
    </Centred>
  );
}
