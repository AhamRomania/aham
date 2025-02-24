"use client";

import { css } from "@emotion/react";
import { FC } from "react";
import { RedocStandalone } from 'redoc';

const Developers:FC = () => {
    return (
        <div
            css={css`
                position: relative;
                .scrollbar-container div:nth-child(2) {
                    display: none;
                }  
            `}
        >
        <RedocStandalone
            specUrl="swagger.json"
            options={{
                disableSearch: true,
                hideDownloadButton: true,
                theme: { colors: { primary: { main: '#1F70B8' } } },
            }}
        />
        </div>
    )
}

export default Developers;