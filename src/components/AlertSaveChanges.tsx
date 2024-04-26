import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

type AlertSaveChangesProps = {
    openAlert: boolean;
    hideAlert: any;
    onSave: Function;
    onNotSave: Function;
}

function AlertSaveChanges({openAlert, hideAlert, onSave, onNotSave}: AlertSaveChangesProps) {
    return (
        <Dialog
            open={openAlert}
            onClose={() => hideAlert(false)}
            aria-labelledby="alert-save-changes-title"
            aria-describedby="alert-save-changes-description"
        >
            <DialogTitle id="alert-save-changes-title">
                Save Changes
            </DialogTitle>
            <DialogContent sx={{width: 400, minWidth: 300}}>
                <DialogContentText id="alert-save-changes-description">
                    {`Do you want to save the changes?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onSave()} sx={{
                    background: "#00cf8dbb",
                    ":hover": {
                        background: "#00cf8ddd",
                    },
                    ":focus:hover": {
                        background: "#00cf8ddd",
                    }
                }}>
                    Yes
                </Button>
                <Button onClick={() => onNotSave(false)}>
                    No
                </Button>
                <Button onClick={() => hideAlert(false)}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertSaveChanges;