"use client"

import styled from '@emotion/styled';

export const Flex = styled.div`display flex;`

export const Centred = styled(Flex)`
    @media only screen and (min-width : 1200px) {
        width: 1024px;
        margin: 0 auto;
        padding: 0px;
    }
    display: flex;
    padding: 20px;
`;

export const Space = styled.div`flex: 1;`
