"use client";

import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
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
    <>
      <PageName>Statistici</PageName>
      <div></div>
    </>
  );
}
