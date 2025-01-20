"use client";

import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import Logo from "../logo";
import Tip from "../tooltip";
import Link from "next/link";
import { Centred, Space } from "../Layout";
import HeadMenu from "../HeadMenu";
import { getLoggedInState } from "../Auth";

const Header: FC = () => {

  const [isLoggedIn,  setIsLoggedIn] = useState(false);

  useEffect(() => {
    getLoggedInState().then(setIsLoggedIn);
  }, []);

  return (
    <div
      css={css`
        height: 60px;
        background: var(--main-color);
      `}
    >
      <Centred
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
            <Logo size={34} padding={8} bg="#0C5BA1" color="#FFF" radius={2} />
          </Link>
        </Tip>
        <Space/>
        <HeadMenu isLoggedIn={isLoggedIn}/>
      </Centred>
    </div>
  );
};

export default Header;
