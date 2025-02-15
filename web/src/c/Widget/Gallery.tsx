import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { CircularProgress } from "@mui/joy";
import { FC, useEffect, useRef, useState } from "react";
import getDomain, { Domain } from "../domain";

export interface GalleryProps {
    pictures: string[];
}

const Gallery: FC<GalleryProps> = ({pictures}) => {

    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [src, setSrc] = useState('');
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (src === '') {
            if (imgRef && imgRef.current) {
                setLoading(true);
                imgRef.current.addEventListener('load', () => {
                    setLoading(false)
                });
            }
            setSrc(getDomain(Domain.Cdn) + `/` + pictures[current] + `?w=700`);
        }
    }, [imgRef, current]);

    return (
        <div
            data-test="gallery"
            css={css`
                background: #F0F0F0;
                position: relative;
                width: 100%;
                padding-bottom: 75%;
                border-radius: 8px;
            `}
        >
            <div
                css={css`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                `}
            >
                <div
                    css={css`
                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover; /* Ensures the image covers the container */
                            border-radius: 8px;
                        }
                    `}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                    {(src !== '') && <img
                        ref={imgRef}
                        src={src}
                        alt="Gallery Image"
                    />}
                </div>
                <Navigate
                    css={css`
                        top: 50%;
                        left: 20px;
                        transform: translateY(-50%);  
                    `}
                    onClick={() => (current > 0) && setCurrent(current-1)}
                >
                    <KeyboardArrowLeft/>
                </Navigate>
                <Navigate
                    css={css`
                        top: 50%;
                        right: 20px;
                        transform: translateY(-50%);  
                    `}
                    onClick={() => (current < pictures.length-1) && setCurrent(current+1)}
                >
                    <KeyboardArrowRight/>
                </Navigate>
                <Info
                    css={css`
                        bottom: 20px;
                        left: 20px;
                    `}
                >
                    {loading && <CircularProgress determinate={false} size="sm"/>}
                    {!loading && `Poza ${current + 1} din ${pictures.length}`}
                </Info>
            </div>
        </div>
    )
}

const Interaction = styled.div`
    width: 42px;
    height: 42px;
    color: #fff;
    user-select: none;
    cursor: pointer;
    position: absolute;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        background: rgba(0,0,0,0.37);
    }
    svg {
        color: #FFF;
    }
`;

const Navigate = styled(Interaction)`
    width: 42px;
    height: 130px;
`;

const Info = styled(Interaction)`
    min-width: 42px;
    width: auto;
    padding: 0 10px;
    font-size: 14px;
    cursor: default;
    &:hover {
        background: rgba(0,0,0,0.2);
    }
`;

export default Gallery;