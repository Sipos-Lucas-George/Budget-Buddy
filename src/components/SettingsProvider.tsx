"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';
import {userSettings} from "@/utils/user_settings";
import {useSession} from "next-auth/react";
import UserSettingsDialog from "@/components/UserSettingsDialog";

const SettingsContext = createContext<any>(null);
let lastFetchTimestamp = 0;
const fetchInterval = 1000;

export function SettingsProvider({children}: { children: React.ReactNode }) {
    let [state, setState] = useState({...userSettings});
    const {data: session, status} = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserSettings = async () => {
            const currentTimestamp = new Date().getTime();
            if (currentTimestamp - lastFetchTimestamp > fetchInterval) {
                lastFetchTimestamp = currentTimestamp;
                await fetch(`/api/user_settings/${session?.user?.id}`)
                    .then(response => response.json())
                    .then((result) => {
                        userSettings.setAllOne(result);
                        setState(result)
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error fetching user settings:', error)
                    });
            }
        };
        if (session){
            fetchUserSettings().then();
        }
    }, [session]);

    const [, setRefresh] = useState(true);
    const handleRefresh = (_: boolean) => {
        setRefresh((prev) => !prev);
    }

    return (
        <SettingsContext.Provider value={{state, setState}}>
            {status === "unauthenticated" || (session && state.income !== 0) ? (
                <>{children}</>
            ) : status === "loading" || loading ? (
                <div className="flex-1 flex justify-center items-center flex-col">
                    <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>Loading...</span>
                </div>
            ) : (
                <UserSettingsDialog setShowUserSettings={handleRefresh} showExitButton={false}/>
            )}
        </SettingsContext.Provider>
    );
}

export function useSettingsContext() {
    return useContext(SettingsContext);
}