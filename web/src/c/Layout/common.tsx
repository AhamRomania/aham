"use client"

import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Flex = styled.div`display flex;`

export interface CentredStyleProps {
    mode?: string
}

const CentredStyle = ({mode}:CentredStyleProps) =>
    css`
        @media only screen and (min-width : 1200px) {
            width: 1024px;
            margin: 0 auto;
            padding: 0px;
        }
        display: flex;
        flex-direction: ${mode ? mode : 'column'};
        padding: 20px;
    `

export const Centred = styled(Flex)`
    ${CentredStyle}
`;

export const Space = styled.div`flex: 1;`
