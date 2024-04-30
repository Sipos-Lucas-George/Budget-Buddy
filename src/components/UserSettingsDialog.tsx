"use client";

import CloseIcon from "@mui/icons-material/Close";
import {Button, IconButton, TextField, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {useState} from "react";
import {Slider} from "@mui/material";
import {incomeLevels} from "@/utils/income_levels";
import SaveIcon from "@mui/icons-material/Save";
import AlertDialog from "@/components/AlertDialog";
import {userSettings} from "@/utils/user_settings";
import AlertSaveChanges from "@/components/AlertSaveChanges";
import {useSession} from "next-auth/react";
import {useSettingsContext} from "@/components/SettingsProvider";

type UserSettingsProps = {
    income: string;
    level: number;
    individualOrHouseHold: string;
    essentials: number;
    debt: number;
    discretionary: number;
    savings: number;
    currency: string;
    [key: string]: string | number;
}

type UserSettingsDialogProps = {
    setShowUserSettings: Function;
    showExitButton?: boolean;
}

function UserSettingsDialog({setShowUserSettings, showExitButton = true}: UserSettingsDialogProps) {
    const {data: session} = useSession();
    const settingsContext = useSettingsContext();
    const [settings, setSettings] = useState<UserSettingsProps>({
        income: userSettings.income === 0 ? "" : userSettings.income.toString(),
        level: userSettings.level,
        individualOrHouseHold: userSettings.individualOrHouseHold.toString(),
        essentials: userSettings.essentials,
        debt: userSettings.debt,
        discretionary: userSettings.discretionary,
        savings: userSettings.savings,
        currency: userSettings.currency,
    })
    const [incomeLevel, setIncomeLevel] = useState(settings.level);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [alertSaveChanges, setAlertSaveChanges] = useState(false);

    let nowLevel = 0;
    for (let i = 0; i < incomeLevels.length; i++) {
        if (parseInt(settings.income) >= incomeLevels[i].individualOrHouseHoldMax[parseInt(settings.individualOrHouseHold)]) {
            nowLevel = i + 1;
        } else break;
    }
    if (incomeLevel !== nowLevel) {
        setIncomeLevel(nowLevel);
        setSettings((prev) => {
            return {
                ...prev,
                essentials: (nowLevel === userSettings.level) ? userSettings.essentials : incomeLevels[nowLevel].budget.essentialsRange.range_min,
                debt: (nowLevel === userSettings.level) ? userSettings.debt : incomeLevels[nowLevel].budget.debtRepaymentRange.range_min,
                discretionary: (nowLevel === userSettings.level) ? userSettings.discretionary : incomeLevels[nowLevel].budget.discretionarySpendingRange.range_min,
                savings: (nowLevel === userSettings.level) ? userSettings.savings : incomeLevels[nowLevel].budget.savingsRange.range_max,
            }
        })
    }

    const handleChange = (e: any) => {
        const {name, value}: { name: string, value: string } = e.target;

        if (name === 'income' && !/^(|[1-9][0-9]{0,11})$/.test(value)) return;
        if (value === settings[name]) return;

        setSettings((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }
    const handleChangeSlider = (e: any) => {
        const {name, value}: { name: string, value: number } = e.target;

        if (value === settings[name]) return;

        setSettings((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const hideAlert = () => {
        setShowError(false);
    }

    const handleSave = async () => {
        const income = parseInt(settings.income);
        const individualOrHouseHold = parseInt(settings.individualOrHouseHold);
        const netUpperBound = (individualOrHouseHold === 0 ? 10000 : 20000);
        if (isNaN(income) || income < netUpperBound) {
            setErrorMessage(`Please set an yearly income >=${netUpperBound}${settings.currency}`);
            setShowError(true);
            return;
        }
        userSettings.setAllMany(income, incomeLevel, individualOrHouseHold, settings.essentials, settings.debt,
            settings.discretionary, settings.savings, settings.currency);
        settingsContext.setState({...userSettings});
        await fetch(`/api/user_settings/${session?.user?.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                income: income,
                level: incomeLevel,
                individualOrHouseHold: individualOrHouseHold,
                essentials: settings.essentials,
                debt: settings.debt,
                discretionary: settings.discretionary,
                savings: settings.savings,
                currency: settings.currency,
            })
        })
            .catch((error) => {
                console.log(error)
            });
        setShowUserSettings(false);
    }

    const handleExit = () => {
        if (userSettings.income !== parseInt(settings.income) || userSettings.level !== settings.level ||
            userSettings.individualOrHouseHold !== parseInt(settings.individualOrHouseHold) ||
            userSettings.essentials !== settings.essentials || userSettings.debt !== settings.debt ||
            userSettings.discretionary !== settings.discretionary || userSettings.savings !== settings.savings ||
            userSettings.currency !== settings.currency) {
            setAlertSaveChanges(true);
            return;
        }
        setShowUserSettings(false);
    }

    return (
        <div>
            <div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex",
                justifyContent: "center", alignItems: "center", zIndex: 5, background: "rgba(0, 0, 0, 0.2)"}}>
                <div style={{width: 450, minWidth: 200, background: "white", padding: 20, borderRadius: 5,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column",}}>
                    {showExitButton && (
                        <IconButton size="small" className="self-end" onClick={handleExit}
                                    sx={{background: "#00CF8D77", borderRadius: 2}}>
                            <CloseIcon sx={{fill: "#f8f8f8"}}/>
                        </IconButton>)
                    }
                    <div className="flex justify-center flex-col p-5">
                        <ToggleButtonGroup
                            value={settings.currency}
                            aria-label="currency"
                            exclusive
                            onChange={handleChange}
                            sx={{marginTop: 1, marginBottom: 1}}
                            className="flex justify-center"
                        >
                            <ToggleButton value="€" name="currency" aria-label="Euro"
                                          sx={{padding: 3, width: 0, height: 0}}>
                                €
                            </ToggleButton>
                            <ToggleButton value="$" name="currency" aria-label="Dollar"
                                          sx={{padding: 3, width: 0, height: 0}}>
                                $
                            </ToggleButton>
                            <ToggleButton value="£" name="currency" aria-label="Pound"
                                          sx={{padding: 3, width: 0, height: 0}}>
                                £
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <ToggleButtonGroup
                            value={settings.individualOrHouseHold}
                            aria-labelledby="individualOrHouseHold"
                            exclusive
                            onChange={handleChange}
                            aria-label="type"
                            sx={{marginTop: 1, marginBottom: 1}}
                            className="flex justify-center"
                        >
                            <ToggleButton name="individualOrHouseHold" value="0"
                                          aria-label="Individual">
                                Individual
                            </ToggleButton>
                            <ToggleButton name="individualOrHouseHold" value="1"
                                          aria-label="Household">
                                Household
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <TextField
                            id="formatted-number-input"
                            name="income"
                            label="Yearly Income"
                            value={settings.income}
                            onChange={handleChange}
                            sx={{marginTop: 1.5, marginBottom: 1}}
                            helperText={
                                incomeLevel === 3
                                    ? `${incomeLevels[incomeLevel].label} Income | > ${incomeLevels[incomeLevel - 1].individualOrHouseHoldMax[parseInt(settings.individualOrHouseHold)]}${settings.currency}`
                                    : `${incomeLevels[incomeLevel].label} Income | < ${incomeLevels[incomeLevel].individualOrHouseHoldMax[parseInt(settings.individualOrHouseHold)]}${settings.currency}`
                            }
                        />
                        <div className="my-2.5">
                            <Typography gutterBottom>Essentials Budget ({settings.essentials}%)</Typography>
                            <Slider
                                value={settings.essentials}
                                name="essentials"
                                onChange={handleChangeSlider}
                                aria-labelledby="essentials-slider"
                                valueLabelDisplay="auto"
                                min={incomeLevels[incomeLevel].budget.essentialsRange.range_min}
                                max={incomeLevels[incomeLevel].budget.essentialsRange.range_max}
                            />
                        </div>
                        <div className="my-2.5">
                            <Typography gutterBottom>Discretionary Spending Budget
                                ({settings.discretionary}%)</Typography>
                            <Slider
                                value={settings.discretionary}
                                name="discretionary"
                                onChange={handleChangeSlider}
                                aria-labelledby="discretionary-slider"
                                valueLabelDisplay="auto"
                                min={incomeLevels[incomeLevel].budget.discretionarySpendingRange.range_min}
                                max={incomeLevels[incomeLevel].budget.discretionarySpendingRange.range_max}
                            />
                        </div>
                        <div className="my-2.5">
                            <Typography gutterBottom>Dept Repayment Budget ({settings.debt}%)</Typography>
                            <Slider
                                value={settings.debt}
                                name="debt"
                                onChange={handleChangeSlider}
                                aria-labelledby="debt-slider"
                                valueLabelDisplay="auto"
                                min={incomeLevels[incomeLevel].budget.debtRepaymentRange.range_min}
                                max={incomeLevels[incomeLevel].budget.debtRepaymentRange.range_max}
                            />
                        </div>
                        <div className="my-2.5">
                            <Typography gutterBottom>Savings ({settings.savings}%)</Typography>
                            <Slider
                                value={settings.savings}
                                name="savings"
                                onChange={handleChangeSlider}
                                aria-labelledby="savings-slider"
                                valueLabelDisplay="auto"
                                min={incomeLevels[incomeLevel].budget.savingsRange.range_min}
                                max={incomeLevels[incomeLevel].budget.savingsRange.range_max}
                            />
                        </div>
                        <div className="flex justify-center my-2.5">
                            <Button size={"large"} startIcon={<SaveIcon sx={{fill: "#00cf8d"}}/>}
                                    onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            </div>
            <AlertDialog openDialog={showError} hideDialog={hideAlert} dialogTitle={"Yearly income too low"}
                         dialogMessage={errorMessage}/>
            <AlertSaveChanges openAlert={alertSaveChanges} hideAlert={setAlertSaveChanges} onSave={handleSave}
                              onNotSave={setShowUserSettings}/>
        </div>
    );
}

export default UserSettingsDialog;