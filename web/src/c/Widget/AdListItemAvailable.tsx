
import getApiFetch from "@/api/api";
import { Delete, Publish } from "@mui/icons-material";
import { Button, IconButton } from "@mui/joy";
import { FC, useState } from "react";
import Confirm from "../Dialog/Confirm";
import { Ad } from "../types";
import AdListItem from "./AdListItem";

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
        <AdListItem ad={ad} actions={(
            <>
                <Button onClick={() => setShowPublishDialog(true)} color="success" startDecorator={<Publish/>}>Publică</Button>
                <div style={{flex: 1}}></div>
                <IconButton onClick={() => {}} variant="solid" color="danger"><Delete/></IconButton>
            </>
        )}/>
        {showPublishDialog && <Confirm color="success" message="Publici acest anunț?" onResponse={publish}/>}
        </>
    )
}

export default AdListItemAvailable;