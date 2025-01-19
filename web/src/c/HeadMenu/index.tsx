"use client";

import React, { FC } from 'react';
import styles from './style.module.css';
import { ListItemIcon, ListItemText, Menu, MenuItem, Button } from '@mui/material';
import { Sell, Forum, Favorite, ManageAccounts, Logout, Add } from '@mui/icons-material';
import UserAvatar from '../avatar';

interface HeadMenuProps {
    isLoggedIn?: boolean
};

const HeadMenu: FC<HeadMenuProps> = ({ isLoggedIn }) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!isLoggedIn) {
        return (
            <Button
                startIcon={<Add/>}
                variant="contained"
                color="secondary"
            >
                Anunț
            </Button>
        )
    }

    return (
        <div className={styles.headMenu}>
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

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Sell fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Anunțuri</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Forum fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Mesaje</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Favorite fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Favorite</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <ManageAccounts fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cont</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
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