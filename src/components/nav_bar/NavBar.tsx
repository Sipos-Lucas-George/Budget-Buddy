"use client";

import Image from "next/image"
import React, {useEffect, useState} from "react";
import './NavBar.css';
import Link from "next/link";
import {signIn, signOut, getProviders, LiteralUnion, ClientSafeProvider, useSession} from "next-auth/react";
import {BuiltInProviderType} from "next-auth/providers/index";
import {Box} from "@mui/system";
import {IconButton, ListItemIcon, Tooltip, Menu, MenuItem, Avatar} from "@mui/material";
import {Logout, Settings} from "@mui/icons-material";
import UserSettingsDialog from "@/components/UserSettingsDialog";

const Navbar = () => {
    const {data: session, status} = useSession();
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider> | null>(null);
    const [showUserSettings, setShowUserSettings] = useState(false);
    const todayDate = new Date();

    useEffect(() => {
        (async () => {
            const res = await getProviders();
            setProviders(res);
        })();
    }, []);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <nav className="navbar w-full">
                <Link href="/">
                    <Image src="/assets/logo.png" alt={"Budget Buddy"} width={100} height={100} priority={true}/>
                </Link>
                <div className="links">
                    {status !== "loading" &&
                        (<>{session?.user ? (
                            <>
                                <Link
                                    href={`/expenses?month=${todayDate.getMonth() + 1}&year=${todayDate.getFullYear()}`}
                                    className="navbar-text-links">Expenses</Link>
                                <Link href={"/subscriptions"} className="navbar-text-links">Subscriptions</Link>
                                <div style={{paddingRight: 20}}>
                                    <Box>
                                        <Tooltip title={session.user.email}>
                                            <IconButton
                                                onClick={handleClick}
                                                size="small"
                                                sx={{ml: 2}}
                                                aria-controls={open ? 'account-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                            >
                                                <Avatar
                                                    src={session.user.image ?? "/assets/unknown.png"} alt={""}
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
                                            signOut({callbackUrl: "/"}).then();
                                        }}>
                                            <ListItemIcon>
                                                <Logout style={{fill: "#00cf8d"}} fontSize="large"/>
                                            </ListItemIcon>
                                            <div style={{fontSize: 20, fontWeight: 500, paddingLeft: 15}}>
                                                Logout
                                            </div>
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </>
                        ) : (
                            <>
                                {providers &&
                                    Object.values(providers).map((provider) => (
                                        <span
                                            key={provider.name}
                                            onClick={() => {
                                                signIn(provider.id, {callbackUrl: `/expenses?month=${todayDate.getMonth() + 1}&year=${todayDate.getFullYear()}`}).then();

                                            }}
                                            className='navbar-text-links'
                                        >
                                    Sign in
                                </span>
                                    ))}
                            </>
                        )}</>)
                    }
                </div>
            </nav>
            {showUserSettings && <UserSettingsDialog setShowUserSettings={setShowUserSettings}/>}
        </div>
    );
};

export default Navbar;