"use client";

import React, { FC } from 'react';
import styles from './style.module.css';
import { ListItemIcon, ListItemText, Menu, MenuItem, Button } from '@mui/material';
import { Sell, Forum, Favorite, ManageAccounts, Logout, Add } from '@mui/icons-material';
import UserAvatar from '../avatar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookie from 'js-cookie';
import Tip from '../tooltip';
import { ACCESS_TOKEN_COOKIE_NAME } from '../Auth';

interface HeadMenuProps {
    isLoggedIn?: boolean
};

const HeadMenu: FC<HeadMenuProps> = ({ isLoggedIn }) => {

    const router = useRouter()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        Cookie.remove(
            ACCESS_TOKEN_COOKIE_NAME,
            {
                //sameSite: 'strict',
                //secure: true,
                //domain: 'aham.ro'
            }
        );
        window.location.reload()
    }

    const navigate = (to: string) => {
        setAnchorEl(null);
        router.push(to);
    }

    if (!isLoggedIn) {
        return (
            <Link href="/anunt">
                <Button
                    startIcon={<Add/>}
                    variant="contained"
                    color="secondary"
                >
                    Adaugă Anunț
                </Button>
            </Link>
        )
    }

    return (
        <div className={styles.headMenu}>

            <Tip title='Deschide meniul'>
                <button
                    onClick={handleClick}
                    className={styles.headMenuButtonMore}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width={11} height={7}>
                        <path
                            fill="#E8EAED"
                            fillRule="nonzero"
                            d="M5.5 7 0 1.706 1.772 0 5.5 3.588 9.228 0 11 1.706z"
                        />
                    </svg>
                    
                    <UserAvatar/>
                </button>
            </Tip>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => navigate('/u/anunturi/creaza')}>
                    <ListItemIcon>
                        <Add fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Anunț</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => navigate('/u/anunturi')}>
                    <ListItemIcon>
                        <Sell fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Anunțuri</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => navigate('/u/mesaje')}>
                    <ListItemIcon>
                        <Forum fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Mesaje</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => navigate('/u/favorite')}>
                    <ListItemIcon>
                        <Favorite fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Favorite</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => navigate('/u/cont')}>
                    <ListItemIcon>
                        <ManageAccounts fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cont</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => logout()}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ieșire</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    )
}

export default HeadMenu