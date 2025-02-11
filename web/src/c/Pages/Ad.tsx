"use client";

import { FC } from "react";
import { Ad } from "../types";
import { css } from "@emotion/react";
import Gallery from "../Widget/Gallery";
import AdCta from "../Widget/AdCta";

export interface AdPageProps {
    ad: Ad;
}

const AdPage:FC<AdPageProps> = ({ad}) => {
    return (
        <main>
            <div
                data-test="ad-parts"
                css={css`
                    display: grid;
                    gap: 24px;
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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