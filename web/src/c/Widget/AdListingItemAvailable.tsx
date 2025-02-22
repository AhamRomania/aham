
import getApiFetch from "@/api/api";
import { css } from "@emotion/react";
import { Delete, Publish } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { FC, useState } from "react";
import Confirm from "../Dialog/Confirm";
import { Ad } from "../types";
import AdPictures from "./AdPictures";

export interface AdListItemProps {
    ad: Ad;
    onChange: () => void
}

const AdListItemAvailable: FC<AdListItemProps> = ({ad, onChange}) => {
    const api = getApiFetch();
    const [showPublishDialog, setShowPublishDialog] = useState<boolean>();

    const publish = (confirm?: boolean) => {
        setShowPublishDialog(false);
        if (confirm) {
            api(`/ads/${ad.id}/publish`,{method:'POST',success:true}).then(
                () => {
                    if (onChange) {
                        onChange();
                    }
                },
                (e: any) => {
                    alert(e);
                }
            );
        }
    }

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
                        width: 200px;    
                    `}
                >
                    <AdPictures  width={200} ad={ad}/>
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
                        </div>
                        <div
                            css={css`
                                display: flex;
                                gap: 10px;
                            `}
                        >
                            <Button onClick={() => setShowPublishDialog(true)} color="success" startDecorator={<Publish/>}>Publică</Button>
                            <div style={{flex: 1}}></div>
                            <Button onClick={() => {}} variant="solid" color="danger" startDecorator={<Delete/>}>Șterge</Button>
                        </div>
                    </div>
                </div>
            </article>
            {showPublishDialog && <Confirm color="success" message="Publici acest anunț?" onResponse={publish}/>}
        </>
    )
}

export default AdListItemAvailable;