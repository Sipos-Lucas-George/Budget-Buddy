import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

function DeleteDialog(data: { openDialog: boolean, hideDialog: any, functionOnDelete: Function, description: string }) {
    return (
        <Dialog
            open={data.openDialog}
            onClose={() => data.hideDialog()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {`Remove ${data.description}`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`Are you sure? This expense will no longer be accessible!`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => data.hideDialog()}
                        sx={{"& .MuiTouchRipple-child": {backgroundColor: "#00cf8d",},}}>
                    Cancel
                </Button>
                <Button onClick={() => data.functionOnDelete()} sx={{
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
    );
}

export default DeleteDialog;