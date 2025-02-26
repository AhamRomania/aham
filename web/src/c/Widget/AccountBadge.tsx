"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { User } from "../types";
import { Avatar, CircularProgress } from "@mui/joy";
import { getUser } from "../Auth";
import { css } from "@emotion/react";
import { Add, Face } from "@mui/icons-material";
import UserMenuDialog from "../Dialog/UserMenuDialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@mui/material";

export interface AccountBadgeProps {
  menu?: boolean;
  icon?: ReactNode;
}

const AccountBadge: FC<AccountBadgeProps> = ({ icon, menu }) => {
  const router = useRouter();
  const [me, setMe] = useState<User | null | undefined>();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    getUser().then(setMe);
  }, []);

  const onClick = () => {
    if (!menu) {
      router.push(`/u/`);
      return;
    }

    setShowMenu(true);
  };

  if (typeof me === "undefined") {
    return (
      <div
        css={css`
          margin-right: 8px;
          margin-top: 8px;
        `}
      >
        <CircularProgress thickness={1} size="sm" />
      </div>
    );
  }

  if (!me) {
    return (
      <Link href="/u/anunturi/creaza">
        <Button
          data-test="add-button"
          startIcon={<Add />}
          variant="contained"
          color="secondary"
        >
          Adaugă Anunț
        </Button>
      </Link>
    );
  }

  return (
    <>
      <div
        onClick={onClick}
        css={css`
          display: flex;
          align-items: center;
          cursor: pointer;
        `}
      >
        {icon}
        <Avatar sx={{ borderRadius: "5px" }}>
          <Face />
        </Avatar>
      </div>
      <UserMenuDialog open={showMenu} onClose={() => setShowMenu(false)} />
    </>
  );
};

export default AccountBadge;
