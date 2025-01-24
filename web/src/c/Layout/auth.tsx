"use client"

import { css } from "@emotion/react";
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
                    em {
                        text-transform: uppercase;
                    }    
                `}
            >
                <em>Bine ai venit</em>
                <h1>Bazarul tău</h1>
                <p>Începe explorarea în bazarul tău preferat unde găsești și cunoști o grămadă de lucruri.</p>
            </div>
            <div
                css={css`
                    width: 50%;
                    height: 100%;
                `}
            >
                {children}
            </div>
        </div>
    )
}

export default AuthLayout;