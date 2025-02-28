"use client"

import { css } from "@emotion/react";
import { FC, PropsWithChildren, ReactNode } from "react";

export interface SectionProps {
    title: string | ReactNode;
    after?: React.ReactNode
    className?: string
}

const AccountSection: FC<SectionProps & PropsWithChildren> = ({title, after, className, children}) => {
    return (
        <div css={css`padding-bottom: 30px; padding-top: 20px; width: 100%;`}>
            <h2>{title}</h2>
            <div className={className} css={css`margin-top: 20px;`}>{children}</div>
            {after && <div css={css`display: flex; justify-content: flex-end;`}>
                {after}
            </div>}
        </div>
    )
};

export default AccountSection;
