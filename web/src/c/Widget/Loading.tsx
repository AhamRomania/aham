import { css } from "@emotion/react";
import { CircularProgress } from "@mui/joy";
import { FC } from "react";

const Loading:FC = () => {
    return (
        <div
            css={css`
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            `}
        >
            <CircularProgress thickness={2}/>
        </div>
    )
}

export default Loading