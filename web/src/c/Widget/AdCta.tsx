import { css } from "@emotion/react";
import { FC } from "react";
import { Ad } from "../types";

export interface AdCtaProps {
    ad: Ad
}

const AdCta:FC<AdCtaProps> = ({ad}) => {
    return (
        <div
            css={css`
                width: 100%;
                height: 100%;
                border-radius: 8px;
                background: #F0F0F0;    
            `}
        >
            {ad.owner.given_name}
        </div>
    )
}

export default AdCta;