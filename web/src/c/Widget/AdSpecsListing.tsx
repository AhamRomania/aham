import { FC } from "react";
import { Ad, Prop } from "../types";
import { Stack } from "@mui/joy";
import { css } from "@emotion/react";

export interface AdSpecsListing {
    ad: Ad;
    props: Prop[];
}

const AdSpectsListing:FC<AdSpecsListing> = ({ad, props}) => {
    return (
        <div
            css={css`
                display: grid; 
                grid-template-columns: 50% 50%; 
                gap: 10px 10px;     
            `}
        >
            {props?.sort((a, b) => a.name.localeCompare(b.name, 'ro', { sensitivity: 'base' })).map(prop => ad.props[prop.name] && (
                <Stack
                    key={prop.id}
                    flexDirection="row"
                >
                    <div
                        css={css`
                            margin-right: 10px;
                            font-weight: bold;  
                        `}
                    >{prop.title}:</div>
                    <div>{ad.props[prop.name]}</div>
                </Stack>
            ))}
        </div>
    )
}

export default AdSpectsListing;