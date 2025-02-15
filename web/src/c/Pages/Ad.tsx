"use client";

import getApiFetch from "@/api/api";
import { css } from "@emotion/react";
import { Breadcrumbs, Grid, Stack } from "@mui/joy";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { formatMoney } from "../formatter";
import { Ad, Prop } from "../types";
import AdCta from "../Widget/AdCta";
import Gallery from "../Widget/Gallery";
import MoreAds from "../Widget/MoreAds";
import SocialShare from "../Widget/SocialShare";

export interface AdPageProps {
    ad: Ad;
}   

const AdPage:FC<AdPageProps> = ({ad}) => {
    const api = getApiFetch();
    const [extra, setExtra] = useState<Ad[]>();
    const [props, setProps] = useState<Prop[]>();

    useEffect(() => {
        // todo: `/ads/${ad.id}/extra`
        api<Ad[]>(`/ads`).then(setExtra);
        api<Prop[]>(`/categories/${ad.category_id}/props`).then(setProps);
    }, []);

    return (
        <>
            <main itemScope itemType="https://schema.org/Product">
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
                        <Stack>
                            <Stack>
                                <Breadcrumbs
                                    css={css`font-size: 14px;padding:0;`}
                                >
                                    {ad.category.path.split(' > ').map((item,index) => (
                                        <Link key={index} href={'/'+ad.category.href.split('/').slice(0,index + 1).join('/')}>
                                            {item}
                                        </Link>
                                    ))}
                                </Breadcrumbs>
                            </Stack>
                            <Stack
                                css={css`
                                    flex-direction: column;
                                    @media only screen and (min-width: 1200px) {
                                        flex-direction: row;
                                    }
                                `}
                            >
                                <Stack flex={1}>
                                    <h1 itemProp="name" css={css`font-size: 36px; font-weight: bold;`}>{ad.title}</h1>
                                </Stack>
                                <Stack alignItems="flex-end" justifyContent="flex-end">
                                    <span
                                        itemProp="price"
                                        css={css`
                                            font-size: 42px;
                                            font-weight: 900;    
                                        `}
                                    >{formatMoney(ad.price, ad.currency)}</span>
                                </Stack>
                            </Stack>
                            <Stack>
                                <p css={css`font-size: 16px;`}>{ad.city_name}</p>
                            </Stack>
                        </Stack>
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
                        <Stack
                            css={css`
                                margin-bottom: 24px;    
                            `}
                            flex={1}
                            justifyContent="center"
                            alignItems="center"
                        >
                            {typeof(window) !== 'undefined' && <SocialShare ad={ad} url={window.location.href}/>}
                        </Stack>
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
                        <AdCta ad={ad}/>
                    </div>
                    <div
                        data-test="ad-details"
                        css={css`
                            order: 5;
                            @media only screen and (max-width : 1200px) {
                                order: 3;
                            }
                            h2 {
                                font-size: 24px;
                                font-weight: bold;
                                margin-bottom: 20px;
                            }
                            > div {
                                margin-bottom: 30px; 
                            }
                        `}
                    >
                        <div>
                            <h2>Descriere</h2>
                            <p>{ad.description}</p>
                        </div>
                        {ad.props && <div>
                            <h2>Specificații</h2>
                            <div
                                css={css`
                                    display: grid; 
                                    grid-template-columns: 50% 50%; 
                                    gap: 10px 10px;     
                                `}
                            >
                                {props?.sort((a, b) => a.name.localeCompare(b.name, 'ro', { sensitivity: 'base' })).map(prop => ad.props[prop.name] && (
                                    <Stack
                                        key={prop.id}
                                        flexDirection="row"
                                    >
                                        <div
                                            css={css`
                                                margin-right: 10px;
                                                font-weight: bold;  
                                            `}
                                        >{prop.title}:</div>
                                        <div>{ad.props[prop.name]}</div>
                                    </Stack>
                                ))}
                            </div>
                        </div>}
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
                        <div
                            css={css`
                                border-radius: 8px;
                                background:#fafafa;
                                margin-top: 14px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-direction: column;
                                font-size: 10px;
                                width: 300px;
                                height: 250px;
                                a { color: #999; }
                            `}
                        >
                            <Link href="/promovare?uiref=ad_page_banner" prefetch={false}>Vreau acest spațiu de promovare.</Link>
                        </div>
                    </div>
                </div>
            </main>
            <MoreAds title="Asemănătoare" ads={extra!}/>
        </>
    )
}

export default AdPage;