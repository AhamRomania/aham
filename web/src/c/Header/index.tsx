"use client";
import { FC } from "react";
import { css } from "@emotion/react";
import Logo from "../logo";
import Tooltip from "../tooltip";
import Link from "next/link";
import { Centred } from "../Layout";

const Header: FC = () => {
  return (
    <div
      css={css`
        height: 60px;
        background: var(--main-color);
      `}
    >
      <Centred>
        <Tooltip title="Navighează la pagina principală">
          <Link href="/">
            <Logo size={34} padding={8} bg="#0C5BA1" color="#FFF" radius={2} />
          </Link>
        </Tooltip>
        <div>Spacer</div>
      </Centred>
    </div>
  );
};

export default Header;
