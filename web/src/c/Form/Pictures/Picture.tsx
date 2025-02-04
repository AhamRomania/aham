import { getAccessToken } from "@/c/Auth";
import getDomain, { Domain } from "@/hooks/domain";
import { FC, useEffect, useReducer, useRef, useState } from "react";
import { css } from "@emotion/react";
import { CircularProgress, IconButton } from "@mui/joy";
import { Delete, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { FilePicture, GenericPicture } from "./types";
import { Stack } from "@mui/material";

export interface PictureProps {
    src: GenericPicture;
    onDelete?: () => void;
    onPositionShift?: (picture: GenericPicture, dir: string) => void;
}

const Picture: FC<PictureProps> = ({src, onDelete, onPositionShift}) => {

    if (!onPositionShift) {
        onPositionShift = () => {};
    }

    const cdnURL = getDomain(Domain.Cdn);

    const [token, setToken] = useState('');
    const imgref = useRef(null);
    const [uploading, setUploading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [progressComputable, setProgressComputable] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        getAccessToken().then((v) => setToken(v as string));
    }, []);

    useEffect(() => {
        
        if (!token) {
            return;
        }

        if (src instanceof FilePicture && src.getUUID() === '') {

            setUploading(true);

            const fd = new FormData();
            fd.set("file", src.file)

            const xhr = new XMLHttpRequest();

            xhr.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    setProgressComputable(true);
                    setProgress((event.loaded / event.total) * 100);
                } else {
                    setProgressComputable(false);
                }
                forceUpdate();
            });

            xhr.addEventListener("loadend", () => {
                const upload = JSON.parse(xhr.responseText);
                src.setUUID(upload.uuid);
                setProgress(100);
                setUploading(false);
                forceUpdate();
            });

            xhr.open("POST", cdnURL);
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.send(fd);
        }

    }, [token, src]);

    return (
        <div
            data-test="image-item"
            css={css`
                width: 226px;
                height: 173px;
                border: 4px solid var(--main-color);
                position: relative;
                background: #ddd;
                display: inline-block;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                display: inline-block;
                font-size: 12px;
                margin-right: 10px;
                button {
                    background: #FFF;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            `}
        >
            {
                src.getURL() === "" ?
                <div>Image Placeholder</div> :
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src.getURL()}
                    ref={imgref}
                    alt="Upload Image"
                />
            }
            
            {uploading && <div
                data-test="image-upload-progress"
                css={css`
                    position: absolute;
                    left: 10px;
                    bottom: 5px;   
                    
                    button svg {
                        fill: #000;
                    }
                `}
            >
                <CircularProgress
                    color="primary"
                    size="sm"
                    variant="solid"
                    thickness={3}
                    value={progressComputable ? progress : 0}
                    determinate={progressComputable ? true : false}
                />
            </div>}
            {
                !uploading && (
                    <Stack
                        flexDirection="row"
                        gap={1}
                        css={css`
                            position: absolute;
                            left: 5px;
                            bottom: 5px;
                        `}
                    >
                        <IconButton onClick={() => onPositionShift(src, 'left')} variant="outlined" size="sm">
                            <KeyboardArrowLeft/>
                        </IconButton>
                        <IconButton onClick={() => onPositionShift(src, 'right')} variant="outlined" size="sm">
                            <KeyboardArrowRight/>
                        </IconButton>
                    </Stack>
                )
            }
            {!uploading && <div
                data-test="image-delete-container"
                css={css`
                    position: absolute;
                    right: 5px;
                    top: 5px;   
                    button svg {
                        fill: #000;
                    }
                `}
            >
                <IconButton size="sm" onClick={() => onDelete && onDelete()}>
                    <Delete/>
                </IconButton>
            </div>}
        </div>
    )
}

export default Picture;
