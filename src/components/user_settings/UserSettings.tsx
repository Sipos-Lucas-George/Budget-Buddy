import {createTheme, ThemeProvider} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    IconButton,
    outlinedInputClasses,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Slider} from "@mui/material";
import {currencySymbols, incomeLevels} from "@/utils/income_levels";
import SaveIcon from "@mui/icons-material/Save";
import AlertDialog from "@/components/AlertDialog";
import {userSettings} from "@/utils/user_settings";

function UserSettings(data: { setShowUserSettings: Function }) {
    const [incomeLevel, setIncomeLevel] = useState(0);
    const [typeSelection, setTypeSelection] = useState(0);
    const [currencySelection, setCurrencySelection] = useState(0);
    const [income, setIncome] = useState('');

    const [essentials, setEssentials] = useState(50);
    const [debt, setDebt] = useState(50);
    const [discretionary, setDiscretionary] = useState(50);
    const [savings, setSavings] = useState(50);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleTypeSelection = (_event: React.MouseEvent<HTMLElement>, newSelection: number) => {
        if (newSelection !== null) {
            setTypeSelection(newSelection);
        }
    };
    const handleCurrencySelection = (_event: React.MouseEvent<HTMLElement>, newSelection: number) => {
        if (newSelection !== null) {
            setCurrencySelection(newSelection);
        }
    };
    const handleIncomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (/^(|[1-9][0-9]{0,11})$/.test(event.target.value)) {
            setIncome(event.target.value);
        }
    };

    useEffect(() => {
        setEssentials(incomeLevels[incomeLevel].budget.essentials.range_min);
        setDebt(incomeLevels[incomeLevel].budget.debtRepayment.range_min);
        setDiscretionary(incomeLevels[incomeLevel].budget.discretionarySpending.range_min);
        setSavings(incomeLevels[incomeLevel].budget.savings.range_max);
    }, [incomeLevel]);

    useEffect(() => {
        const newIncome = parseInt(income);
        if (newIncome >= incomeLevels[2].individualOrHouseHoldMax[typeSelection])
            setIncomeLevel(3);
        else if (newIncome >= incomeLevels[1].individualOrHouseHoldMax[typeSelection])
            setIncomeLevel(2);
        else if (newIncome >= incomeLevels[0].individualOrHouseHoldMax[typeSelection])
            setIncomeLevel(1);
        else
            setIncomeLevel(0);
    }, [handleIncomeChange, handleTypeSelection]);

    const handleSave = () => {
        const net = parseInt(income);
        const netUpperBound = (typeSelection === 0 ? 10000 : 20000);
        if (isNaN(net) || net < netUpperBound) {
            setErrorMessage(`Please set an yearly income >=${netUpperBound}${currencySymbols[currencySelection]}`);
            setShowError(true);
        } else {
            userSettings.level = incomeLevel;
            userSettings.individualOrHouseHold = typeSelection;
            userSettings.essentials = essentials;
            userSettings.debt = debt;
            userSettings.discretionary = discretionary;
            userSettings.savings = savings;
            data.setShowUserSettings(false);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="add-expense-overlay">
                <div className="add-expense-overlay-content">
                    <IconButton size="small" className="self-end" onClick={() => data.setShowUserSettings(false)}
                                style={{background: "#00CF8D77"}}>
                        <CloseIcon sx={{fill: "#f8f8f8"}}/>
                    </IconButton>
                    <div className="flex justify-center flex-col p-5">
                        <ToggleButtonGroup
                            value={currencySelection}
                            exclusive
                            onChange={handleCurrencySelection}
                            aria-label="Type"
                            className="flex justify-center my-2.5"
                        >
                            <ToggleButton value={0} aria-label="Euro">
                                <div className="mx-2">€</div>
                            </ToggleButton>
                            <ToggleButton value={1} aria-label="Dollar">
                                <div className="mx-2">$</div>
                            </ToggleButton>
                            <ToggleButton value={2} aria-label="Pound">
                                <div className="mx-2">£</div>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <ToggleButtonGroup
                            value={typeSelection}
                            exclusive
                            onChange={handleTypeSelection}
                            aria-label="Type"
                            className="flex justify-center my-2.5"
                        >
                            <ToggleButton value={0} aria-label="Individual">
                                Individual
                            </ToggleButton>
                            <ToggleButton value={1} aria-label="Household">
                                Household
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <TextField
                            id="formatted-numberformat-input"
                            label="Yearly Income"
                            value={income}
                            onChange={handleIncomeChange}
                            inputProps={{pattern: "[0-9]*"}}
                            className="my-2.5"
                            helperText={
                                incomeLevel === 3
                                    ? `${incomeLevels[incomeLevel].label} Income | > ${incomeLevels[incomeLevel - 1].individualOrHouseHoldMax[typeSelection]} ${currencySymbols[currencySelection]}`
                                    : `${incomeLevels[incomeLevel].label} Income | < ${incomeLevels[incomeLevel].individualOrHouseHoldMax[typeSelection]} ${currencySymbols[currencySelection]}`
                            }
                        />
                        <div className="my-2.5">
                            <Typography gutterBottom>Essentials Budget ({essentials}%)</Typography>
                            <Slider
                                value={essentials}
                                onChange={(_event, newValue) => setEssentials(newValue as number)}
                                aria-labelledby="essentials-slider"
                                valueLabelDisplay="auto"
                                min={incomeLevels[incomeLevel].budget.essentials.range_min}
                                max={incomeLevels[incomeLevel].budget.essentials.range_max}
                            />
                        </div>
                        <div className="my-2.5">
                            <Typography gutterBottom>Discretionary Spending Budget ({discretionary}%)</Typography>
                            <Slider
                                value={discretionary}
                                onChange={(_event, newValue) => setDiscretionary(newValue as number)}
                                aria-labelledby="discretionary-slider"
                                valueLabelDisplay="auto"
                                min={incomeLevels[incomeLevel].budget.discretionarySpending.range_min}
                                max={incomeLevels[incomeLevel].budget.discretionarySpending.range_max}
                            />
                        </div>
                        <div className="my-2.5">
                            <Typography gutterBottom>Dept Repayment Budget ({debt}%)</Typography>
                            <Slider
                                value={debt}
                                onChange={(_event, newValue) => setDebt(newValue as number)}
                                aria-labelledby="debt-slider"
                                valueLabelDisplay="auto"
                                min={incomeLevels[incomeLevel].budget.debtRepayment.range_min}
                                max={incomeLevels[incomeLevel].budget.debtRepayment.range_max}
                            />
                        </div>
                        <div className="my-2.5">
                            <Typography gutterBottom>Savings ({savings}%)</Typography>
                            <Slider
                                value={savings}
                                onChange={(_event, newValue) => setSavings(newValue as number)}
                                aria-labelledby="savings-slider"
                                valueLabelDisplay="auto"
                                min={incomeLevels[incomeLevel].budget.savings.range_min}
                                max={incomeLevels[incomeLevel].budget.savings.range_max}
                            />
                        </div>
                        <div className="flex justify-center my-2.5">
                            <Button startIcon={<SaveIcon/>} onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            </div>
            <AlertDialog openDialog={showError} hideDialog={setShowError} dialogTitle={"Yearly income too low"}
                         dialogMessage={errorMessage}/>
        </ThemeProvider>
    );
}

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
        MuiButton: {
            styleOverrides: {
                root: {
                    color: "inherit",
                    fontSize: 20,
                    textTransform: "none",
                    ":hover": {
                        background: "#00cf8d44"
                    },
                    ":focus:hover": {
                        background: "#00cf8d88"
                    },
                    "& .MuiTouchRipple-child": {
                        background: "#00cf8d",
                        backgroundColor: "#00cf8d",
                    },
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    fontFamily: "inherit",
                    textTransform: "none",
                    color: "inherit",
                    ":hover": {
                        background: "#00cf8d44"
                    },
                    ":focus:hover": {
                        background: "#00cf8d88"
                    },
                    "&.Mui-selected": {
                        background: "#00cf8d66",
                        '&:hover': {
                            backgroundColor: '#00cf8d88',
                        }
                    },
                    "& .MuiTouchRipple-child": {
                        background: "#00cf8d",
                        backgroundColor: "#00cf8d",
                    },
                }
            }
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    color: "#00cf8d",
                    height: 8,
                },
                thumb: {
                    color: "white",
                    "&:hover, &.Mui-focusVisible": {
                        boxShadow: `0px 0px 0px 8px #00cf8d44`
                    },
                    "&.Mui-active": {
                        color: "#00cf8d",
                        boxShadow: `0px 0px 0px 14px #00cf8d44`
                    }
                },
                track: {
                    color: '#00cf8d',
                    height: 8,
                    borderRadius: 4,
                },
                rail: {
                    color: '#bfbfbf',
                    opacity: 1,
                    height: 8,
                    borderRadius: 4,
                },
                valueLabel: {
                    backgroundColor: '#00cf8d',
                    '& *': {
                        background: 'transparent',
                        color: '#2.52.52.5',
                    },
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontFamily: "inherit",
                    fontWeight: 700,
                    '&.Mui-focused': {
                        color: '#00cf8d'
                    },
                },
            },
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
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    color: '#00cf8d',
                }
            }
        }
    }
});

export default UserSettings;