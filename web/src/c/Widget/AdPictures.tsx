import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { CircularProgress } from "@mui/joy";
import { FC, useEffect, useRef, useState } from "react";
import getDomain, { Domain } from "../domain";
import { Ad } from "../types";

export interface GalleryProps {
    width: number
    ad: Ad;
}

const AdPictures: FC<GalleryProps> = ({width = 500, ad}) => {

    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [src, setSrc] = useState('');
    const imgRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (imgRef && imgRef.current) {
            setLoading(true);
            imgRef.current.addEventListener('load', () => {
                setLoading(false)
                if (containerRef.current) {
                    const img:HTMLImageElement = imgRef.current!;
                    const marging = -((img.naturalHeight-containerRef.current.offsetHeight) / 2);
                    img.setAttribute('style',`margin-top:${marging}px`);
                }
            });
        }
        setSrc(getDomain(Domain.Cdn) + `/` + ad.pictures[current] + `?w=`+(width));
    }, [imgRef, current]);

    return (
        <div
            data-test="gallery"
            ref={containerRef}
            css={css`
                width: ${width}px;
                background: #F0F0F0;
                position: relative;
                padding-bottom: 75%;
                border-radius: 8px;
                overflow: hidden;
            `}
        >
            <div
                css={css`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                `}
            >
                <div
                    css={css`
                        img {
                            
                        }
                    `}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                    <img
                        ref={imgRef}
                        src={src?src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='}
                        alt="Gallery Image"
                    />
                </div>
                {ad.pictures.length>1&&<Navigate
                    css={css`
                        top: 50%;
                        left: 20px;
                        transform: translateY(-50%);  
                    `}
                    onClick={() => (current > 0) && setCurrent(current-1)}
                >
                    <KeyboardArrowLeft/>
                </Navigate>}
                {ad.pictures.length>1&&<Navigate
                    css={css`
                        top: 50%;
                        right: 20px;
                        transform: translateY(-50%);  
                    `}
                    onClick={() => (current < ad.pictures.length-1) && setCurrent(current+1)}
                >
                    <KeyboardArrowRight/>
                </Navigate>}
                {ad.pictures.length>1&&<Info
                    css={css`
                        bottom: 20px;
                        left: 20px;
                    `}
                >
                    {loading && <CircularProgress determinate={false} size="sm"/>}
                    {!loading && `Poza ${current + 1} din ${ad.pictures.length}`}
                </Info>}
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

export default AdPictures;