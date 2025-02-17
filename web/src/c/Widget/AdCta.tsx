import { css } from "@emotion/react";
import { Favorite, LocalOffer, Phone, Report, Send } from "@mui/icons-material";
import { Button, CircularProgress, Divider, IconButton, Stack, Textarea } from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { Ad, Chat, Message, User } from "../types";
import UserAvatar from "../avatar";
import Link from "next/link";
import { Space } from "../Layout";
import getApiFetch from "@/api/api";
import { useRouter } from "next/navigation";
import { track } from "../funcs";
import { getMe } from "@/api/common";

export interface AdCtaProps {
    ad: Ad
    onAdReport: () => void;
}

const AdCta:FC<AdCtaProps> = ({ad, onAdReport}) => {
    const router = useRouter();
    const api = getApiFetch();
    const [me, setMe] = useState<User>();
    const [fetchingPhoneNumber, setFetchingPhoneNumber] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState<string|undefined>();
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesLoaded, setMessagesLoaded] = useState<boolean>();
    const [messageToSend, setMessageToSend] = useState<string>(
        `Salut ${ad.owner.given_name},\n\n` + 
        `Sunt interesat de acest anunț. Este încă valabil?\n\n` +
        `Mulțumesc`
    )

    const fetchPhoneNumber = () => {
        if (phoneNumber === '') {return;}
        setFetchingPhoneNumber(true);
        api<string>(`/ads/${ad.id}/contact`,{text: true}).then(
            (nr) => {
                setPhoneNumber(nr);
                setFetchingPhoneNumber(false);
                track('ad/cta/phone/reveal',{"ad":ad.id});
            }
        ).catch((err: string) => {
            setFetchingPhoneNumber(false);
            if (err === 'unauthorized') {
                router.push(`/login?then=` + window.location.href + '?phone=show');
                return
            }
            alert("Nu am putut obține numărul de telefon.");
        });
    }

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get('phone')) {
            fetchPhoneNumber();
        }
        getChats();
        getMe().then(setMe);
    }, []);

    useEffect(() => {
        if (chats.length > 0) {
            getLastMessage();
        } else {
            setMessagesLoaded(true);
        }
    }, [chats]);

    const getChats = () => {
        api<Chat[]>(`/chat?reference=${ad.id}`).then(setChats);
    }

    const getLastMessage = () => {
        api<Message[]>(`/chat/${chats[0].id}?offset=0&length=1`).then(
            (items) => {
                setMessagesLoaded(true);
                setMessages(items);
                if (items.length>0) {
                    setMessageToSend('');
                }
            }
        );
    }

    const sendNewMessage = () => {
        
        if (!me) {
            router.push(
                `/login?then=${window.location.href}`
            )
            return;
        }

        if (chats.length > 0) {
            
            api(`/chat/${chats[0].id}`,{method:'POST',body: JSON.stringify({message: messageToSend})}).then(
                () => {
                    setMessageToSend('');
                    getLastMessage();
                }
            ).catch(
                () => {
                    alert('Nu am putut trimite mesajul.');
                }
            )

            return;
        }

        api(`/chat`,{method:'POST',body: JSON.stringify({message: messageToSend, ad: ad.id})}).then(
            () => {
                setMessageToSend('');
                getChats();
            }
        ).catch(
            () => {
                alert('Nu am putut trimite mesajul.');
            }
        )
    }

    const renderMessageSending = () => {

        if (!messagesLoaded) {
            return (
                <div
                    css={css`
                        border: 1px solid #DDD;
                        border-radius: 8px;
                        height: 318px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `}
                >
                    <CircularProgress thickness={2} size="sm"/>
                </div>
            )
        }

        return (
            <>
                {messages.length > 0 && <div
                    css={css`
                            border: 1px solid #DDD;
                            border-radius: 8px;
                            padding: 10px;
                            p {
                                font-size: 14px;
                            }   
                        `}
                        >
                    <strong
                        css={css`
                            font-weight: bold;
                            font-size: 14px;
                            margin-bottom: 10px;
                            display: block;
                        `}
                    >
                        Mesaj
                    </strong>
                    <p>{messages[messages.length - 1].message}</p>
                </div>}
                
                {chats.length > 0 ? <Link href={`/u/mesaje?id=` + chats[0].id} prefetch={false}>
                    <Button style={{width:'100%'}}>Vizualizează conversație activă</Button>
                </Link> : []}
                
                <Textarea
                    value={messageToSend}
                    onFocus={() => track('ad/cta/message/focus', {"ad": ad.id})}
                    onChange={(e: any) => setMessageToSend(e.target.value)}
                    placeholder={chats.length > 0?'Mesaj nou':''}
                />

                <Button disabled={messageToSend === ''} onClick={() => sendNewMessage()} startDecorator={<Send fontSize="small"/>}>Trimite</Button>
            </>
        )
    }

    return (
        <div
            css={css`
                width: 100%;
                height: 100%;
                border-radius: 8px;
                background: #F0F0F0;
                display: flex;
                flex-direction: column;
                padding: 10px;
            `}
        >
            <div
                css={css`
                    margin: 10px 0 15px 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                `}
            >
                <Link href={`/u/`+(ad.owner.username || ad.owner.id)} prefetch={false}>
                    <UserAvatar/>
                </Link>
                <span>{ad.owner.given_name}</span>
                <Space/>
                <IconButton onClick={() => fetchPhoneNumber()} variant="solid">
                    {fetchingPhoneNumber ? <CircularProgress size="sm"/> : <Phone/>}
                </IconButton>
            </div>
            {phoneNumber && <div
                css={css`
                    height: 30px;
                    background: #ddd;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    padding: 30px;  
                    font-size: 27px;
                    font-weight: 400;
                `}
            >
                {phoneNumber}
            </div>}
            <Stack
                css={css`
                    flex: 1;
                    .MuiTextarea-root {
                        height: 100%;
                    }
                `}
                gap={2}
            >
                {renderMessageSending()}
                <Button startDecorator={<LocalOffer fontSize="small"/>}>Ofertă</Button>
                <Divider/>
                <Stack flexDirection="row" gap={2}>
                    <Stack flex={1}>
                        <Button startDecorator={<Favorite fontSize="small"/>}>Favorite</Button>
                    </Stack>
                    <Stack flex={1}>
                        <Button onClick={onAdReport} startDecorator={<Report fontSize="small"/>}>Raportează</Button>
                    </Stack>
                </Stack>
            </Stack>
        </div>
    )
}

export default AdCta;