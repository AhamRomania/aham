"use client";

import { getAdCounts } from "@/api/ads";
import { css } from "@emotion/react";
import {
    Add,
    AddTaskOutlined,
    AdsClickOutlined,
    Analytics,
    AssignmentTurnedIn,
    Category,
    ChatOutlined,
    CheckCircle,
    Close,
    DashboardOutlined,
    FavoriteOutlined,
    FiberNew,
    FolderOutlined,
    FolderSpecialOutlined,
    Home,
    Menu as MenuIcon,
    Pages,
    Person,
    Public,
    SettingsOutlined,
    ThumbDown
} from "@mui/icons-material";
import { Breadcrumbs, Button, IconButton, Snackbar, Stack } from "@mui/joy";
import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { getUser } from "../Auth";
import { isPrivilegedUser } from "../funcs";
import HeadMenu from "../HeadMenu";
import Logo from "../logo";
import Sam, { SamPermission, SamResource } from "../Sam";
import Tip from "../tooltip";
import { Ad, AdCounts, User } from "../types";
import NotificationsBadge from "../Widget/NotificationsBadge";
import useSocket from "../ws";
import { Menu, MenuItem } from "./aside";
import { Space } from "./common";
import Balance from "../Widget/Balance";

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
  const [mobileDropDownOpen, setMobileDropDownOpen] = useState(false);
  const [counts, setCounts] = useState<AdCounts>({} as AdCounts);
  const [open, setOpen] = useState(true);
  const [me, setMe] = useState<User | null | undefined>();
  const [path, setPath] = useState<React.ReactElement>(<></>);
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);
  const mobile = useMediaQuery("(max-width: 768px)",{defaultMatches:true});
  const socket = useSocket();

  useEffect(() => {
    getUser().then(setMe);
    getAdCounts().then(setCounts);
  }, []);

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

  const renderAccountMenu = () => (
    <AccountMenu counts={counts} me={me} onClose={() => setMobileDropDownOpen(false)} />
  );

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
                <div
                css={css`
                    #account-aside-menu-dropdown {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    height: 500px;
                    width: 80%;
                    max-width: 300px;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    background: var(--main-color);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    z-index: 100;
                    overflow-y: scroll;
                    }
                `}
                >
                {mobile && (
                    <IconButton
                    variant={mobileDropDownOpen ? "solid" : "solid"}
                    onClick={() => setMobileDropDownOpen(!mobileDropDownOpen)}
                    >
                    {mobileDropDownOpen ? (
                        <Close />
                    ) : (
                        <MenuIcon htmlColor="#FFF" />
                    )}
                    </IconButton>
                )}
                {mobile && mobileDropDownOpen && (
                    <div id="account-aside-menu-dropdown">
                    {renderAccountMenu()}
                    </div>
                )}
                </div>
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
            `}
          >
            <div id="aside-menu-container">
              <div id="aside-menu">{!mobile && renderAccountMenu()}</div>
            </div>
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
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 20px;
              `}
            >
              {!mobile && <Balance/>}
              {!mobile && <NotificationsBadge/>}
            </div>
            <HeadMenu />
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

interface AccountMenuProps {
  counts: AdCounts;
  me: User | null | undefined;
  onClose: () => void;
}

const AccountMenu: FC<AccountMenuProps> = ({ counts, me, onClose }) => {
  return (
    <div onClick={() => onClose()}>
      <Menu collapsed={false}>
        <MenuItem icon={<DashboardOutlined />} title="Panou" href="/u/" />
        <MenuItem
          icon={<AdsClickOutlined />}
          title="Anunțuri"
          href="/u/anunturi"
        >
          <MenuItem
            icon={<FiberNew />}
            title="Ciorne"
            count={counts.drafts}
            href="/u/anunturi"
          />
          <MenuItem
            icon={<Category />}
            title="Disponibile"
            count={counts.completed}
            href="/u/anunturi/disponibile"
          />
          <MenuItem
            icon={<CheckCircle />}
            title="Aprobare"
            count={counts.pending}
            href="/u/anunturi/aprobare"
          />
          <MenuItem
            icon={<Public />}
            title="Publice"
            count={counts.published}
            href="/u/anunturi/publice"
          />
          <MenuItem
            icon={<AssignmentTurnedIn />}
            count={counts.fixing}
            title="Retușare"
            href="/u/anunturi/retusare"
          />
          <MenuItem
            icon={<ThumbDown />}
            title="Respinse"
            count={counts.rejected}
            href="/u/anunturi/respinse"
          />
          <MenuItem
            icon={<FavoriteOutlined />}
            title="Favorite"
            count={counts.favourite}
            href="/u/anunturi/favorite"
          />
        </MenuItem>
        <MenuItem icon={<ChatOutlined />} title="Mesaje" href="/u/mesaje" />
        <MenuItem
          icon={<Analytics />}
          title="Statistici"
          href="/u/statistici"
        />
        <MenuItem icon={<Person />} title="Cont" href="/u/cont" />
        <MenuItem
          icon={<SettingsOutlined />}
          title="Settings"
          href="/u/setari"
        />
        {typeof me !== "undefined" && isPrivilegedUser(me) && (
          <MenuItem
            icon={<FolderSpecialOutlined />}
            title="Administrare"
            href="/u/admin"
          >
            <MenuItem
              icon={<AddTaskOutlined />}
              title="Anunțuri"
              href="/u/admin/anunturi"
            />
            <MenuItem
              icon={<FolderOutlined />}
              title="Atribute"
              href="/u/admin/atribute"
            />
            <Sam
              resource={SamResource.CATEGORIES}
              permission={SamPermission.WRITE}
            >
              <MenuItem
                icon={<FolderOutlined />}
                title="Categorii"
                href="/u/admin/categorii"
              />
            </Sam>
            <MenuItem icon={<Pages />} title="SEO" href="/u/admin/seo" />
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default AccountLayout;
