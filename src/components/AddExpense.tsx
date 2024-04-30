import CloseIcon from "@mui/icons-material/Close";
import {IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Button} from "@mui/material";
import React, {useState} from "react";
import SaveIcon from "@mui/icons-material/Save";
import AlertSaveChanges from "@/components/AlertSaveChanges";
import {CATEGORY, CATEGORY_MAP, PAYMENT, TYPE} from "@/utils/constants";

type AddExpenseProps = {
    setShowAddExpense: Function;
    handleSaveExpense: Function;
}

type FormProps = {
    description: string,
    payment: string,
    type: string,
    category: string,
    amount: string,
    [key: string]: string;
}

function AddExpense({setShowAddExpense, handleSaveExpense}: AddExpenseProps) {
    const [form, setForm] = useState<FormProps>({
        description: "",
        payment: "Cash",
        type: "Essentials",
        category: "Personal Spending",
        amount: ""
    })
    const [alertSaveChanges, setAlertSaveChanges] = useState(false);

    const handleChange = (e: any) => {
        const {name, value}: { name: string, value: string } = e.target;

        if ((name === 'description' && !/^.{0,30}$/.test(value)) ||
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
        if (cleanForm.category.match(/(?=.*[A-Z].*[A-Z])/)) {
            cleanForm.category = CATEGORY_MAP[cleanForm.category];
        }
        if (cleanForm.amount === "" || cleanForm.amount === "-" || cleanForm.amount === "-0") {
            cleanForm.amount = "0";
        }
        cleanForm.amount = parseFloat(parseFloat(cleanForm.amount).toFixed(2));
        handleSaveExpense(cleanForm);
        setShowAddExpense(false);
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
                            onClick={() => setShowAddExpense(false)}
                            sx={{background: "#00CF8D77", borderRadius: 2}}>
                    <CloseIcon sx={{fill: "#f8f8f8"}}/>
                </IconButton>
                <div className="p-5">
                    <TextField
                        fullWidth
                        id="description"
                        name="description"
                        label="Description"
                        value={form.description}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="payment-label">Payment</InputLabel>
                        <Select
                            value={form.payment}
                            name="payment"
                            id="payment-select"
                            labelId="payment-label"
                            label="Payment"
                            onChange={handleChange}
                        >
                            {PAYMENT.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            value={form.type}
                            name="type"
                            id="type-select"
                            labelId="type-label"
                            label="Type"
                            onChange={handleChange}
                        >
                            {TYPE.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            value={form.category}
                            name="category"
                            id="category-select"
                            labelId="category-label"
                            label="Category"
                            onChange={handleChange}
                        >
                            {CATEGORY.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        id="amount"
                        name="amount"
                        label="Amount"
                        value={form.amount}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <div className="flex justify-center mt-3">
                        <Button size={"large"} startIcon={<SaveIcon sx={{fill: "#00cf8d"}}/>}
                                onClick={handleSave}>Save Expense</Button>
                    </div>
                </div>
            </div>
            <AlertSaveChanges openAlert={alertSaveChanges} hideAlert={setAlertSaveChanges} onSave={handleSave}
                              onNotSave={setShowAddExpense}/>
        </div>
    );
}

export default AddExpense;
