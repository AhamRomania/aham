"use client";

import getDomain, { Domain } from "@/c/domain";
import { css } from "@emotion/react";
import { Button, Stack } from "@mui/joy";
import { FC, useRef, useState } from "react";
import Picture from "./Picture";
import { FilePicture, GenericPicture } from "./types";

export interface PicturesProps {
    name: string;
    onChange?: (pictures:GenericPicture[]) => void;
}

const Pictures: FC<PicturesProps> = ({name, onChange}: PicturesProps) => {

    const [images, setImages] = useState<GenericPicture[]>([] as GenericPicture[]);
    const input = useRef<HTMLInputElement>(null);
    const [dropHighlighted, setDropHighlighted] = useState(false);


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

            fetch(getDomain(Domain.Cdn,'/' + uuid), {method:'DELETE'}).then(
                () => {
                    images.splice(index, 1);       
                    setImages([...images]);
                }
            )

            return;
        }

        images.splice(index, 1);       
        setImages([...images]);

    }

    const onPicturePositionShift = (picture: GenericPicture, shift: string) => {
        const index = images.indexOf(picture);
        if (shift === 'left') {
            shiftLeft(index);
        } else if(shift === 'right') {
            shiftRight(index);
        }
    }

    const shiftLeft = (index: number) => {
        if (index <= 0 || index >= images.length) return images; // Invalid index check
        [images[index], images[index - 1]] = [images[index - 1], images[index]]; // Swap elements      
        setImages([...images]);
    }

    const shiftRight = (index: number) => {
        if (index < 0 || index >= images.length - 1) return images; // Invalid index check
        [images[index], images[index + 1]] = [images[index + 1], images[index]]; // Swap elements
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
                height: 240px;
                border-radius: var(--joy-radius-sm);
                box-sizing: border-box;
                box-shadow: var(--joy-shadowRing, 0 0 #000),0px 1px 2px 0px rgba(var(--joy-shadowChannel, 21 21 21) / var(--joy-shadowOpacity, 0.08));    
                border: var(--variant-borderWidth) ${dropHighlighted ? 'dashed':'solid'};
                border-color: ${dropHighlighted ? 'var(--main-color)' : 'var(--variant-outlinedBorder, var(--joy-palette-neutral-outlinedBorder, var(--joy-palette-neutral-300, #CDD7E1)))'};
                background-color: var(--joy-palette-background-surface);
                padding: 10px;
                @media only screen and (min-width : 1200px) {

                }
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
                                        Încarcă imagini
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
                        height: 100%;
                        display: block; 
                        white-space: nowrap;
                        overflow-x: auto;
                        padding: 10px;
                        max-width: 100%;
                    `}
                >
                    
                    {images.map((image, index) => (
                        <Picture
                            onDelete={() => onPictureDelete(index)}
                            onPositionShift={onPicturePositionShift}
                            src={image} key={index}
                        />
                    ))}

                    <div
                        css={css`
                            width: 226px;
                            height: 173px;
                            border: 4px solid var(--main-color);
                            position: relative;
                            background: #ddd;
                            display: inline-block;
                            border-radius: 8px;
                            font-size: 12px;
                            margin-right: 10px;
                            position: relative;
                            div {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                button {
                                    background: #FFF;
                                }
                            }
                        `}
                    >
                        <div>
                            <Button
                                color="success"
                                variant="plain"
                                onClick={() => select()}
                            >
                                Încarcă imagini
                            </Button>
                        </div>
                    </div>
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

            <input
                type="hidden"
                name={name}
                value={images.map(image => image.getUUID()).join(',')}
            />
        </div>
    )
}

export default Pictures;
