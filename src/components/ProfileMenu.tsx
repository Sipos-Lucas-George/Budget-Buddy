"use client";

import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Avatar, IconButton, Tooltip, Menu, MenuItem, ListItemIcon} from "@mui/material";
import {Logout, Settings} from "@mui/icons-material";
import {Session} from "next-auth";
import UserSettingsDialog from "@/components/UserSettingsDialog";
import Link from "next/link";
import {signIn, signOut} from "next-auth/react";

type ProfileMenuProps = {
    session: Session | null;
}

const ProfileMenu = ({session}: ProfileMenuProps) => {
    const [showUserSettings, setShowUserSettings] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const todayDate = new Date();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            {session ? (
                <>
                    <Link href={`/expenses?month=${todayDate.getMonth() + 1}&year=${todayDate.getFullYear()}`}
                          className="navbar-text-links">Expenses</Link>
                    <Link href={"/subscriptions"} className="navbar-text-links">Subscriptions</Link>
                    <Box className="pr-5">
                        <Tooltip title={session?.user?.email}>
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ml: 2}}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar
                                    src={session?.user?.image ?? "/assets/unknown.png"} alt={""}
                                    sx={{width: 40, height: 40}}/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        transformOrigin={{horizontal: 'right', vertical: 'top'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    >
                        <MenuItem onClick={() => {
                            handleClose();
                            setShowUserSettings(true);
                        }}>
                            <ListItemIcon>
                                <Settings style={{fill: "#00cf8d"}} fontSize="large"/>
                            </ListItemIcon>
                            <div style={{fontSize: 20, fontWeight: 500, paddingLeft: 15}}>
                                Settings
                            </div>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleClose();
                            signOut().then();
                        }}>
                            <ListItemIcon>
                                <Logout style={{fill: "#00cf8d"}} fontSize="large"/>
                            </ListItemIcon>
                            <div style={{fontSize: 20, fontWeight: 500, paddingLeft: 15}}>
                                Logout
                            </div>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <span key="google-auth" className='navbar-text-links'
                      onClick={() => {
                          signIn("google", {callbackUrl: `/expenses?month=${todayDate.getMonth() + 1}&year=${todayDate.getFullYear()}`}).then();
                      }}>
                    Sign in
                </span>
            )}
            {showUserSettings && <UserSettingsDialog setShowUserSettings={setShowUserSettings}/>}
        </>
    );
};

export default ProfileMenu;