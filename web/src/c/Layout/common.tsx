"use client"

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, PropsWithChildren, ReactElement } from 'react';

export const Flex = styled.div`display flex;`

export interface CentredStyleProps {
    mode?: string
    width?: number
    padding?: number;
}

export const Centred: FC<CentredStyleProps&PropsWithChildren> = ({children, width, mode, padding, ...props}) => {
    return (
        <div
            css={css`
                margin-bottom: 20px;
            `}
        >
            <div
                data-test="centred"
                {...props}
                css={css`
                    @media only screen and (min-width : 1200px) {
                        width: ${width ? width : 1024}px;
                        margin: 0 auto;
                        padding: 0px;  
                    }
                    height: 100%;
                    display: flex;
                    flex-direction: ${mode ? mode : 'column'};
                    padding: 20px ${typeof(padding) === 'number' ? padding + 'px' : '20px'};
                `}
            >
                {children}
            </div>
        </div>
    )
}
export const Space = styled.div`flex: 1;`

export interface PageNameProps {
    right?: ReactElement
}

export const PageName: FC<PageNameProps & PropsWithChildren> = ({children, right}) => {
    return (
        <div
            css={css`
                display: flex; 
                margin-top: 20px;
                padding-bottom: 20px;
                margin-bottom: 20px;
                border-bottom: 3px solid #1F70B8;       
            `}
        >
            <h1
                css={css`
                    font-size: 37px;
                `}
            >
                {children}
            </h1>
            <Space/>
            <div
                css={css`
                    display: flex;
                    align-items: center;
                    justify-content: center;    
                `}
            >
            {right}
            </div>
        </div>
    )
}