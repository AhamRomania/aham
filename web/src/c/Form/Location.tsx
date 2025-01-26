import { css } from "@emotion/react";
import { Button, Stack } from "@mui/joy";
import { FC, useState } from "react";

const Location: FC = () => {

    const [empty, setEmpty] = useState(true);

    return (
        <div
            css={css`
                position:relative;
                height: 250px;
                border-radius: var(--joy-radius-sm);
                box-sizing: border-box;
                box-shadow: var(--joy-shadowRing, 0 0 #000),0px 1px 2px 0px rgba(var(--joy-shadowChannel, 21 21 21) / var(--joy-shadowOpacity, 0.08));    
                border: var(--variant-borderWidth) solid;
                border: 1px solid;
                border-color: var(--variant-outlinedBorder, var(--joy-palette-neutral-outlinedBorder, var(--joy-palette-neutral-300, #CDD7E1)));
                background-color: var(--joy-palette-background-surface);
            `}
        >

            {empty && (
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
                        <Button>Dialog încărcare imagini</Button>
                        <div>
                            <span>sau</span>
                            <p>Trage imagini în acest chenar</p>
                        </div>
                    </Stack>
                </div>
            )}
        </div>
    )
}

export default Location;