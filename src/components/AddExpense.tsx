import CloseIcon from "@mui/icons-material/Close";
import {IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Button} from "@mui/material";
import React, {useState} from "react";
import SaveIcon from "@mui/icons-material/Save";

type AddExpenseProps = {
    setShowAddExpense: Function;
}

type FormProps = {
    description: string,
    paymentType: string,
    price: string,
    [key: string]: string;
}

function AddExpense({setShowAddExpense}: AddExpenseProps) {
    const [form, setForm] = useState<FormProps>({
        description: "",
        paymentType: "Card",
        price: '',
    })

    const handleChange = (e: any) => {
        const {name, value}: { name: string, value: string } = e.target;

        if ((name === 'description' && !/^.{0,30}$/.test(value)) ||
            (name === 'price' && !/^-?(|0(|\.\d{0,2})|[1-9]\d{0,8}(|\.\d{0,2}))$/.test(value)))
            return;
        if (value === form[name]) return;

        setForm((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const handleSave = () => {
        // TODO: CAREFUL Number(-0) -> -0
        //     : everything else work just convert -0 to 0
    }
    return (
        <div>
            <div style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.2)",
                display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10
            }}>
                <div style={{
                    height: 750, width: 450, minWidth: 200, background: "white", padding: 20, borderRadius: 5,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column",
                }}>
                    <IconButton size="small" className="self-end"
                                onClick={() => setShowAddExpense(false)}
                                sx={{background: "#00CF8D77", borderRadius: 2}}>
                        <CloseIcon sx={{fill: "#f8f8f8"}}/>
                    </IconButton>
                    <TextField
                        id="description"
                        name="description"
                        label="Description"
                        value={form.description}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="payment-type-label">Payment Type</InputLabel>
                        <Select
                            value={form.paymentType}
                            name="paymentType"
                            id="payment-type-select"
                            labelId="payment-type-label"
                            label="Payment Type"
                            onChange={handleChange}
                        >
                            <MenuItem value="Card">Card</MenuItem>
                            <MenuItem value="Cash">Cash</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        name="price"
                        label="Price"
                        variant="outlined"
                        value={form.price}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <div className="flex justify-center my-2.5">
                        <Button size={"large"} startIcon={<SaveIcon sx={{fill: "#00cf8d"}}/>}
                                onClick={handleSave}>Save Expense</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddExpense;
