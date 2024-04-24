import "./DayOverlay.css";
import {useEffect, useRef, useState} from "react";
import {IconButton, outlinedInputClasses} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CrudGrid from "@/components/CrudGrid";

const DayOverlay = (data: { day: number, month: number, year: number, hideDay: any }) => {
    const [dataRows, setDataRows] = useState([
        {id: 1, description: 'Description 1', type: 'Card', price: 10.00},
        {id: 2, description: 'Description 1', type: 'Cash', price: 30.00},
        {id: 3, description: 'Description 1', type: 'Card', price: 20.00},
        {id: 4, description: 'Description 1', type: 'Cash', price: 80.00},
        {id: 5, description: 'Description 2', type: 'Cash', price: 80.00},
        {id: 6, description: 'Description 2', type: 'Card', price: 50.00},
        {id: 7, description: 'Description 1', type: 'Card', price: 50.00},
        {id: 8, description: 'Description 1', type: 'Card', price: 40.00},
        {id: 9, description: 'Description 1', type: 'Card', price: 40.00},
        {id: 10, description: 'Description 2', type: 'Cash', price: 20.00}
    ]);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                data.hideDay();
            }
        };
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [data.hideDay]);

    return (
        <ThemeProvider theme={theme}>
            <div className="overlay">
                <div className="overlay-content" ref={overlayRef}>
                    <IconButton size="small" className="self-end" onClick={data.hideDay}
                                style={{background: "#00CF8D77"}}>
                        <CloseIcon sx={{fill: "#f8f8f8"}}/>
                    </IconButton>
                    <div className="grow">
                        <div className="pb-5 font-semibold text-xl flex justify-center">
                            {data.day + ' ' + new Date(data.month).toLocaleString('default', {month: 'long'}) + ' ' + data.year}
                        </div>
                        <CrudGrid rows={dataRows} setRows={setDataRows}/>
                    </div>
                    <div className="flex justify-center align-middle text-2xl">
                        <label id="today-expenses">Overall expenses:&nbsp;</label>
                        <span>${(dataRows.reduce((acc, row) => acc + row.price, 0)).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
};

const theme = createTheme({
    typography: {
        fontFamily: "inherit"
    },
    components: {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 5,
                    ":hover": {
                        background: "#00cf8d99 !important"
                    },
                    "& .MuiTouchRipple-child": {
                        borderRadius: 5,
                        backgroundColor: "#00cf8d !important",
                    },
                    color: "white"
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    ":hover": {
                        background: "#00cf8d44"
                    },
                    ":focus": {
                        background: "#00cf8d66"
                    },
                    ":focus:hover": {
                        background: "#00cf8d88"
                    },
                    "& .MuiTouchRipple-child": {
                        backgroundColor: "#00cf8d",
                    },
                    "&.Mui-selected": {
                        backgroundColor: "#00cf8d66"
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "#00cf8d88"
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    "&.Mui-focused": {
                        color: "#00cf8d",
                    },
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    "&.Mui-focused:after": {
                        borderBottom: "solid #00cf8d 2px",
                    },
                    "&:hover:after": {
                        borderBottom: "solid #00cf8d 2px",
                    },
                    "&:hover .MuiOutlineInput-notchedOutline": {
                        borderColor: "#00cf8d !important"
                    },
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    '&:hover:not(.Mui-disabled, .Mui-error):before': {
                        borderBottom: 'solid #00cf8d 2px'
                    },
                    '&::after': {
                        borderBottom: 'solid #00cf8d 2px',
                    },
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: "inherit",
                    ":hover": {
                        background: "#00cf8d44"
                    },
                    ":focus:hover": {
                        background: "#00cf8d88"
                    },
                    "& .MuiTouchRipple-child": {
                        backgroundColor: "#00cf8d",
                    },
                }
            }
        },
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
    },
});

export default DayOverlay;