"use client";

import Select from "@mui/material/Select";
import {MenuItem, FormControl, InputLabel} from "@mui/material";
import {usePathname, useSearchParams, useRouter} from "next/navigation";

type DataPickerProps = {
    month: number; 
    year: number;
}

const DatePicker = ({ month, year }: DataPickerProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const nowYear = new Date().getFullYear();
    const years = Array.from({length: 10}, (_, i) => nowYear - i);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handleYearChange = (e: any) => {
        const newYear = parseInt(e.target.value, 10);
        const sp = new URLSearchParams(searchParams);
        sp.set("year", newYear.toString());
        router.push(`${pathname}?${sp.toString()}`);
    };

    const handleMonthChange = (e: any) => {
        const newMonth = months.indexOf(e.target.value) + 1;
        const sp = new URLSearchParams(searchParams);
        sp.set("month", newMonth.toString());
        router.push(`${pathname}?${sp.toString()}`);
    };

    return (
        <div>
            <div className="text-3xl flex justify-center items-center pb-1 pt-5">
                <FormControl id="form-control-month" sx={{m: 1, minWidth: 80}}>
                    <InputLabel id="select-month-label"
                                style={{fontFamily: "inherit", fontWeight: 700}}>Month</InputLabel>
                    <Select
                        labelId="select-month-label"
                        id="select-month-label"
                        value={months[month - 1]}
                        onChange={handleMonthChange}
                        label="Month"
                        style={{fontFamily: "inherit"}}
                    >
                        {months.map((month, index) => (
                            <MenuItem style={{fontFamily: "inherit"}} key={index}
                                      value={month}>{month}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl id="form-control-year" sx={{m: 1, minWidth: 80}}>
                    <InputLabel id="select-year-label" style={{fontFamily: "inherit"}}>Year</InputLabel>
                    <Select
                        labelId="select-year-label"
                        id="select-year-label"
                        value={year}
                        onChange={handleYearChange}
                        label="Year"
                        style={{fontFamily: "inherit"}}
                    >
                        {years.map((year, index) => (
                            <MenuItem style={{fontFamily: "inherit"}} key={index}
                                      value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};


export default DatePicker;