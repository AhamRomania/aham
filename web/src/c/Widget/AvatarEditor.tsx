import { getMe, updateUserPicture } from "@/api/common";
import { css } from "@emotion/react";
import { Avatar, CircularProgress } from "@mui/joy";
import { FC, useEffect, useReducer, useRef, useState } from "react";
import { getAccessToken } from "../Auth";
import getDomain, { Domain } from "../domain";
import { User } from "../types";

const AvatarEditor:FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [, setMe]=useState<User|null>();
    const [uploading,setUploading]=useState(false);
    const [picture, setPicture] = useState('');
    const [token, setToken] = useState('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        getAccessToken().then((v) => setToken(v as string));
    }, []);

    useEffect(()=>{
        getMe().then((me) => {
            setMe(me);
            if (me?.picture) {
                setPicture(getDomain(Domain.Cdn)+`/`+me?.picture);
            }
        });
    },[]);
    const onAvatarClick = () => {
        if (inputRef) {
            inputRef.current?.click();
        }
    }
    const onPictureChoose = (event: any) => {

        if (!token) {
            console.warn('token is mandatory')
            return
        }

        if (!event.target.files) {
            console.warn('files must be selected')
            return;
        }

        const cdnURL = getDomain(Domain.Cdn);

        setUploading(true);

        const fd = new FormData();
        fd.set("file", event.target.files.item(0)!)

        const xhr = new XMLHttpRequest();

        xhr.addEventListener("loadend", () => {
            try {
                const upload = JSON.parse(xhr.responseText);
                setPicture(cdnURL + '/' + upload.uuid);
                updateUserPicture(upload.uuid);
                setUploading(false);
                forceUpdate();
            } catch(e: any) {
                console.warn('Picture upload warn:', e);
                alert('Nu am putut încărca fotografia.')
            }
        });

        xhr.open("POST", cdnURL);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send(fd);
    }
    return (
        <div
            css={css`
                position: relative;
                input[type="file"] {
                    opacity: 0;
                    position: absolute;
                }
                .avatar {
                    cursor: pointer;
                }
                .uploading {
                    position: absolute;
                }
            `}
        >
            {uploading && <div className="uploading"><CircularProgress size="sm"/></div>}
            <input onChange={onPictureChoose} ref={inputRef} type="file" name="picture"/>
            <div
                className="avatar"
                onClick={onAvatarClick}
            >
                <Avatar src={picture} size="lg" sx={{borderRadius:'5px', width: '150px', height: '150px'}}/>
            </div>
        </div>
    )
}

export default AvatarEditor;