"use client";

import { Centred, PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Setări</span>
      </>
    );
  }, []);

  return (
    <Centred>
      <PageName>Setări</PageName>
      <div>Setări</div>
    </Centred>
  );
}
