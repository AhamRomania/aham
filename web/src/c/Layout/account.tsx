"use client";

import { css } from "@emotion/react";
import { Add, AddTaskOutlined, AdsClickOutlined, AssignmentTurnedIn, Category, ChatOutlined, CheckCircle, DashboardOutlined, FavoriteOutlined, FiberNew, FolderOutlined, FolderSpecialOutlined, Home, Notifications, Pages, Person, Public, SettingsOutlined, ThumbDown } from "@mui/icons-material";
import { Breadcrumbs, IconButton } from "@mui/joy";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getUser } from "../Auth";
import { isPrivilegedUser } from "../funcs";
import HeadMenu from "../HeadMenu";
import Logo from "../logo";
import Sam, { SamPermission, SamResource } from "../Sam";
import Tip from "../tooltip";
import { User } from "../types";
import { Menu, MenuItem } from "./aside";
import { Centred, Space } from "./common";
import { getBalance } from "@/api/common";
import { toMoney } from "../formatter";

export interface AccountLayoutAPI {
  setPath: (path: React.ReactElement) => void;
}

export const AccountLayoutContext = React.createContext<AccountLayoutAPI>({} as AccountLayoutAPI);

const AccountLayout = ({ children }: React.PropsWithChildren) => {
  const [balance, setBalance] = useState(0)
  const [open, setOpen] = useState(true);
  const [me, setMe] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [path, setPath] = useState<React.ReactElement>(<></>);

  useEffect(() => {
    getUser().then(setMe);
    setUserLoaded(true);
    getBalance().then(setBalance);
  }, []);

  return (
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
                <IconButton size="md" variant="solid" color="primary" style={{marginLeft:"10px"}}>
                    <Home color="action"/>
                </IconButton>
              </Link>
              <Link href="/u/anunturi/creaza" prefetch={false}>
                <IconButton size="md" variant="solid" color="primary" style={{marginLeft:"10px"}}>
                    <Add color="action"/>
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
            <MenuItem icon={<DashboardOutlined/>} title="Panou" href="/u/"/>
            <MenuItem icon={<ChatOutlined/>} title="Mesaje" href="/u/mesaje"/>
            <MenuItem icon={<AdsClickOutlined/>} title="Anunțuri" href="/u/anunturi">
              <MenuItem icon={<FiberNew/>} title="Ciorne" count={10} href="/u/anunturi"/>
              <MenuItem icon={<Category/>} title="Disponibile" count={10} href="/u/anunturi/disponibile"/>
              <MenuItem icon={<CheckCircle/>} title="Aprobare" count={10} href="/u/anunturi/aprobare"/>
              <MenuItem icon={<Public/>} title="Publice" href="/u/anunturi/publice"/>
              <MenuItem icon={<AssignmentTurnedIn/>} count={10} title="Modificare" href="/u/anunturi/validare"/>
              <MenuItem icon={<ThumbDown/>} title="Respinse" href="/u/anunturi/respinse"/>
              <MenuItem icon={<FavoriteOutlined/>} title="Favorite" href="/u/anunturi/favorite"/>
            </MenuItem>
            <MenuItem icon={<Person/>} title="Cont" href="/u/cont"/>
            <MenuItem icon={<SettingsOutlined/>} title="Settings" href="/u/setari"/>
            {userLoaded && isPrivilegedUser(me) && (
              <MenuItem icon={<FolderSpecialOutlined/>} title="Administrare" href="/u/admin">
                <MenuItem icon={<AddTaskOutlined/>} title="Anunțuri" href="/u/admin/anunturi"/>
                <MenuItem icon={<FolderOutlined/>} title="Atribute" href="/u/admin/atribute"/>
                <Sam resource={SamResource.CATEGORIES} permission={SamPermission.WRITE}>
                  <MenuItem icon={<FolderOutlined/>} title="Categorii" href="/u/admin/categorii"/>
                </Sam>
                <MenuItem icon={<Pages/>} title="SEO" href="/u/admin/seo"/>
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
                border: 1px solid #DDD;  
                border-radius: 8px;
                margin-right: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 20px;
                background: #FFF;
              `}
            >
              {balance > 0 ? <strong>{toMoney(balance)}</strong> : 0}
              <span>LEI</span>
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
                background: #BDBDBD;
                color: #FFF;
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
                  background: #F44336;
                  border-radius: 50%;  
                  font-size: 12px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}
              >10</div>
              <Notifications/>
            </div>
          </div>
          <HeadMenu />
        </div>
        <div
          css={css`
            overflow: auto;
          `}
        >
          <AccountLayoutContext.Provider value={{ setPath }}>
            <Centred>
              {children}
            </Centred>
          </AccountLayoutContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
