"use client"

import { css } from "@emotion/react";
import Image from "next/image";
import { FC } from "react";
import { Ad as Vo } from "../types";
import Link from "next/link";

export interface AdProps {
    vo: Vo;
    width: number;
    height: number;
}

const Ad: FC<AdProps> = ({width,height,vo}:AdProps) => {
    return (
        <Link
            href={vo.title}
            css={css(`
                display: inline-block;
                width: ${width}px;
                height: ${height}px;
                text-decoration: none;
                &:hover article {
                    background:rgb(230, 230, 230);
                }
            `)}
        >
            <article
                css={css(`
                    background: #F0F0F0;
                    overflow: hidden;
                    border-radius: 10px;
                    width: ${width}px;
                    height: ${height}px;
                    position: relative;
                `)}
            >
                <div
                    css={css(`
                        width: 312px;
                        height: 242px;
                    `)}
                >
                    <Image src="/test.png" width={312} height={242} alt="Ad"/>
                </div>
                
                <div
                    css={css`
                        padding: 10px 20px 20px 20px;
                    `}
                >
                    <div
                        css={css`
                            font-weight: bold;
                            padding-bottom: 10px;
                        `}
                    >
                        {vo.title}
                    </div>
                    <div
                        css={css`
                            font-size:15px;
                            display: flex;
                            margin-top:5px;
                        `}
                    >
                        <svg css={css`margin-right: 5px;`} xmlns="http://www.w3.org/2000/svg" width={16} height={20}>
                            <path
                            fill="#000"
                            fillRule="nonzero"
                            d="M8 10c.55 0 1.02-.196 1.412-.588C9.804 9.021 10 8.55 10 8c0-.55-.196-1.02-.588-1.412A1.926 1.926 0 0 0 8 6c-.55 0-1.02.196-1.412.588A1.926 1.926 0 0 0 6 8c0 .55.196 1.02.588 1.412C6.979 9.804 7.45 10 8 10Zm0 7.35c2.033-1.867 3.542-3.563 4.525-5.088C13.508 10.738 14 9.383 14 8.2c0-1.817-.58-3.304-1.738-4.462C11.104 2.579 9.683 2 8 2c-1.683 0-3.104.58-4.263 1.737C2.58 4.896 2 6.383 2 8.2c0 1.183.492 2.538 1.475 4.063.983 1.524 2.492 3.22 4.525 5.087ZM8 20c-2.683-2.283-4.688-4.404-6.013-6.363C.662 11.68 0 9.867 0 8.2c0-2.5.804-4.492 2.413-5.975C4.02.742 5.883 0 8 0c2.117 0 3.98.742 5.588 2.225S16 5.7 16 8.2c0 1.667-.662 3.48-1.988 5.438C12.688 15.595 10.683 17.716 8 20Z"
                            />
                        </svg>
                        <span>{vo.loc}</span>
                    </div>
                    <div
                        css={css`
                            font-size:15px;
                            display: flex;
                            margin-top:5px;
                        `}
                    >
                        <svg css={css`margin-right: 5px;`} xmlns="http://www.w3.org/2000/svg" width={18} height={18}>
                            <path
                            fill="#000"
                            fillRule="nonzero"
                            d="M9 18c-2.3 0-4.304-.762-6.013-2.288C1.28 14.188.3 12.283.05 10H2.1c.233 1.733 1.004 3.167 2.312 4.3C5.721 15.433 7.25 16 9 16c1.95 0 3.604-.68 4.963-2.037C15.32 12.604 16 10.95 16 9c0-1.95-.68-3.604-2.037-4.963C12.604 2.68 10.95 2 9 2a6.75 6.75 0 0 0-3.225.8A7.431 7.431 0 0 0 3.25 5H6v2H0V1h2v2.35A8.732 8.732 0 0 1 5.112.875 8.93 8.93 0 0 1 9 0c1.25 0 2.42.238 3.512.712a9.148 9.148 0 0 1 2.85 1.926 9.148 9.148 0 0 1 1.926 2.85A8.707 8.707 0 0 1 18 9c0 1.25-.238 2.42-.712 3.512a9.148 9.148 0 0 1-1.925 2.85 9.148 9.148 0 0 1-2.85 1.926A8.707 8.707 0 0 1 9 18Zm2.8-4.8L8 9.4V4h2v4.6l3.2 3.2-1.4 1.4Z"
                            />
                        </svg>
                        {vo.ago}
                    </div>
                </div>
                <div
                    css={css`
                        font-size: 24px;
                        font-weight: bold;
                        position: absolute;
                        right: 20px;
                        bottom: 20px;
                    `}
                >{vo.price}</div>
            </article>
        </Link>
    )
}

export default Ad