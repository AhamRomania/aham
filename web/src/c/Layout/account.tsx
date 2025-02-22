"use client";

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
  DashboardOutlined,
  FavoriteOutlined,
  FiberNew,
  FolderOutlined,
  FolderSpecialOutlined,
  Home,
  Notifications,
  Pages,
  Person,
  Public,
  SettingsOutlined,
  ThumbDown,
} from "@mui/icons-material";
import { Breadcrumbs, Button, IconButton, Snackbar } from "@mui/joy";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getUser } from "../Auth";
import { isPrivilegedUser } from "../funcs";
import HeadMenu from "../HeadMenu";
import Logo from "../logo";
import Sam, { SamPermission, SamResource } from "../Sam";
import Tip from "../tooltip";
import { Ad, AdCounts, User } from "../types";
import { Menu, MenuItem } from "./aside";
import { Space } from "./common";
import { getBalance } from "@/api/common";
import { toMoney } from "../formatter";
import useSocket from "../ws";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAdCounts } from "@/api/ads";

export interface AccountLayoutAPI {
  setPath: (path: React.ReactElement) => void;
}

interface SnackbarItem {
  id: string;
  message: React.ReactNode;
  open: boolean;
  duration: number;
  endDecorator?:React.ReactNode|null;
}

export const AccountLayoutContext = React.createContext<AccountLayoutAPI>(
  {} as AccountLayoutAPI
);

const AccountLayout = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const [counts, setCounts] = useState<AdCounts>({} as AdCounts);
  const [balance, setBalance] = useState(0);
  const [open, setOpen] = useState(true);
  const [me, setMe] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [path, setPath] = useState<React.ReactElement>(<></>);
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);
  const socket = useSocket();

  useEffect(() => {
    getUser().then(setMe);
    setUserLoaded(true);
    getBalance().then(setBalance);
    getAdCounts().then(setCounts);
  }, []);

  const handleOpenSnackbar = (message: React.ReactNode, duration: number = 3000, endDecorator: React.ReactNode | null = null) => {
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
    handleOpenSnackbar(<><CheckCircle color="success"/><strong>{ad.title}</strong>a fost publicat</>, 3000);
  };

  const onAdComplete = (ad: Ad) => {
    handleOpenSnackbar(<><CheckCircle color="success"/>Afișarea<strong>{ad.title}</strong>este finalizată</>, 3000);
  };

  const onChatMessage = ({chat,message}:{message:any,chat:any}) => {
    handleOpenSnackbar(<>{message.message}</>, 3000, <><Button onClick={() => router.push(`/u/mesaje/${chat.id}`)} variant="soft">Răspunde</Button></>);
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
          data-test="account-aside"
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
            data-test="account-aside-header"
            css={css`
              max-height: 80px;
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
                    style={{ marginLeft: "10px", background:"transparent" }}
                  >
                    <Home htmlColor="#FFF" />
                  </IconButton>
                </Link>
                <Link href="/u/anunturi/creaza" prefetch={false}>
                  <IconButton
                    size="md"
                    variant="solid"
                    color="primary"
                    style={{ marginLeft: "5px", background:"transparent" }}
                  >
                    <Add htmlColor="#FFF" />
                  </IconButton>
                </Link>
              </>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            css={css`
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
            `}
          >
            {/* MENU DOWN */}
            <Menu mobile={!open}>
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
                  count={counts.available}
                  href="/u/anunturi/disponibile"
                />
                <MenuItem
                  icon={<CheckCircle />}
                  title="Aprobare"
                  count={counts.approving}
                  href="/u/anunturi/aprobare"
                />
                <MenuItem
                  icon={<Public />}
                  title="Publice"
                  count={counts.public}
                  href="/u/anunturi/publice"
                />
                <MenuItem
                  icon={<AssignmentTurnedIn />}
                  count={counts.changing}
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
              <MenuItem
                icon={<ChatOutlined />}
                title="Mesaje"
                href="/u/mesaje"
              />
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
              {userLoaded && isPrivilegedUser(me) && (
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
            {/* MENU UP */}
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
              <div
                css={css`
                  height: 42px;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  margin-right: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0 20px;
                  background: #fff;
                  font-size: 20px;
                  font-weight: bold;
                  font-family: "Courier New", Courier, monospace;
                  img {
                    margin-left: 5px;
                  }
                `}
              >
                <strong>{balance > 0 ? toMoney(balance) : 100}</strong>
                <Image alt="coins" width={16} height={16} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABVUlEQVR4nO1WQU7DMBA0ildQfoA48RDu5RnlSOkX+AS8Agl2Qx/Asb3xBFQOIBDXquz2YLSRGy7QJBtHlVBGsuTE6804Ox7buR5GhEd3sL7PzhjhhhHmQv6ZEZbaYn+uY+s8G2qsSwkmOGeCdyEIdZrGMsEoyceF/PgnuX8S8leC/nSV75+EB3eoTfv6rhgrYsr4cXsC6BdFMvSTENxeVbzGSO4v45xFewIUV2MhQBDSESBLCRIS4IYiTE4g6DbMsyEjXDPC7JdtONOxzTZMXwL8rxoIfzvcihHe6tbdpAFu6HAx+WdRb4IPRvgya0A6crjaGhCLw6GfRAIvy+ngONy6gVkDYlF3SSCBBqSlupngNQrVqgHoxOFqH0bS0uHCnTvS561/Cv3FzjTAVRcS6VgDVQty/SknbYwozVXL2614m7qbgAlGO7tub9DUB8qJPXo4G74BQpgHCXHbt1AAAAAASUVORK5CYII=" />
              </div>
              <div
                css={css`
                  cursor: pointer;
                  width: 40px;
                  height: 40px;
                  border-radius: 5px;
                  background: #fff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #bdbdbd;
                  color: #fff;
                  position: relative;
                `}
              >
                <div
                  css={css`
                    position: absolute;
                    right: 2px;
                    top: 2px;
                    width: 20px;
                    height: 20px;
                    background: #f44336;
                    border-radius: 50%;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  `}
                >
                  10
                </div>
                <Notifications />
              </div>
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

export default AccountLayout;
