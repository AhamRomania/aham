"use client";

import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Validare</span>
      </>
    );
  }, []);

  return (
    <>
      <PageName>Anunțuri Pentru Validare</PageName>
      <div>Anunturi</div>
    </>
  );
}
