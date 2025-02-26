"use client";

import { css } from "@emotion/react";
import {
    Add,
    CheckCircle,
    Home
} from "@mui/icons-material";
import { Breadcrumbs, Button, IconButton, Snackbar, Stack } from "@mui/joy";
import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logo from "../logo";
import Tip from "../tooltip";
import { Ad } from "../types";
import AccountBadge from "../Widget/AccountBadge";
import AccountMenu from "../Widget/AccountMenu";
import Balance from "../Widget/Balance";
import NotificationsBadge from "../Widget/NotificationsBadge";
import useSocket from "../ws";
import { Space } from "./common";

export interface AccountLayoutAPI {
  setPath: (path: React.ReactElement) => void;
}

interface SnackbarItem {
  id: string;
  message: React.ReactNode;
  open: boolean;
  duration: number;
  endDecorator?: React.ReactNode | null;
}

export const AccountLayoutContext = React.createContext<AccountLayoutAPI>(
  {} as AccountLayoutAPI
);

const AccountLayout = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [path, setPath] = useState<React.ReactElement>(<></>);
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);
  const mobile = useMediaQuery("(max-width: 768px)") || (typeof window !== "undefined" && window.innerWidth <= 768);
  const socket = useSocket();

  const handleOpenSnackbar = (
    message: React.ReactNode,
    duration: number = 3000,
    endDecorator: React.ReactNode | null = null
  ) => {
    const id = new Date().getTime().toString();
    setSnackbars((prevSnackbars) => [
      ...prevSnackbars,
      { id, message, open: true, duration, endDecorator },
    ]);
  };

  const handleCloseSnackbar = (id: string) => {
    setSnackbars((prevSnackbars) =>
      prevSnackbars.map((snackbar) =>
        snackbar.id === id ? { ...snackbar, open: false } : snackbar
      )
    );
  };

  const onAdPublish = (ad: Ad) => {
    handleOpenSnackbar(
      <>
        <CheckCircle color="success" />
        <strong>{ad.title}</strong>a fost publicat
      </>,
      3000
    );
  };

  const onAdComplete = (ad: Ad) => {
    handleOpenSnackbar(
      <>
        <CheckCircle color="success" />
        Afișarea<strong>{ad.title}</strong>este finalizată
      </>,
      3000
    );
  };

  const onChatMessage = ({ chat, message }: { message: any; chat: any }) => {
    handleOpenSnackbar(
      <>{message.message}</>,
      3000,
      <>
        <Button
          onClick={() => router.push(`/u/mesaje/${chat.id}`)}
          variant="soft"
        >
          Răspunde
        </Button>
      </>
    );
  };

  useEffect(() => {
    return socket.on<Ad>("ad.publish", onAdPublish);
  }, []);

  useEffect(() => {
    return socket.on<Ad>("ad.complete", onAdComplete);
  }, []);

  useEffect(() => {
    return socket.on<any>("chat.message", onChatMessage);
  }, []);

  return (
    <>
      <div
        css={css`
          display: flex;
          height: 100%;
          flex-direction: column;
          @media only screen and (min-width: 1200px) {
            flex-direction: row;
          }
        `}
      >
        <div
          css={css`
            background: var(--main-color);
            transition: width 0.6s;
            color: #fff;
            position: relative;
            justify-content: center;
            flex-direction: column;
            display: flex;
            @media only screen and (min-width: 1200px) {
              width: ${open ? "270px" : "80px"};
            }
            a {
              color: #fff;
            }
          `}
        >
          <div
            css={css`
              max-height: 80px;
              min-height: 80px;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              padding: 0 20px;
              flex: 1;
            `}
          >
            <Link href="/">
              <Tip title="Navighează spre pagina principală">
                <Logo bg="#9C27B0" color="#FFFFFF" size={42} padding={18} />
              </Tip>
            </Link>
            {open && (
              <>
                <Link href="/">
                  <IconButton
                    size="md"
                    variant="solid"
                    color="primary"
                    style={{ marginLeft: "10px", background: "transparent" }}
                  >
                    <Home htmlColor="#FFF" />
                  </IconButton>
                </Link>
                <Link href="/u/anunturi/creaza" prefetch={false}>
                  <IconButton
                    size="md"
                    variant="solid"
                    color="primary"
                    style={{ marginLeft: "5px", background: "transparent" }}
                  >
                    <Add htmlColor="#FFF" />
                  </IconButton>
                </Link>
              </>
            )}
            <Space />
            <Stack gap={1} flexDirection="row">
                {mobile && <Balance/>}
                {mobile && <NotificationsBadge/>}
                {mobile && <AccountBadge menu={true}/>}
            </Stack>
          </div>
          <button
            onClick={() => setOpen(!open)}
            css={css`
              display: ${mobile ? "none" : "block"};
              width: 7px;
              border: none;
              height: 100%;
              position: absolute;
              top: 0;
              right: 0px;
              cursor: e-resize;
              display: none;
              background: transparent;
              @media only screen and (min-width: 1200px) {
                display: block;
              }
              &:hover {
                background: var(--main-color);
                filter: brightness(85%);
              }
            `}
          />
          <div
            data-test="account-aside-menu"
            css={css`
              flex: 1;
              overflow-y: auto;
              @media (max-width: 768px) {
                * { display: none; }
              }
            `}
          >
            {!mobile && <AccountMenu hideLogout/>}
          </div>
        </div>
        <div
          css={css`
            flex: 1;
            display: flex;
            width: 100%;
            height: 100%;
            flex-direction: column;
          `}
        >
          <div
            css={css`
              height: 80px;
              display: flex;
              background: #fafafa;
              padding: 0 20px;
            `}
          >
            <div
              data-test="account-header-breadcrumbs"
              css={css`
                height: 80px;
                display: flex;
                align-items: center;
              `}
            >
              <Breadcrumbs separator="›" aria-label="breadcrumbs">
                <Link href="/u/">
                  <IconButton variant="soft" color="primary" size="sm">
                    <Home />
                  </IconButton>
                </Link>
                {path.props ? (path.props as any).children : []}
              </Breadcrumbs>
            </div>
            <Space />
            <div
              css={css`
                gap: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 20px;
                @media (max-width: 768px) {
                div { display: none; }
                }
              `}
            >
              {!mobile && <Balance/>}
              {!mobile && <NotificationsBadge/>}
              {!mobile && <AccountBadge menu={true} />}
            </div>
          </div>
          <div
            data-test="account-layout"
            css={css`
              overflow: auto;
              height: 100%;
            `}
          >
            <AccountLayoutContext.Provider value={{ setPath }}>
              {children}
            </AccountLayoutContext.Provider>
          </div>
        </div>
      </div>
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          variant="outlined"
          open={snackbar.open}
          endDecorator={snackbar.endDecorator}
          autoHideDuration={snackbar.duration}
          onClose={() => handleCloseSnackbar(snackbar.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // Customize position as needed
        >
          {snackbar.message}
        </Snackbar>
      ))}
    </>
  );
};

export default AccountLayout;
