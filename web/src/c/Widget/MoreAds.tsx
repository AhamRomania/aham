"use client";

import { FC } from "react";
import { Ad } from "../types";
import Section from "../section";
import { AdCard } from "../Ad";
import { css } from "@emotion/react";

export interface MoreAdsProps {
    ads: Ad[];
    title?: string;
    before: React.ReactNode;
    titleNodeType?: string;
}

const MoreAds:FC<MoreAdsProps> = ({ads,title,before,titleNodeType = 'h2'}) => {
    return (
        <Section
            title={title?title:''}
            before={before}
            titleNodeType={titleNodeType}
            css={css`
                display: grid; 
                grid-template-columns: 1fr; 
                gap: 42px;
                grid-template-areas: ". ";

                @media only screen and (min-width : 700px) { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 42px;
                    grid-template-areas: 
                    ". ."; 
                }
                @media only screen and (min-width : 1200px) { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 42px; 
                    grid-template-areas: 
                    ". . ."; 
                }
            `}
        >
                {(ads && ads.length) ? ads.map((vo,index) => <AdCard key={index} width={312} height={357} vo={vo}/>) : <span style={{fontStyle: 'italic', color: '#999'}}>Nu sunt anunțuri</span>}
        </Section>
    )
}

export default MoreAds;