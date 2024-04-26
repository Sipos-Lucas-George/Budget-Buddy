"use client";

import DatePicker from "@/components/DatePicker";
import {useRouter, useSearchParams} from "next/navigation";
import Calendar from "@/components/Calendar";
import DayOverlay from "@/components/DayOverlay";
import {Breadcrumbs} from "@mui/material";
import Button from "@mui/material/Button";
import {userSettings} from "@/utils/user_settings";
import {useSettingsContext} from "@/components/SettingsProvider";

export default function ExpensesMonthly() {
    useSettingsContext();
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

    return (
        <div>
            <Breadcrumbs style={{position: "absolute"}}>
                <Button disabled>Expenses</Button>
                <Button onClick={hideDay}>Monthly</Button>
                {day && <Button>Daily</Button>}
            </Breadcrumbs>
            {!day ? (
                <div>
                    <DatePicker month={month} year={year}/>
                    <div className="flex justify-center align-middle text-3xl pb-5">Total: {userSettings.currency}{"0.00"}</div>
                    <Calendar month={month} year={year} displayDay={displayDay}/>
                </div>
            ) : (
                <div className="p-5">
                    <DayOverlay day={day} month={month} year={year}/>
                </div>
            )}
        </div>
    );
};