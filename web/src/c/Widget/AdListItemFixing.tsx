import { Restore } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { FC } from "react";
import { Ad } from "../types";
import AdListItem from "./AdListItem";

export interface AdListItemProps {
    ad: Ad;
    onChange:()=>void;
}

const AdListItemFixing: FC<AdListItemProps> = ({ad}) => {

    return (
        <>
        <AdListItem ad={ad} actions={(
            <>
                <Button disabled={true} variant="soft" startDecorator={<Restore/>}>Mută la ciorne</Button>
            </>
        )}/>
        </>
    )
}

export default AdListItemFixing;