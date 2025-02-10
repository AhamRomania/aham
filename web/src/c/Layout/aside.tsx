import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Link from "next/link";
import { FC, useState } from "react";

export const Menu = styled.div`
    display: flex;
    flex-direction: column;
`;

interface MenuItemProps {
    icon?: React.ReactNode;
    title: string;
    href?: string;
}

export const MenuItem:FC<MenuItemProps & React.PropsWithChildren> = ({icon, title, href, children}) => {

    const [open, setOpen] = useState(false);

    const handle = (e: MouseEvent) => {
        if (children) {
            e.preventDefault();
            setOpen(!open);
        }
    }

    return (
        <div
            css={css`
                a {
                    text-decoration: none;
                    color: #fff;
                }    
                .item {
                    font-size: 16px;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin: 5px 10px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    &:hover {
                        background: rgba(255, 255, 255, 0.1);
                    } 
                    .icon {
                        margin-right: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
                .children {
                    .item {
                        padding-left: 40px;
                    }
                }
            `}
        >   
            <Link href={href!}>
                <div className="item" onClick={(e) => handle(e as unknown as MouseEvent)}>
                    <div className="icon">{icon && icon}</div>
                    <span style={{flex: '1'}}>{title}</span>
                    {children && !open && <span><KeyboardArrowDown/></span>}
                    {children && open && <span><KeyboardArrowUp/></span>}
                </div>
            </Link>
            {open && children && <div className="children">{children}</div>}
        </div>
    )
}