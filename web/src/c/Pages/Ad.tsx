"use client";

import { css } from "@emotion/react";
import { Breadcrumbs, CircularProgress, Stack } from "@mui/joy";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { formatMoney } from "../formatter";
import { Ad, Prop, User } from "../types";
import AdCta from "../Widget/AdCta";
import AdPictures from "../Widget/AdPictures";
import MoreAds from "../Widget/MoreAds";
import SocialShare from "../Widget/SocialShare";
import { track } from "../funcs";
import { getUser } from "../Auth";
import AdPanel from "../Widget/AdPanel";
import ReportAdDialog from "../Dialog/ReportAd";
import AdSpectsListing from "../Widget/AdSpecsListing";

export interface AdPageProps {
    ad: Ad;
    extra: Ad[];
    props: Prop[];
}   

const AdPage:FC<AdPageProps> = ({ad,extra,props}) => {

    const [me,setMe] = useState<User|null>(null);
    const [fetchingMe, setFetchingMe] = useState(true);
    const [showReportDialog, setShowReportDialog] = useState<boolean>(false);

    useEffect(() => {
        getUser().then((me) => {
            setMe(me);
            setFetchingMe(false);
        }).catch(
            () => {
                setFetchingMe(false);
            }
        );
    }, []);

    useEffect(() => {
        track("ad/view",{"ad":ad.id});
    }, []);

    const renderGalleryAside = () => {
        
        if (fetchingMe) {
            return (
                <div
                    css={css`
                        height: 100%;
                        background: #EEE;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;    
                    `}
                >
                    <CircularProgress thickness={2} size="sm" variant="plain"/>
                </div>
            );
        }

        if (ad.owner.id == me?.id) {
            return (
                <AdPanel ad={ad}/>
            );
        }

        return <AdCta me={me} ad={ad} onAdReport={() => setShowReportDialog(true)}/>;
    }

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
                                <p css={css`font-size: 16px;`}>{ad.location.text}</p>
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
                        <AdPictures width={700} ad={ad}/>
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
                        {renderGalleryAside()}
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
                        {ad.props && Object.keys(ad.props||[]).length > 0 && <div>
                            <h2>Specificații</h2>
                            <AdSpectsListing props={props} ad={ad}/>
                        </div>}
                    </div>
                    <div
                        data-test="ad-advertising"
                        css={css`
                            order: 6;
                            display: flex;
                            justify-content: center;
                            align-items: center;
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
            {showReportDialog && <ReportAdDialog ad={ad} onClose={() => setShowReportDialog(false)}/>}
        </>
    )
}

export default AdPage;