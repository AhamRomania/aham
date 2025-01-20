"use client"

import styled from '@emotion/styled';

export const Flex = styled.div`display flex;`

export const Centred = styled(Flex)`
    @media only screen and (min-width : 1200px) {
        width: 1024px;
        margin: 0 auto;
    }
    display: flex;
`;

export const Space = styled.div`flex: 1;`
