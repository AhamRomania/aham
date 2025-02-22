import { publishAd, removeAd } from "@/api/ads";
import { Delete, Edit, Publish } from "@mui/icons-material";
import { Button, IconButton } from "@mui/joy";
import { FC, useState } from "react";
import Confirm from "../Dialog/Confirm";
import { Ad } from "../types";
import AdListItem from "./AdListItem";

export interface AdListItemProps {
    ad: Ad;
    onRemove: (ad:Ad) => void;
}

const AdListItemDraft: FC<AdListItemProps> = ({ad, onRemove}) => {

    const [showRemoveConfirm, setShowRemoveConfig] = useState(false);
    const [showPublishConfirm, setShowPublishConfirm] = useState(false);

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
        <AdListItem ad={ad} actions={(
            <>
                <Button disabled={true} variant="solid" startDecorator={<Edit/>}>Editează</Button>
                <Button onClick={() => setShowPublishConfirm(true)} color="success" startDecorator={<Publish/>}>Publică</Button>
                <div style={{flex: 1}}></div>
                <IconButton onClick={() => setShowRemoveConfig(true)} variant="solid" color="danger"><Delete/></IconButton>
            </>
        )}/>
        {showRemoveConfirm && (
            <Confirm color="danger" message="Ștergi anunțul?" onResponse={remove}/>
        )}

        {showPublishConfirm && (
            <Confirm color="success" message="Publici anunțul?" onResponse={publish}/>
        )}
        </>
    )
}

export default AdListItemDraft;