"use client"

import { css } from "@emotion/react";
import { FC, PropsWithChildren } from "react";

export interface SectionProps {
    title: string;
    after?: React.ReactNode
    className?: string
}

const Section: FC<SectionProps & PropsWithChildren> = ({title, after, className, children}) => {
    return (
        <div css={css`margin-bottom: 50px; margin-top: 50px; width: 100%;`}>
            <h2>{title}</h2>
            <div className={className} css={css`margin-top: 50px;`}>{children}</div>
            {after && <div css={css`display: flex; justify-content: flex-end;`}>
                {after}
            </div>}
        </div>
    )
};

export default Section;
