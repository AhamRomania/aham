"use client"
import { FC } from "react";
import { css } from '@emotion/react'

const Header: FC = () => {
    return (
        <div
            css={css`
                height: 60px;
                background: #000;
            `}
        >
            Header
        </div>
    )
}

export default Header;