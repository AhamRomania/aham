"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import { FC } from "react";
import { Centred, Space } from "../Layout";
import Logo from "../logo";
import Tip from "../tooltip";
import AccountBadge from "../Widget/AccountBadge";

const Header: FC = () => {
  
  return (
    <header
      css={css`
        height: 60px;
        background: var(--main-color);
      `}
    >
      <Centred
        mode="row"
        css={css`
          height: 60px;
          align-items: center;
          justify-content: center; 
          padding: 0 10px;
          @media only screen and (min-width : 1200px) { 
            padding: 0 0px;
          }
        `}
      >
        <Tip title="Navighează la pagina principală">
          <Link href="/">
            <Logo size={42} padding={15} bg="#9c27b0" color="#FFF" radius={2} />
          </Link>
        </Tip>
        <Space/>
        <AccountBadge menu={false}/>
      </Centred>
    </header>
  );
};

export default Header;
