import { css } from "@emotion/react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Link from "next/link";
import { createContext, FC, useContext, useState } from "react";

interface MobileProps {
    mobile?: boolean;
}

export const MenuContext = createContext<boolean>(false);

export const Menu:FC<MobileProps&React.PropsWithChildren> = ({mobile = false, children}) => {
    return (
        <div
            css={css`
                display: flex;
                flex-direction: column;
            `}
        >
            <MenuContext.Provider value={mobile}>
                {children}
            </MenuContext.Provider>
        </div>
    )
}

interface MenuItemProps {
    icon?: React.ReactNode;
    title: string;
    href?: string;
    count?:number;
}

export const MenuItem:FC<MenuItemProps & React.PropsWithChildren> = ({icon, count = 0, title, href, children}) => {

    const [open, setOpen] = useState(false);
    const [showIconOnly,] = useState(useContext(MenuContext));

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
                    {!showIconOnly && <span style={{flex: '1'}}>{title}</span>}
                    {children && !open && <span><KeyboardArrowDown/></span>}
                    {children && open && <span><KeyboardArrowUp/></span>}
                    {count > 0 && <div>{count}</div>}
                </div>
            </Link>
            {open && children && <div className="children">{children}</div>}
        </div>
    )
}