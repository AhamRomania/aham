"use client";

import { Centred, PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import NextFeature from "@/c/Widget/Feature";
import AccountSection from "@/c/Widget/Section";
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
      <AccountSection title="Notificări">
        <NextFeature feature="settings/notifications">Notificări pentru stări anunțuri și mesaje.</NextFeature>
      </AccountSection>
    </Centred>
  );
}
