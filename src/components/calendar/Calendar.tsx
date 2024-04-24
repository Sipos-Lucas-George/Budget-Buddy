import "./Calendar.css"
import {Button} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";

const Calendar = (data: { month: number, year: number, displayDay: Function }) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const firstDayOfMonth = new Date(data.year, data.month - 1, 1).getDay();
    const numberOfDays = new Date(data.year, data.month, 0).getDate();

    return (
        <ThemeProvider theme={theme}>
            <div className="days-of-week">
                {daysOfWeek.map(day => (
                    <div key={day} className="font-bold pb-3">{day}</div>
                ))}
            </div>
            <div className="calendar-grid">
                {Array.from({length: firstDayOfMonth - 1}).map((_, i) => (
                    <div key={`empty-${i}`}></div>
                ))}
                {Array.from({length: numberOfDays}).map((_, i) => {
                    const day = i + 1;
                    return (
                        <Button key={day} className="day font-normal" onClick={() => {
                            data.displayDay(day, data.month, data.year)
                        }}>
                            <div>
                                <div className="-my-2.5">{day}</div>
                                <div className="my-0.5">${"0.00"}</div>
                            </div>
                        </Button>
                    );
                })}
            </div>
        </ThemeProvider>
    );
};

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    "& .MuiTouchRipple-child": {
                        backgroundColor: "#00cf8d !important",
                    },
                    ":hover": {
                        background: "#00CF8D77",
                    },
                },
            },
        },
    },
});

export default Calendar;