import { css } from "@emotion/react";
import { Favorite, LocalOffer, Phone, Report, Send } from "@mui/icons-material";
import { Button, CircularProgress, Divider, IconButton, Stack, Textarea } from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { Ad } from "../types";
import UserAvatar from "../avatar";
import Link from "next/link";
import { Space } from "../Layout";
import getApiFetch from "@/api/api";
import { useRouter } from "next/navigation";

export interface AdCtaProps {
    ad: Ad
}

const AdCta:FC<AdCtaProps> = ({ad}) => {
    const router = useRouter();
    const api = getApiFetch();
    const [fetchingPhoneNumber, setFetchingPhoneNumber] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState<string|undefined>();

    const defaultMessage = () => {
        return `Salut ${ad.owner.given_name},\n\n` + 
               `Sunt interesat de acest anunț. Este încă valabil?\n\n` +
               `Mulțumesc`;
    }

    const fetchPhoneNumber = () => {
        if (phoneNumber === '') {return;}
        setFetchingPhoneNumber(true);
        api<string>(`/ads/${ad.id}/contact`,{text: true}).then(
            (nr) => {
                setPhoneNumber(nr);
                setFetchingPhoneNumber(false);
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
    }, []);

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
                <Link href={`/u/`+(ad.owner.username || ad.owner.id)}>
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
                <Textarea defaultValue={defaultMessage()}/>
                <Button startDecorator={<Send fontSize="small"/>}>Trimite</Button>
                <Button startDecorator={<LocalOffer fontSize="small"/>}>Ofertă</Button>
                <Divider/>
                <Stack flexDirection="row" gap={2}>
                    <Stack flex={1}>
                        <Button startDecorator={<Favorite fontSize="small"/>}>Favorite</Button>
                    </Stack>
                    <Stack flex={1}>
                        <Button startDecorator={<Report fontSize="small"/>}>Raportează</Button>
                    </Stack>
                </Stack>
            </Stack>
        </div>
    )
}

export default AdCta;