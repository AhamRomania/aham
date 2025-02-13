"use client";

import { FC } from "react";
import { Ad } from "../types";
import { css } from "@emotion/react";
import Gallery from "../Widget/Gallery";
import AdCta from "../Widget/AdCta";
import Link from "next/link";
import { Breadcrumbs } from "@mui/joy";

export interface AdPageProps {
    ad: Ad;
}

const AdPage:FC<AdPageProps> = ({ad}) => {
    return (
        <main>
            <div
                data-test="ad-parts"
                css={css`
                    margin-top: 30px;
                    display: grid;
                    gap: 10px 24px;
                    grid-template-columns: 700px 300px;
                    grid-template-rows: repeat(3, auto);
                    @media only screen and (max-width : 1200px) {
                        grid-template-columns: 100%;
                        grid-template-rows: none;
                    }
                `}
            >
                <div
                    data-test="ad-contents"
                    css={css`
                        order: 1;
                        flex: 1;
                        @media only screen and (max-width : 1200px) {
                            order: 0;
                        }
                    `}
                >
                    <Breadcrumbs
                        css={css`font-size: 14px;padding:0;`}
                    >
                        {ad.category.path.split(' > ').map((item,index) => (
                            <Link key={index} href={'/'+ad.category.href.split('/').slice(0,index + 1).join('/')}>
                                {item}
                            </Link>
                        ))}
                    </Breadcrumbs>
                    <h1 css={css`font-size: 36px; font-weight: bold;`}>{ad.title}</h1>
                    <p css={css`font-size: 16px;`}>{ad.city_name}</p>
                </div>
                <div
                    data-test="ad-cta"
                    css={css`
                        order: 2;
                        display: flex;
                        align-items: flex-end;
                        @media only screen and (max-width : 1200px) {
                            order:4;
                        }
                    `}
                >
                    SOCIALS
                </div>
                <div
                    data-test="ad-cta"
                    css={css`
                        order: 3;
                        @media only screen and (max-width : 1200px) {
                            order: 2;
                        }
                    `}
                >
                    <Gallery pictures={ad.pictures}/>
                </div>
                <div
                    data-test="ad-cta"
                    css={css`
                        order: 4;
                        @media only screen and (max-width : 1200px) {
                            order: 5;
                        } 
                    `}
                >
                    <AdCta/>
                </div>
                <div
                    data-test="ad-details"
                    css={css`
                        order: 5;
                        @media only screen and (max-width : 1200px) {
                            order: 3;
                        }
                    `}
                >
                    Details
                </div>
                <div
                    data-test="ad-advertising"
                    css={css`
                        order: 6;
                        @media only screen and (max-width : 1200px) {
                            order: 5;
                        }
                    `}
                >
                    
                </div>
            </div>
        </main>
    )
}

export default AdPage;