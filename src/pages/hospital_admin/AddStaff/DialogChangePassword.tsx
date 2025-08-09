import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authPatch } from "../../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../../store/error/error.action";
const useStyles = makeStyles({
  dialogPaper: {
    // width: "600px",
    minWidth: "500px",
  },
});
type DialogChangePassword = {
  passwordDialog: boolean;
  setPasswordDialog: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
};
function DialogChangePassword({
  passwordDialog,
  setPasswordDialog,
  id,
}: DialogChangePassword) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const [formData, setFormData] = React.useState({
    password: {
      valid: false,
      value: "",
      message: "",
      showError: false,
    },
    confirmPassword: {
      valid: false,
      value: "",
      message: "",
      showError: false,
    },
  });

  const handleClose = () => {
    setPasswordDialog(false);
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;
    const valid = event.target.validity.valid;
    setFormData((state) => {
      return {
        ...state,
        [name]: {
          valid,
          message: "This Field is required",
          value,
          showError: !valid,
        },
      };
    });
  }
  async function handleSave() {
    if (formData.password.value !== formData.confirmPassword.value) {
      setFormData((state) => {
        return {
          ...state,
          confirmPassword: {
            value: state.confirmPassword.value,
            message: "Password and confirm password should be same",
            valid: false,
            showError: true,
          },
        };
      });
    } else {
      const response = await authPatch(
        `user/${user.hospitalID}/changePassword/admin`,
        { id, password: formData.password.value },
        user.token
      );
      if (response.message == "success") {
        dispatch(setSuccess("Password changed Successfully"));
        handleClose();
      } else {
        dispatch(setError(response.message));
      }
    }
  }
  const debouncedHandleSave = debounce(handleSave, DEBOUNCE_DELAY);
  return (
    <>
      <Dialog
        open={passwordDialog}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>Kindly enter the new password</DialogContentText>
          <TextField
            autoFocus
            margin="none"
            id="name"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="confirmPassword"
            helperText={
              !formData.password.valid &&
              formData.password.showError &&
              formData.password.message
            }
            error={!formData.password.valid && formData.password.showError}
            onChange={handleChange}
            sx={{ mt: "40px" }}
          />
          <TextField
            margin="none"
            id="name"
            label="Re-enter Password"
            type="text"
            fullWidth
            variant="outlined"
            name="password"
            helperText={
              !formData.confirmPassword.valid &&
              formData.confirmPassword.showError &&
              formData.confirmPassword.message
            }
            error={
              !formData.confirmPassword.valid &&
              formData.confirmPassword.showError
            }
            onChange={handleChange}
            sx={{ mt: "40px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={debouncedHandleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DialogChangePassword;
