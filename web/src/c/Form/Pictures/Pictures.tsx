import { css } from "@emotion/react";
import { Button, Stack } from "@mui/joy";
import { FC, useReducer, useRef, useState } from "react";
import { FilePicture, GenericPicture } from "./types";
import Picture from "./Picture";
import useDomain, { Domain } from "@/hooks/domain";

export interface PicturesProps {
    onChange?: (pictures:GenericPicture[]) => void;
}

const Pictures: FC<PicturesProps> = ({onChange}: PicturesProps) => {

    const [images, setImages] = useState<GenericPicture[]>([] as GenericPicture[]);
    const input = useRef<HTMLInputElement>(null);
    const [dropHighlighted, setDropHighlighted] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const onFilesChange = (event: any) => {
        
        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

        let list:GenericPicture[] = [...images];

        for(let i=0;i<files.length;i++) {
            list = [...list, new FilePicture(files[i])];
        }

        setImages(list)

        if (onChange) {
            onChange(list);
        }
    }

    const onPictureDelete = (index: number) => {
        
        const uuid = images[index].getUUID();

        if (uuid !== '') {

            fetch(useDomain(Domain.Cdn,'/' + uuid), {method:'DELETE'}).then(
                () => {
                    images.splice(index, 1);       
                    setImages([...images]);
                    forceUpdate();
                }
            )

            return;
        }

        images.splice(index, 1);       
        setImages([...images]);

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
                    {images.map((image, index) => (
                        <Picture
                            onDelete={() => onPictureDelete(index)}
                            src={image} key={index}
                        />
                    ))}
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
