import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useReportStore } from "../../../../../../store/zustandstore";
import { authDelete } from "../../../../../../axios/authDelete";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../../store/user/user.selector";
type propType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
};
export default function AlertDialog({ open, setOpen, id }: propType) {
  const handleClose = () => {
    setOpen(false);
  };
  const user = useSelector(selectCurrentUser);
  const { deleteReport } = useReportStore();
  const handleDeleteReport = async () => {
    deleteReport(id);
    // console.log(id);
    // console.log("userrr", `attachment/${user.hospitalID}/${id}`);
    await authDelete(`attachment/${user.hospitalID}/${id}`, user.token);
    handleClose();
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are You sure, you want to permanently delete this file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button
            onClick={() => {
              handleDeleteReport();
            }}
            variant="contained"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
