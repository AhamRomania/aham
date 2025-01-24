import { css } from "@emotion/react";
import { FC, PropsWithChildren } from "react";

const OrSection: FC = ({children}: PropsWithChildren) => {
    return (
        <div
            css={css`
                height: 20px;
                font-size: 15px;
                text-align: center;
                margin: 30px 0px;
                position: relative;
                display: block;
                &:after {
                    display: block;
                    content: '';
                    width: 100%;
                    position: absolute;
                    top: 11px;
                    border-bottom: 1px solid #C4C4C4;
                }
                em {
                    display: block;
                    position: absolute;
                    font-style: normal;
                    background: #FFF;
                    left: 50%;
                    z-index: 1;
                    padding: 0 7px;
                    transform: translateX(-50%);
                }
            `}
        >
            <em>{children || 'sau'}</em>
        </div>
    )
}

export default OrSection;