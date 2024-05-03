"use client";

import React, {useEffect, useState} from "react";
import CrudGridSubscription from "@/components/CrudGridSubscription";
import {EnumSubscriptionType} from "@prisma/client";
import {userSettings} from "@/utils/user_settings";
import {useSession} from "next-auth/react";

type Subscription = {
    id: string;
    name: string;
    renews: Date;
    type: EnumSubscriptionType;
    amount: number;
}

type StateProps = {
    loading: boolean;
    error: boolean;
}

export default function Subscriptions() {
    const {data: session} = useSession();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [state, setState] = useState<StateProps>({
        loading: true,
        error: false
    });

    useEffect(() => {
        const fetchSubscription = async () => {
            setState((prev) => ({...prev, loading: true}));
            await fetch(`/api/subscriptions/${session?.user?.id}`, {
                method: "GET",
            })
                .then(response => response.json())
                .then(response => {
                    setState((prev) => ({...prev, loading: false}));
                    setSubscriptions(response);
                })
                .catch((error) => {
                    setState((_prev) => ({loading: false, error: true}));
                    console.log(error);
                });
        }
        fetchSubscription().then();
    }, []);

    if (state.loading || state.error)
        return (
            <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)"}}>
                {state.loading && <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>Loading...</span>}
                {state.error && <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>ERROR</span>}
            </div>
        )

    return (
        <div>
            <div className="flex justify-center align-middle text-2xl py-5">
                <label id="today-expenses">Overall expenses:&nbsp;</label>
                <span>{userSettings.currency}{(subscriptions.reduce((acc, row) => acc + row.amount, 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-center">
                <CrudGridSubscription rows={subscriptions} setRows={setSubscriptions}/>
            </div>
        </div>
    );
}