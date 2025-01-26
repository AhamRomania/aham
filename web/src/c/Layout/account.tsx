"use client";

import * as React from "react";
import { css } from "@emotion/react";
import Logo from "../logo";
import Link from "next/link";
import { useState } from "react";
import { Add, ArrowLeft, ArrowRight, Home } from "@mui/icons-material";
import Tip from "../tooltip";
import HeadMenu from "../HeadMenu";
import { Breadcrumbs, IconButton } from "@mui/joy";
import { Space } from "./common";

const AccountLayout = ({ children }: React.PropsWithChildren) => {
  const [open, setOpen] = useState(true);
  return (
    <div
      css={css`
        display: flex;
        height: 100%;
        flex-direction: column;
        @media only screen and (min-width : 1200px) {
            flex-direction: row;
        }
      `}
    >
      <div
        css={css`
          background: var(--main-color);
          transition: width 0.6s;
          color: #fff;
          position:relative;
          justify-content: center;
          display: flex;
          @media only screen and (min-width : 1200px) {
            width: ${open ? '270px' : '80px'};
          }
        `}
      >
        <div
            data-testid="account-aside-header"
            css={css`
                height: 80px;
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
        </div>
        <button
            onClick={() => setOpen(!open)}
            css={css`
                background: var(--main-color);
                width: 7px;
                border: none;
                height: 100%;
                position:absolute;
                top:0;
                right: 0px; 
                cursor: e-resize;
                display: none;
                @media only screen and (min-width : 1200px) {
                    display: block;
                }
                &:hover {
                    filter: brightness(85%);
                }
            `}
        />
      </div>
      <div
        css={css`
          flex: 1;
          display: flex;
          width: 100%;
          flex-direction: column;
        `}
      >
        <div
            css={css`
                height: 80px;
                display: flex;
                background: #FAFAFA;
                margin: 0 10px;
            `}
        >
            <div
                data-testid="account-header-breadcrumbs"
                css={css`
                    height: 80px;
                    display: flex;
                    align-items: center;  
                `}
            >
                <Breadcrumbs separator="›" aria-label="breadcrumbs">
                    <Home onClick={() => window.location.href = '/'} style={{cursor: 'pointer'}} sx={{ mr: 0.5 }} />
                    <Link href="/u">
                        Cont
                    </Link>
                    <span style={{fontSize:19}}>Aunțuri</span>
                </Breadcrumbs>

                <Tip title="Adaugă anunț">
                    <Link href="/u/anunturi/creaza">
                        <IconButton variant="soft" color="primary" size="sm">
                            <Add/>
                        </IconButton>
                    </Link>
                </Tip>
            </div>
            <Space/>
            <HeadMenu/>
        </div>
        <div>
            {children}
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
