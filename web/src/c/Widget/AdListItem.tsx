import { getCategoryProps } from "@/api/ads";
import { css } from "@emotion/react";
import { Breadcrumbs } from "@mui/joy";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Ad, Prop } from "../types";
import AdPictures from "./AdPictures";
import AdSpectsListing from "./AdSpecsListing";
import { dateTime } from "../formatter";

export interface AdListItemProps {
    ad: Ad;
    actions?: React.ReactNode
}

const AdListItem: FC<AdListItemProps> = ({ad, actions}) => {
    const [props, setProps] = useState<Prop[]>();
    useEffect(() => {
        getCategoryProps(ad.category.id).then(setProps);
    }, []);
    return (
        <>
            <article
                css={css`
                    padding: 10px;
                    display: flex;
                    border-radius: 8px;
                    border:1px solid #ddd;  
                    margin-bottom: 20px;  
                    position: relative;
                `}
            >
                <div
                    css={css`
                        position:absolute;
                        right: 10px;
                        top: 10px; 
                        font-size: 15px; 
                        display: flex;
                        > div {
                            margin-left: 10px; 
                        }  
                    `}
                >
                    {ad.created && <div>
                        <strong>Creat:</strong> <span>{dateTime(ad.created)}</span>
                    </div>}
                    {ad.published && <div>
                        <strong>Publicat:</strong> <span>{dateTime(ad.published)}</span>
                    </div>}
                    {ad.valid_through && <div>
                        <strong>Valabil:</strong> <span>{dateTime(ad.valid_through)}</span>
                    </div>}
                </div>
                <div>
                    <AdPictures 
                        width={200}
                        ad={ad}
                    />
                </div>
                <div
                    css={css`
                        flex: 1;
                        display: flex;
                        margin-left: 10px;
                    `}
                >
                    <div
                        css={css`
                            flex: 1;
                            margin-left: 10px;
                            flex-direction: column;
                            display: flex;
                        `}
                    >
                        <div
                            css={css`
                                flex: 1;
                            `}
                        >
                            <Breadcrumbs
                                css={css`font-size: 14px;padding:0;`}
                                >
                                {ad.category.path.split(' > ').map((item,index) => (
                                    <Link prefetch={false} key={index} href={'/'+ad.category.href.split('/').slice(0,index + 1).join('/')}>
                                        {item}
                                    </Link>
                                ))}
                            </Breadcrumbs>
                            <h1 style={{marginTop: '10px'}}>{ad.title}</h1>
                            <p>{ad.description}</p>
                            {props && <AdSpectsListing props={props} ad={ad}/>}
                        </div>
                        <div
                            css={css`
                                display: flex;
                                gap: 10px;
                                padding-top: 20px;
                            `}
                        >
                            {actions}
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}

export default AdListItem;