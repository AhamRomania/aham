import { css } from "@emotion/react";
import { Button, Stack } from "@mui/joy";
import { FC, useEffect, useRef, useState } from "react";

export interface Image {}

export interface PicturesProps {
    onChange?: (images:Image[]) => void;
}

const Pictures: FC<PicturesProps> = ({onChange}: PicturesProps) => {

    const [images, setImages] = useState([]);
    const input = useRef<HTMLInputElement>(null);
    const [dropHighlighted, setDropHighlighted] = useState(false);

    const onFilesChange = (event: any) => {
        
        let selectedFiles = event.dataTransfer ? event.dataTransfer.files : event.target.files;

        let list = [...images];
        for(let i=0;i<selectedFiles.length;i++) {
            list = [...list, selectedFiles[i]];
        }

        setImages(list)

        onChange && onChange(list)
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
                <div>
                    {images.map((image, index) => <Picture file={image} key={index}/>)}
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
    file: File;
}

const Picture: FC<PictureProps> = ({file}) => {
    return (
        <div>
            TEST {file.name}
        </div>
    )
}
