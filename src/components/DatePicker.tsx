"use client";

import Select from "@mui/material/Select";
import {MenuItem, FormControl, InputLabel, ThemeProvider, outlinedInputClasses} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import {usePathname, useSearchParams, useRouter} from "next/navigation";

const DatePicker = (data: { month: number, year: number }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const year = new Date().getFullYear();
    const years = Array.from({length: 10}, (_, i) => year - i);
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
        <ThemeProvider theme={theme}>
            <div className="text-3xl flex justify-center items-center pb-1 pt-5">
                <FormControl sx={{m: 1, minWidth: 80}}>
                    <InputLabel id="select-month-label"
                                style={{fontFamily: "inherit", fontWeight: 700}}>Month</InputLabel>
                    <Select
                        labelId="select-month-label"
                        id="select-month-label"
                        value={months[data.month - 1]}
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
                <FormControl sx={{m: 1, minWidth: 80}}>
                    <InputLabel id="select-year-label" style={{fontFamily: "inherit"}}>Year</InputLabel>
                    <Select
                        labelId="select-year-label"
                        id="select-year-label"
                        value={data.year}
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
        </ThemeProvider>
    );
};

const theme = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: '#00cf8d',
                    },
                    [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: '#00cf8d',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontFamily: "inherit",
                    fontWeight: 700,
                    '&.Mui-focused': {
                        color: '#00cf8d'
                    }
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    fontFamily: "inherit",
                    fontWeight: 600,
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontFamily: "inherit",
                    fontWeight: 600,
                    '&.Mui-selected': {
                        background: "#00cf8d55 !important"
                    },
                    ':focus': {
                        background: "#00cf8d77 !important"
                    },
                    ':focus:hover': {
                        background: "#00cf8d99 !important"
                    },
                    ':hover': {
                        background: "#00cf8d44 !important"
                    },
                    "& .MuiTouchRipple-child": {
                        backgroundColor: "#00cf8d",
                    },
                },
            },
        },
    },
});


export default DatePicker;