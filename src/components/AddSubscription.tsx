import CloseIcon from "@mui/icons-material/Close";
import {IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Button} from "@mui/material";
import React, {useState} from "react";
import SaveIcon from "@mui/icons-material/Save";
import AlertSaveChanges from "@/components/AlertSaveChanges";
import {SUBSCRIPTION_TYPE} from "@/utils/constants";
import {format} from "date-fns";
import CustomDatePicker from "@/components/CustomDatePicker";

type AddSubscriptionProps = {
    setShowAddSubscription: Function;
    handleSaveSubscription: Function;
}

type FormProps = {
    name: string,
    type: string,
    amount: string,
    [key: string]: string;
}

function AddSubscription({setShowAddSubscription, handleSaveSubscription}: AddSubscriptionProps) {
    const [form, setForm] = useState<FormProps>({
        name: "",
        type: "Monthly",
        amount: ""
    })
    const [renews, setRenews] = useState(new Date());
    const [alertSaveChanges, setAlertSaveChanges] = useState(false);

    const handleChange = (e: any) => {
        const {name, value}: { name: string, value: string } = e.target;

        if ((name === 'name' && !/^.{0,30}$/.test(value)) ||
            (name === 'amount' && !/^(|0(|\.\d{0,2})?|[1-9]\d{0,8}(|\.\d{0,2}))$/.test(value)))
            return;
        if (value === form[name]) return;

        setForm((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const handleSave = async () => {
        let cleanForm: any = {...form};
        if (cleanForm.amount === "") {
            cleanForm.amount = "0";
        }
        cleanForm.amount = parseFloat(parseFloat(cleanForm.amount).toFixed(2));
        handleSaveSubscription({...cleanForm, renews: new Date(format(renews, "yyyy-MM-dd"))});
        setShowAddSubscription(false);
    }

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.2)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10
        }}>
            <div style={{
                width: 450, minWidth: 200, background: "white", padding: 20, borderRadius: 5,
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column",
            }}>
                <IconButton size="small" className="self-end"
                            onClick={() => setShowAddSubscription(false)}
                            sx={{background: "#00CF8D77", borderRadius: 2}}>
                    <CloseIcon sx={{fill: "#f8f8f8"}}/>
                </IconButton>
                <div className="p-5">
                    <div className="my-5">
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="my-5">
                        <CustomDatePicker value={renews} onChange={setRenews} noLabel={false}/>
                    </div>
                    <div className="my-5">
                        <FormControl fullWidth>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                                value={form.type}
                                name="type"
                                id="type-select"
                                labelId="type-label"
                                label="Type"
                                onChange={handleChange}
                            >
                                {SUBSCRIPTION_TYPE.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="my-5">
                        <TextField
                            fullWidth
                            id="amount"
                            name="amount"
                            label="Amount"
                            value={form.amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-center mt-3">
                        <Button size={"large"} startIcon={<SaveIcon sx={{fill: "#00cf8d"}}/>}
                                onClick={handleSave}>Save Subscription</Button>
                    </div>
                </div>
            </div>
            <AlertSaveChanges openAlert={alertSaveChanges} hideAlert={setAlertSaveChanges} onSave={handleSave}
                              onNotSave={setShowAddSubscription}/>
        </div>
    );
}

export default AddSubscription;