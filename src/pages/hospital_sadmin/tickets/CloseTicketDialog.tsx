import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { tickeCloseStatus, ticketStatus } from "../../../utility/role";
import { capitalizeFirstLetter } from "../../../utility/global";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { authPatch } from "../../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
import { setError, setSuccess } from "../../../store/error/error.action";
import { useNavigate } from "react-router-dom";
type propType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
};
function CloseTicketDialog({ open, setOpen, id }: propType) {
  const user = useSelector(selectCurrentUser);
  const [reason, setReason] = React.useState<string>("");
  const [closeStatus, setCloseStatus] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const res = await authPatch(
      `ticket/${id}/status`,
      {
        status,
        reason,
        closeStatus,
      },
      user.token
    );
    if (res.message == "success") {
      dispatch(setSuccess("Ticket status successfully changed"));
      handleClose();
      setTimeout(() => {
        navigate("../");
      }, 1000);
    } else {
      dispatch(setError(res.message));
    }
  };
  const debounceSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);
  console.log("-------------------", status, ticketStatus.Closed);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          debounceSubmit();
        },
      }}
    >
      <DialogTitle>Ticket Close</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You won't be able to perform any action once the ticket is closed
        </DialogContentText>
        <FormControl fullWidth required>
          <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={status}
            label="Status"
            onChange={(e: SelectChangeEvent) => {
              setStatus(e.target.value);
              if (e.target.value !== String(ticketStatus.Closed)) {
                setCloseStatus("");
              }
            }}
            name="departmentID"
          >
            {Object.keys(ticketStatus)
              .slice(1)
              .map((el, index) => (
                <MenuItem
                  key={index}
                  value={String(Object.values(ticketStatus)[index + 1])}
                >
                  {capitalizeFirstLetter(el)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth required sx={{ mt: 1 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Close Status
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={closeStatus}
            label="Close Status"
            onChange={(e: SelectChangeEvent) => setCloseStatus(e.target.value)}
            name="departmentID"
            disabled={status != String(ticketStatus.Closed)}
          >
            {Object.keys(tickeCloseStatus).map((el, index) => (
              <MenuItem
                key={index}
                value={String(Object.values(tickeCloseStatus)[index])}
              >
                {capitalizeFirstLetter(el)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required
          margin="dense"
          id="name"
          name="email"
          label="Reason"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={reason}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setReason(event.target.value)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CloseTicketDialog;
