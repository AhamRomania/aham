import { css } from "@emotion/react";
import { FC } from "react";

const AdCta:FC = () => {
    return (
        <div
            css={css`
                width: 100%;
                height: 100%;
                border-radius: 8px;
                background: #F0F0F0;    
            `}
        >
            Ad CTA
        </div>
    )
}

export default AdCta;