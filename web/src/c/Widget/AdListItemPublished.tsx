import { Analytics, Chat as ChatIcon, Preview, Restore } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { Ad, Chat } from "../types";
import AdListItem from "./AdListItem";
import { getChats } from "@/api/chat";

export interface AdListItemProps {
    ad: Ad;
}

const AdListItemPublished: FC<AdListItemProps> = ({ad}) => {
    const [chat,setChat] = useState<Chat|null>(null);
    useEffect(() => {
        getChats().then(chats => setChat(chats.find(c => parseInt(c.reference) == ad.id) || null))
    },[]);
    return (
        <>
        <AdListItem ad={ad} actions={(
            <>
                <Button onClick={() => window.open(ad.href)} variant="soft" startDecorator={<Preview/>}>Pagină anunț</Button>
                <Button onClick={() => window.open(`/u/statistici/${ad.id}`)} variant="soft" startDecorator={<Analytics/>}>Statistici anunț</Button>
                <Button disabled={!chat} onClick={() => window.open(`/u/mesaje/${(chat||{}).id}`)} variant="soft" startDecorator={<ChatIcon/>}>Mesaje anunț</Button>
            </>
        )}/>
        </>
    )
}

export default AdListItemPublished;