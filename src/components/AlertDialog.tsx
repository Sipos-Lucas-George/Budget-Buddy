import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

type AlertDialogProps = {
    openDialog: boolean;
    hideDialog: any;
    dialogTitle: string;
    dialogMessage: string;
}

function AlertDialog({openDialog, hideDialog, dialogTitle, dialogMessage}: AlertDialogProps) {
    return (
        <Dialog
            open={openDialog}
            onClose={() => hideDialog()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => hideDialog()}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;