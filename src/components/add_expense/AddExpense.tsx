import "./AddExpense.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {IconButton, TextField, MenuItem, Select, InputLabel, FormControl, outlinedInputClasses} from "@mui/material";
import {useState} from "react";

function AddExpense(data: { setShowAddExpense: Function }) {
    const [paymentType, setPaymentType] = useState('Card');
    const [price, setPrice] = useState('');

    const handlePaymentTypeChange = (event: any) => {
        setPaymentType(event.target.value);
    };

    const handlePriceChange = (event: any) => {
        setPrice(event.target.value.replace(/[^0-9.]/g, ''));
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="add-expense-overlay">
                <div className="add-expense-overlay-content">
                    <IconButton size="small" className="self-end" onClick={() => data.setShowAddExpense(false)}
                                style={{background: "#00CF8D77"}}>
                        <CloseIcon sx={{fill: "#f8f8f8"}}/>
                    </IconButton>
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="payment-type-label">Payment Type</InputLabel>
                        <Select
                            labelId="payment-type-label"
                            id="payment-type-select"
                            value={paymentType}
                            label="Payment Type"
                            onChange={handlePaymentTypeChange}
                        >
                            <MenuItem value="Card">Card</MenuItem>
                            <MenuItem value="Cash">Cash</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Price"
                        variant="outlined"
                        value={price}
                        onChange={handlePriceChange}
                        InputProps={{inputMode: 'numeric',}}
                        margin="normal"
                    />
                </div>
            </div>
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
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: "#00cf8d",
                    '&:hover': {
                        backgroundColor: "#00cf8d",
                    }
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
    }
});

export default AddExpense;
