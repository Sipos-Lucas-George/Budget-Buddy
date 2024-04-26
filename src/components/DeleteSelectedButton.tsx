import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import * as React from "react";

type DeleteSelectedProps = {
    functionOnDelete: Function;
    expenses: number;
}

const DeleteSelectedButton = ({functionOnDelete, expenses}: DeleteSelectedProps) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        functionOnDelete();
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
                    {`Remove ${expenses} ${expenses > 1 ? "rows" : "row"}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Are you sure? ${expenses > 1 ? "These" : "This"} expense will no longer be accessible!`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} sx={{
                        background: "#ff0000bb",
                        ":hover": {
                            background: "#ff0000dd",
                        },
                        ":focus:hover": {
                            background: "#ff0000dd",
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
