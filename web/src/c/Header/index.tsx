"use client";

import { FC } from "react";
import { css } from "@emotion/react";
import Logo from "../logo";
import Tip from "../tooltip";
import Link from "next/link";
import { Centred, Space } from "../Layout";
import HeadMenu from "../HeadMenu";
import AccountBadge from "../Widget/AccountBadge";
import { ArrowDropDown } from "@mui/icons-material";

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
        <AccountBadge menu={false} icon={<ArrowDropDown/>}/>
      </Centred>
    </header>
  );
};

export default Header;
