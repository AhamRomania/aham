import { getCategoryProps } from "@/api/ads";
import { css } from "@emotion/react";
import { FC, useEffect, useState } from "react";
import { Ad, Prop } from "../types";
import AdSpectsListing from "./AdSpecsListing";
import AdPictures from "./AdPictures";

export interface AdListItemProps {
    ad: Ad;
}

const AdListItemPending: FC<AdListItemProps> = ({ad}) => {

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
                <div
                    css={css`
                        width: 400px;    
                    `}
                >
                    <AdPictures 
                        width={400}
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
                            <h1>{ad.title}</h1>
                            <p>{ad.description}</p>
                            {props && <AdSpectsListing props={props} ad={ad}/>}
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}

export default AdListItemPending;