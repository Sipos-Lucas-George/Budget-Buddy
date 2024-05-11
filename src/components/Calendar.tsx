import {Button} from "@mui/material";
import {userSettings} from "@/utils/user_settings";

type CalendarProps = {
    data: Array<number>;
    month: number;
    year: number;
    displayDay: Function;
}

const Calendar = ({data, month, year, displayDay}: CalendarProps) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const totalDay = userSettings.income / 12 / data.length;

    return (
        <div>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "auto", textAlign: "center",
                padding: "0 100px"
            }}>
                {daysOfWeek.map(day => (
                    <div key={day} className="font-bold pb-3">{day}</div>
                ))}
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "auto", textAlign: "center",
                padding: "0 100px", marginBottom: 6
            }}>
                {Array.from({length: firstDayOfMonth - 1}).map((_, i) => (
                    <div key={`empty-${i}`}></div>
                ))}
                {data.map((amount, index) => (
                        <Button key={index+1} onClick={() => {
                            displayDay(index+1, month, year)
                        }} sx={{
                            fontSize: 24, fontWeight: 400, height: 95, boxShadow: "1px 2px 4px 2px rgba(0,0,0,0.2)",
                            borderRadius: 3, margin: 0.5
                        }}>
                            <div>
                                <div className={`-my-2.5 ${(amount > totalDay) ? "text-red-600" : "inherit"}`}>{index+1}</div>
                                <div className={`my-0.5 ${(amount > totalDay) ? "text-red-600" : "inherit"}`}>{userSettings.currency}{amount.toFixed(2)}</div>
                            </div>
                        </Button>
                ))}
            </div>
        </div>
    );
};

export default Calendar;