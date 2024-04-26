"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';
import {userSettings} from "@/utils/user_settings";
import {useSession} from "next-auth/react";
import UserSettingsDialog from "@/components/UserSettingsDialog";

const SettingsContext = createContext<any>(null);

export function SettingsProvider({children}: { children: React.ReactNode }) {
    let [state, setState] = useState({...userSettings});
    const {data: session, status} = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserSettings = async () => {
            const _session: any = session;
            await fetch(`/api/user_settings/${_session?.user?.id}`)
                .then((response) => {
                    if (response.ok) return response.json();
                    throw new Error(response.statusText);
                })
                .then((result) => {
                    setState(result)
                    userSettings.setAll(result);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error)
                });
        };
        if (status === "authenticated")
            fetchUserSettings().then();
    }, [status]);

    const [, setRefresh] = useState(true);
    const handleRefresh = (_: boolean) => {
        setRefresh((prev) => !prev);
    }

    return (
        <SettingsContext.Provider value={{state, setState}}>
            {status === "unauthenticated" || (status === "authenticated" && state.income !== 0) ? (
                <>{children}</>
            ) : status === "loading" || loading ? (
                <div className="flex-1 flex justify-center items-center flex-col">
                    <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>&nbsp;Loading...&nbsp;</span>
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