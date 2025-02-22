import { css } from "@emotion/react";
import Image from "next/image";
import { FC } from "react";

export interface NoResultsProps {
    after?: React.ReactNode
}

const NoResults:FC<NoResultsProps> = ({after}) => {
    return (
        <div
            css={css`
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            `}
        >
            <Image width={450} height={450} alt="NoResults" src="/empty-results.png"/>
            {after}
        </div>
    )
}

export default NoResults