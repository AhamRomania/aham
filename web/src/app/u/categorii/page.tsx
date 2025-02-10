"use client";

import { CategoriesEditor } from "@/c/Categories";
import { AccountLayoutContext } from "@/c/Layout/account";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Categorii</span>
      </>
    );
  }, []);
  return (
    <>
      <CategoriesEditor />
    </>
  );
}
