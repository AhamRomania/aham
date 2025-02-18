"use client";

import { CategoriesEditor } from "@/c/Categories";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Admin</span>
        <span>Categorii</span>
      </>
    );
  }, []);
  return (
    <>
      <PageName>
        Categorii
      </PageName>
      <CategoriesEditor />
    </>
  );
}
