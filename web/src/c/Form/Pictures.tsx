import { css } from "@emotion/react";
import { Delete } from "@mui/icons-material";
import { Button, CircularProgress, Stack } from "@mui/joy";
import { IconButton } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import Tip from "../tooltip";
import useDomain, { Domain } from "@/hooks/domain";
import { getAccessToken } from "../Auth";

export interface ImageData {
    file: File
    uuid: string;
}

export interface PicturesProps {
    onChange?: (images:ImageData[]) => void;
}

const Pictures: FC<PicturesProps> = ({onChange}: PicturesProps) => {

    const [images, setImages] = useState<ImageData[]>([] as ImageData[]);
    const input = useRef<HTMLInputElement>(null);
    const [dropHighlighted, setDropHighlighted] = useState(false);

    // eslint-disable-next-line 
    const onFilesChange = (event: any) => {
        
        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

        let list:ImageData[] = [...images];
        for(let i=0;i<files.length;i++) {
            list = [...list, {
                file: files[i],
                uuid: '',
            }];
        }

        setImages(list)

        if (onChange) {
            onChange(list);
        }
    }

    const onImageDelete = (index: number) => {
        images.splice(index, 1)
        setImages([...images])
    }

    const select = () => {
        input.current?.click();
    }

    const onDragEnter = () => {
        setDropHighlighted(true);
    }

    const onDragExit = () => {
        setDropHighlighted(false);
    }

    return (
        <div

            onDragEnter={onDragEnter}
            onDragLeave={onDragExit}

            css={css`
                --variant-borderWidth:1px;
                position:relative;
                height: 250px;
                border-radius: var(--joy-radius-sm);
                box-sizing: border-box;
                box-shadow: var(--joy-shadowRing, 0 0 #000),0px 1px 2px 0px rgba(var(--joy-shadowChannel, 21 21 21) / var(--joy-shadowOpacity, 0.08));    
                border: var(--variant-borderWidth) ${dropHighlighted ? 'dashed':'solid'};
                border-color: ${dropHighlighted ? 'var(--main-color)' : 'var(--variant-outlinedBorder, var(--joy-palette-neutral-outlinedBorder, var(--joy-palette-neutral-300, #CDD7E1)))'};
                background-color: var(--joy-palette-background-surface);
                overflow: auto;
                padding: 10px 0px;
            `}
        >

            {images.length == 0 ? (
                <div
                    css={css`
                        width: 100%; 
                        height: 100%; 
                    `}
                >
                    <Stack
                        css={css`
                            width: 100%; 
                            height: 100%; 
                            display: flex;
                            min-height: 100%;
                            flex-direction:column;
                            align-items: center;
                            justify-content: center;
                            div {
                                text-align: center;
                                font-size: 12px;
                                line-height: 25px;
                                margin-top: 10px;
                            }
                        `}
                    >
                        {
                            !dropHighlighted ? (
                                <>
                                    <Button
                                        onClick={() => select()}
                                    >
                                        Dialog încărcare imagini
                                    </Button>
                                    <div>
                                        <span>sau</span>
                                        <p>Trage imagini în acest chenar</p>
                                    </div>
                                </>   
                            ) : (
                                <div>Lasă fișierele aici</div>
                            )
                        }                        
                    </Stack>
                </div>
            ) : (
                <div
                    css={css`
                        display: grid; 
                        grid-template-columns: 1fr 1fr 1fr; 
                        gap: 10px 10px;
                        margin: 5px 10px;
                    `}
                >
                    {images.map((image, index) => <Picture onDelete={() => onImageDelete(index)} image={image} key={index}/>)}
                </div>
            )}

            <input
                ref={input}
                type="file"
                accept="image/*"
                multiple={true}
                onChange={onFilesChange}
                css={css`                  
                    opacity: 0;
                `}
            />
        </div>
    )
}

export default Pictures;

export interface PictureProps {
    image: ImageData;
    onDelete?: () => void;
}

const Picture: FC<PictureProps> = ({image, onDelete}) => {

    const cdnURL = useDomain(Domain.Cdn);

    const [token, setToken] = useState('');
    const imgref = useRef<HTMLImageElement>(null);
    const [src, setSrc] = useState<string>("");
    const [uploading, setUploading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [progressComputable, setProgressComputable] = useState(true);

    useEffect(() => {
        getAccessToken().then((t) => setToken(t as string));
    }, []);

    useEffect(() => {

        if (!image || !image.file) {
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function () {
            if (reader.result !== "") {
                setSrc(reader.result as string);
            }
        }

        reader.readAsDataURL(image.file);

    }, [image]);

    useEffect(() => {
        
        if (token === '' || cdnURL === '' || !image.file) {
            return;
        }

        const fd = new FormData();
        fd.set("file", image.file)

        const xhr = new XMLHttpRequest();

        xhr.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                setProgress((event.loaded / event.total) * 100);
            } else {
                setProgressComputable(false);
            }
        });

        xhr.addEventListener("loadend", () => {
            setUploading(false);
            setProgress(100);
            const upload = JSON.parse(xhr.responseText);
            image.uuid = upload.uuid;
            setSrc(cdnURL + '/' + image.uuid + '?w=226')
        });

        xhr.open("POST", cdnURL);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send(fd);

        // eslint-disable-next-line
    }, [cdnURL, token, image.file]);

    return (
        <div
            data-test="image-item"
            css={css`
                width: 226px;
                height: 173px;
                border: 4px solid var(--main-color);
                position: relative;
                background: #ddd;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                overflow: hidden;
                display: inline-block;
                font-size: 12px;
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
                src === "" ?
                <div>Image Placeholder</div> :
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    ref={imgref}
                    alt={image.file.name}
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
                    value={progress}
                    determinate={!progressComputable}
                />
            </div>}
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
                <Tip title="Șterge">
                    <IconButton size="small" onClick={() => onDelete && onDelete()}>
                        <Delete/>
                    </IconButton>
                </Tip>
            </div>}
        </div>
    )
}
