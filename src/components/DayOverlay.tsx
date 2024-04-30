"use client";

import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import CrudGrid from "@/components/CrudGrid";
import {userSettings} from "@/utils/user_settings";
import {EnumType, EnumPayment} from "@prisma/client";
import {CATEGORY_TYPE} from "@/utils/constants";
import {format} from "date-fns";

type DayOverlayProps = {
    day: number;
    month: number;
    year: number;
}

type DataProps = {
    id: string;
    description: string;
    payment: EnumPayment;
    type: EnumType;
    category: CATEGORY_TYPE;
    amount: number;
}

type StateProps = {
    loading: boolean;
    error: boolean;
}

let lastFetchTimestamp = 0;
const fetchInterval = 1000;

const DayOverlay = ({day, month, year}: DayOverlayProps) => {
    const {data: session} = useSession();
    const [state, setState] = useState<StateProps>({
        loading: true,
        error: false
    });
    const [dataRows, setDataRows] = useState<DataProps[]>([]);
    const date = new Date(year, month - 1, day);
    const formattedDate = new Date(format(date, 'yyyy-MM-dd'));

    useEffect(() => {
        const fetchDailyExpenses = async () => {
            const currentTimestamp = new Date().getTime();
            if (currentTimestamp - lastFetchTimestamp > fetchInterval) {
                lastFetchTimestamp = currentTimestamp;
                // setState((prev) => ({...prev, loading: true}));
                await fetch(`/api/daily_expenses/${session?.user?.id}`, {
                    method: "POST",
                    body: JSON.stringify({date: formattedDate})
                })
                    .then(response => response.json())
                    .then(response => {
                        setState((prev) => ({...prev, loading: false}));
                        setDataRows(response.map((item: any) => ({
                            ...item,
                            amount: item.amount as number,
                        })));
                    })
                    .catch((error) => {
                        setState((prev) => ({loading: false, error: true}));
                        console.log(error);
                    });
            }
        }
        fetchDailyExpenses().then();
    }, []);

    if (state.loading || state.error)
        return (
            <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)"}}>
                {state.loading && <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>Loading...</span>}
                {state.error && <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>ERROR</span>}
            </div>
        )

    return (
        <div style={{marginTop: 10}}>
            <div className="pb-3 font-semibold text-xl flex justify-center">
                {day + ' ' + date.toLocaleString('default', {month: 'long'}) + ' ' + year}
            </div>
            <div className="flex justify-center align-middle text-2xl pb-2">
                <label id="today-expenses">Overall expenses:&nbsp;</label>
                <span>{userSettings.currency}{(dataRows.reduce((acc, row) => acc + row.amount, 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-center">
                <CrudGrid rows={dataRows} setRows={setDataRows} date={formattedDate}/>
            </div>
        </div>
    )
};

export default DayOverlay;