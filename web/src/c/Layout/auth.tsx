"use client"

import { css } from "@emotion/react";
import Image from "next/image";
import * as React from "react";

const AuthLayout = ({children}: React.PropsWithChildren) => {
    return (
        <div
            css={css`
                width: 100%;
                height: 100%;
                display: flex;
            `}
        >
            <div
                css={css`
                    background: var(--main-color);
                    width: 50%;
                    height: 100%;
                    color: #FFFFFF;
                    display: none;
                    flex-direction: column;
                    justify-content: center;
                    align-item: center;
                    padding: 0 50px;
                    display: none;

                    em {
                        text-transform: uppercase;
                        font-size: 12px;
                        font-style: inherit;
                    }

                    h1 {
                        font-size: 65px;
                        margin-top: 25px;
                    }

                    p {
                        font-size: 35px;
                        margin-top: 25px;
                    }
                    
                    .image {
                        mix-blend-mode: screen;
                        margin-top: 50px;
                    }

                    @media only screen and (min-width : 1200px) { 
                        display: flex;
                    }
                `}
            >
                <em>Bine ai venit</em>
                <h1>Bazarul tău</h1>
                <p>Începe explorarea în bazarul tău preferat unde găsești și cunoști o grămadă de lucruri.</p>
                <Image className="image" src="/objects.png" width={652.93} height={429} alt={"Objects"} />
            </div>
            <div
                css={css`
                    width:100%;
                    height: 100%;
                    overflow: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    @media only screen and (min-width : 1200px) { 
                        width: 50%;
                    }
                `}
            >
                {children}
            </div>
        </div>
    )
}

export default AuthLayout;