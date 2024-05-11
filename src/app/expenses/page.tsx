"use client";

import DatePicker from "@/components/DatePicker";
import {useRouter, useSearchParams} from "next/navigation";
import Calendar from "@/components/Calendar";
import DayOverlay from "@/components/DayOverlay";
import {Breadcrumbs} from "@mui/material";
import Button from "@mui/material/Button";
import {userSettings} from "@/utils/user_settings";
import {useSettingsContext} from "@/components/SettingsProvider";
import {format} from "date-fns";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import StatisticsMonthly from "@/components/StatisticsMonthly";

type StateProps = {
    loading: boolean;
    error: boolean;
}

export default function ExpensesMonthly() {
    useSettingsContext();
    const {data: session} = useSession();
    const [state, setState] = useState<StateProps>({
        loading: true,
        error: false
    });
    const [groupByDay, setGroupByDay] = useState<number[]>([]);
    const [statistics, setStatistics] = useState<any[]>([]);
    const [toggleStatistics, setToggleStatistics] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchParamDay = searchParams.get("day");
    const searchParamMonth = searchParams.get("month");
    const searchParamYear = searchParams.get("year");
    let day: number | null = null;
    let month = 0;
    let year = 0;


    if (!searchParamMonth || !searchParamYear || !isValidMonth(searchParamMonth) || !isValidYear(searchParamYear) || (searchParamDay && !isValidDay(searchParamDay))) {
        router.back();
    } else {
        month = parseInt(searchParamMonth);
        year = parseInt(searchParamYear);
    }
    if (searchParamDay) {
        day = parseInt(searchParamDay);
    }

    const startMonthFormatted = new Date(format(new Date(year, month - 1, 1), 'yyyy-MM-dd'));
    const endMonthFormatted = new Date(format(new Date(year, month, 0), 'yyyy-MM-dd'));

    useEffect(() => {
        const fetchMonthlyExpenses = async () => {
            setState((prev) => ({...prev, loading: true}));
            await fetch(`/api/monthly_expenses/${session?.user?.id}`, {
                method: "POST",
                body: JSON.stringify({start_month: startMonthFormatted, end_month: endMonthFormatted})
            })
                .then(response => response.json())
                .then(response => {
                    setGroupByDay(response.cleanDay);
                    setStatistics([response.cleanType, response.cleanPayment, response.cleanCategory]);
                    setState((prev) => ({...prev, loading: false}));
                })
                .catch((error) => {
                    setState((_prev) => ({loading: false, error: true}));
                    console.log(error);
                });
        }
        fetchMonthlyExpenses().then();
    }, [month, year, day]);

    function isValidDay(day: string) {
        const parsedDay = parseInt(day);
        return !isNaN(parsedDay) && new Date(year, month - 1, parsedDay).getDate() === parsedDay;
    }

    function isValidMonth(month: string) {
        const parsedMonth = parseInt(month);
        return !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12;
    }

    function isValidYear(year: string) {
        const parsedYear = parseInt(year);
        const current = new Date().getFullYear();
        return !isNaN(parsedYear) && parsedYear <= current && parsedYear > current - 10;
    }

    const displayDay = (day: number, month: number, year: number) => {
        const sp = new URLSearchParams(searchParams);
        sp.set("day", day.toString());
        sp.set("month", month.toString());
        sp.set("year", year.toString());
        router.push(`/expenses?${sp.toString()}`);
    }

    const hideDay = () => {
        if (day) {
            const sp = new URLSearchParams(searchParams);
            sp.delete("day");
            router.push(`/expenses?${sp.toString()}`);
        }
    }

    if (state.loading || state.error)
        return (
            <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)"}}>
                {state.loading && <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>Loading...</span>}
                {state.error && <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>ERROR</span>}
            </div>
        )
    const totalMonth = (groupByDay.reduce((acc, value) => acc + value, 0));
    return (
        <div className="h-full">
            <Breadcrumbs style={{position: "absolute"}}>
                <Button disabled>Expenses</Button>
                <Button disabled={toggleStatistics || !day} onClick={hideDay}>Monthly</Button>
                {!day && <Button onClick={() => setToggleStatistics(prev => !prev)}>Statistics</Button>}
                {day && <Button disabled>Daily</Button>}
            </Breadcrumbs>
            {!day ? (
                !toggleStatistics ? (
                    <div>
                        <DatePicker month={month} year={year}/>
                        <div className={`flex justify-center align-middle text-3xl pb-5 
                        ${(totalMonth > userSettings.income / 12) ? "text-red-600" : ""}`}>
                            Total: {userSettings.currency}{totalMonth.toFixed(2)}
                        </div>
                        <Calendar data={groupByDay} month={month} year={year} displayDay={displayDay}/>
                    </div>
                ) : (
                    <StatisticsMonthly statistics={statistics}/>
                )
            ) : (
                <div className="p-5">
                    <DayOverlay day={day} month={month} year={year} numberOfDays={groupByDay.length}/>
                </div>
            )}
        </div>
    )
        ;
};