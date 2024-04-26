import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

type DeleteDialogProps = {
    openDialog: boolean;
    hideDialog: any;
    functionOnDelete: Function;
    description: string;
}

function DeleteDialog({openDialog, hideDialog, functionOnDelete, description}: DeleteDialogProps) {
    return (
        <Dialog
            open={openDialog}
            onClose={() => hideDialog()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {`Remove ${description}`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`Are you sure? This expense will no longer be accessible!`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => hideDialog()}>
                    Cancel
                </Button>
                <Button onClick={() => functionOnDelete()} sx={{
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
    );
}

export default DeleteDialog;