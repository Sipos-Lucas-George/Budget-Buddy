"use client";

import DatePicker from "@/components/DatePicker";
import {useRouter, useSearchParams} from "next/navigation";
import Calendar from "@/components/calendar/Calendar";
import DayOverlay from "@/components/day_overlay/DayOverlay";
import {useEffect, useState} from "react";

export default function ExpensesMonthly() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams).toString();

    const [currentDay, setCurrentDay] = useState(0);
    let [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    let [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    function isValidDay(day: string) {
        const parsedDay = parseInt(day);
        return !isNaN(parsedDay) && new Date(currentYear, currentMonth - 1, parsedDay).getDate() === parsedDay;
    }

    function isValidMonth(month: string) {
        const parsedMonth = parseInt(month);
        return !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12;
    }

    function isValidYear(year: string) {
        const parsedYear = parseInt(year);
        return !isNaN(parsedYear) && parsedYear <= currentYear && parsedYear > currentYear - 10;
    }

    console.log("RELOAD PAGE");

    const displayDay = (day: number, month: number, year: number) => {
        const sp = new URLSearchParams(searchParams);
        sp.set("day", day.toString());
        sp.set("month", month.toString());
        sp.set("year", year.toString());
        router.push(`/expenses?${sp.toString()}`);
        setCurrentDay(day);
    }

    const hideDay = () => {
        const sp = new URLSearchParams(searchParams);
        sp.delete("day");
        setCurrentDay(0);
        router.push(`/expenses?${sp.toString()}`);
    }

    useEffect(() => {
        let searchDay = searchParams.get("day");
        let searchMonth = searchParams.get("month");
        let searchYear = searchParams.get("year");
        let isCorrect = true;
        let dayExists = true;
        isCorrect = searchMonth && isValidMonth(searchMonth) ? (setCurrentMonth(parseInt(searchMonth)), isCorrect) : false;
        isCorrect = searchYear && isValidYear(searchYear) ? (setCurrentYear(parseInt(searchYear)), isCorrect) : false;
        dayExists = searchDay && isValidDay(searchDay) ? (setCurrentDay(parseInt(searchDay)), dayExists) : (setCurrentDay(0), false);


        if (!isCorrect || !dayExists) {
            const sp = new URLSearchParams(searchParams);
            if (!dayExists) {
                sp.delete("day");
            }
            if (!isCorrect) {
                sp.set("month", currentMonth.toString());
                sp.set("year", currentYear.toString());
            }
            router.replace(`/expenses?${sp.toString()}`);
        }
    }, [params]);

    return (
        <>
            <DatePicker month={currentMonth} year={currentYear}/>
            <div className="flex justify-center align-middle text-3xl pb-5">Total: ${"0.00"}</div>
            <Calendar month={currentMonth} year={currentYear} displayDay={displayDay}/>
            {currentDay !== 0 && (
                <DayOverlay day={currentDay} month={currentMonth} year={currentYear} hideDay={hideDay}/>
            )}
        </>
    );
}