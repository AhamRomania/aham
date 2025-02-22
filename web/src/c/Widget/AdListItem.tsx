import { FC, useEffect, useState } from "react";
import { Ad, Prop } from "../types";
import { css } from "@emotion/react";
import AdPictures from "./AdPictures";
import AdSpectsListing from "./AdSpecsListing";
import { getCategoryProps, publishAd, removeAd } from "@/api/ads";
import { Breadcrumbs, Button } from "@mui/joy";
import { Delete, Edit, Publish } from "@mui/icons-material";
import Confirm from "../Dialog/Confirm";
import Link from "next/link";

export interface AdListItemProps {
    ad: Ad;
    onRemove: (ad:Ad) => void;
}

const AdListItem: FC<AdListItemProps> = ({ad, onRemove}) => {

    const [props, setProps] = useState<Prop[]>();
    const [showRemoveConfirm, setShowRemoveConfig] = useState(false);
    const [showPublishConfirm, setShowPublishConfirm] = useState(false);

    useEffect(() => {
        getCategoryProps(ad.category.id).then(setProps);
    }, []);

    const remove = (proceed?:boolean) => {
        if (proceed) {
            removeAd(ad.id).then(() => {
                onRemove(ad);
            })
        }

        setShowRemoveConfig(false);
    }

    const publish = (proceed?:boolean) => {
        if (proceed) {
            publishAd(ad.id).then(() => {
                onRemove(ad);
            })
        }

        setShowPublishConfirm(false);
    }

    return (
        <>
            <article
                css={css`
                    padding: 10px;
                    display: flex;
                    border-radius: 8px;
                    border:1px solid #ddd;    
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
                                    <Link key={index} href={'/'+ad.category.href.split('/').slice(0,index + 1).join('/')}>
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
                            <Button disabled={true} variant="solid" startDecorator={<Edit/>}>Editează</Button>
                            <Button onClick={() => setShowPublishConfirm(true)} color="success" startDecorator={<Publish/>}>Publică</Button>
                            <div style={{flex: 1}}></div>
                            <Button onClick={() => setShowRemoveConfig(true)} variant="solid" color="danger" startDecorator={<Delete/>}>Șterge</Button>
                        </div>
                    </div>
                </div>
            </article>

            {showRemoveConfirm && (
                <Confirm color="danger" message="Ștergi anunțul?" onResponse={remove}/>
            )}

            {showPublishConfirm && (
                <Confirm color="success" message="Publici anunțul?" onResponse={publish}/>
            )}
        </>
    )
}

export default AdListItem;