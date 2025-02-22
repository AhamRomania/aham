"use client";

import { AccountLayoutContext } from "@/c/Layout/account";
import AdApproving from "@/c/Pages/AdApproving";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Admin</span>
        <span>Anunțuri Noi</span>
      </>
    );
  }, []);
  return (
    <>
      <AdApproving />
    </>
  );
}
