import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

function DeleteDialog(data: { openDialog: boolean, hideDialog: any, dialogTitle: string,  dialogMessage: string }) {
    return (
        <Dialog
            open={data.openDialog}
            onClose={() => data.hideDialog()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {data.dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {data.dialogMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => data.hideDialog()}
                        sx={{"& .MuiTouchRipple-child": {backgroundColor: "#00cf8d",},}}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteDialog;