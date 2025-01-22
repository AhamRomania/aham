"use client"

import { css } from "@emotion/react";
import { Button } from "@mui/joy";
import { ArrowRight } from "@mui/icons-material";
import { FC, PropsWithChildren } from "react";

export interface SectionProps {
    title: string;
}

const Section: FC<SectionProps & PropsWithChildren> = ({title, children}) => {
    return (
        <div css={css`margin-bottom: 50px; margin-top: 50px; width: 100%;`}>
            <h2>{title}</h2>
            <div css={css`margin-top: 50px;`}>{children}</div>
            <div css={css`display: flex; justify-content: flex-end;`}>
                <Button size="lg" variant="plain" endDecorator={<ArrowRight/>}>Categorii</Button>
            </div>
        </div>
    )
};

export default Section;
