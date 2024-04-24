import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from '@mui/material';
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import * as React from "react";

const DeleteSelectedButton = (data: { functionOnDelete: Function, expenses: number }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        data.functionOnDelete();
        handleClose();
    };

    return (
        <>
            <Button sx={{color: 'red'}} endIcon={<DeleteIcon sx={{fill: "red"}}/>} onClick={handleClickOpen}>
                Delete selected
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Remove ${data.expenses} ${data.expenses > 1 ? "rows" : "row"}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Are you sure? ${data.expenses > 1 ? "These" : "This"} expense will no longer be accessible!`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{"& .MuiTouchRipple-child": {backgroundColor: "#00cf8d",},}}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} sx={{
                        background: "#ff0000bb",
                        backgroundColor: "#ff0000bb",
                        "& .MuiTouchRipple-child": {
                            backgroundColor: "#ff0000"
                        },
                        ":hover": {
                            background: "#ff0000dd",
                            backgroundColor: "#ff0000dd"
                        },
                        ":focus:hover": {
                            background: "#ff0000dd",
                            backgroundColor: "#ff0000dd"
                        }
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeleteSelectedButton;
