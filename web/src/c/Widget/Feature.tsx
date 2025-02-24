import { css } from "@emotion/react";
import { Check, FavoriteBorderOutlined, FavoriteRounded, ThumbDown, ThumbUp } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/joy";
import { FC, useState } from "react";
import { track } from "../funcs";

export interface NextFeatureProps {
    feature?: string
}

const NextFeature: FC<NextFeatureProps & React.PropsWithChildren> = ({feature,children}) => {
    const [voted,setVoted] = useState(false);
    const voteUp = () => {
        setVoted(true);
        if (feature && feature != '') {
            track(`feature/${feature}/up`);
        } else {
            track(`feature/up`);
        }
    }
    const voteDown = () => {
        setVoted(true);
        if (feature && feature != '') {
            track(`feature/${feature}/down`);
        } else {
            track(`feature/down`);
        }
    }
    return (
        <div
            css={css`float:left;`}
        >
            <div
                data-test="next-feature"
                css={css`
                    display: inline-block;
                    strong {margin-right: 5px;}
                    padding: 10px 0px;
                    border-radius: 8px;
                `}
            >
                <Stack gap={1} flexDirection="row" alignItems="center">
                    <div css={css`padding:10px 0;`}><strong>Urmează:</strong>{children}</div>
                    {!voted ? <><IconButton size="sm" onClick={voteUp} variant="soft"><ThumbUp fontSize="small"/></IconButton>
                    <IconButton size="sm" onClick={voteDown}variant="soft"><ThumbDown fontSize="small"/></IconButton></> : (
                        <FavoriteRounded fontSize="small"/>
                    )}
                </Stack>
            </div>
        </div>
    )
}

export default NextFeature;