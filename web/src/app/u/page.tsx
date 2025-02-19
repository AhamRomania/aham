"use client";
import { AccountLayoutContext } from "@/c/Layout/account";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Panou Principal</span>
      </>
    );
  }, []);
  return (
    <>
      <div>Dashboard</div>
    </>
  );
}
