"use client"

import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Flex = styled.div`display flex;`

const CentredStyle = p =>
    css`
        @media only screen and (min-width : 1200px) {
            width: 1024px;
            margin: 0 auto;
            padding: 0px;
        }
        display: flex;
        flex-direction: ${p.mode};
        padding: 20px;
    `

export const Centred = styled(Flex)`
    ${CentredStyle}
`;

export const Space = styled.div`flex: 1;`
