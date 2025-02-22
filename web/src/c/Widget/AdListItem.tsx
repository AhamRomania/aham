import { getCategoryProps } from "@/api/ads";
import { css } from "@emotion/react";
import { Breadcrumbs } from "@mui/joy";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Ad, Prop } from "../types";
import AdPictures from "./AdPictures";
import AdSpectsListing from "./AdSpecsListing";

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
                `}
            >
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
                            <h1>{ad.title}</h1>
                            <p>{ad.description}</p>
                            {props && <AdSpectsListing props={props} ad={ad}/>}
                        </div>
                        <div
                            css={css`
                                display: flex;
                                gap: 10px;
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