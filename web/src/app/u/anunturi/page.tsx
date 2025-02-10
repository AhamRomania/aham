"use client";

import { AccountLayoutContext } from "@/c/Layout/account";
import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import Link from "next/link";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <Link href="/u/anunturi/creaza">
          <IconButton size="sm">
            <Add />
          </IconButton>
        </Link>
      </>
    );
  }, []);

  return (
    <>
      <div>Anunturi</div>
    </>
  );
}
