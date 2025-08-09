import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setLoading, setSuccess } from "../../../store/error/error.action";
import { authPatch } from "../../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';

// import { setCurrentUser } from "../../../store/user/user.action";
import { selectAllStaff } from "../../../store/staff/staff.selector";
import { setAllStaff } from "../../../store/staff/staff.action";
import { staffType } from "../../../types";
type propType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  setStaff: React.Dispatch<React.SetStateAction<staffType | null>>;
};
export default function AlertDialog({ open, setOpen, id, setStaff }: propType) {
  const handleClose = () => {
    setOpen(false);
  };
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const staffList = useSelector(selectAllStaff);
  const handleSubmit = async () => {
    const forms = new FormData();

    forms.append("photo", "");
    forms.append("image", "");

    dispatch(setLoading(true));

    const data = await authPatch(
      `user/${user.hospitalID}/editStaff/${id}`,
      forms,
      user.token
    );

    dispatch(setLoading(false));
    if (data.message == "success") {
      dispatch(
        setAllStaff(
          staffList.map((staff) => {
            if (staff.id == id) {
              return data.user;
            } else return staff;
          })
        )
      );
      setStaff((state) => {
        if (state) return { ...state, photo: null, imageURL: "" };
        else return null;
      });

      dispatch(setSuccess("Profile image successfully removed"));
    }
    handleClose();
  };
  const debouncedHandleSubmit = debounce(handleSubmit,DEBOUNCE_DELAY);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to remove the profile image?"}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>cancel</Button>
          <Button onClick={debouncedHandleSubmit} autoFocus variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
