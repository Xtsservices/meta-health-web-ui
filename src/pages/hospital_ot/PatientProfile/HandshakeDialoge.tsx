import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { PatientDoctor, staffType } from "../../../types";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { Role_NAME } from "../../../utility/role";
import { authFetch } from "../../../axios/useAuthFetch";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";
import { setError, setSuccess } from "../../../store/error/error.action";
import { makeStyles } from "@mui/styles";
import { TextField } from "@mui/material";
const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
    backgroundColor: "white",
    cursor: "pointer",
  },
  draggableHandle: {
    cursor: "move",
    padding: "16px",
    backgroundColor: "#1977f3",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  draggableDialog: {
    cursor: "move",
  },
});
type propType = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};
export default function HandshakeDialog({ setOpen, open }: propType) {
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const [doctorList, setDoctorList] = React.useState<staffType[]>([]);
  const [currentDoctorList, setCurrentDoctorList] = React.useState<
    PatientDoctor[]
  >([]);
  const [doctorFromID, setDoctorFromID] = React.useState<number | null>();
  const [doctorToID, setDoctorToID] = React.useState<number | null>();
  const [reason, setReason] = React.useState<string>("");
  const currentPatient = useSelector(selectCurrPatient);
  const dispatch = useDispatch();
  const getAllList = async () => {
    const doctorResponse = await authFetch(
      `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
      user.token
    );
    const patientDoctorResponse = await authFetch(
      `doctor/${user.hospitalID}/${currentPatient.patientTimeLineID}/all`,
      user.token
    );
    if (doctorResponse.message == "success") {
      setDoctorList(doctorResponse.users);
    }
    if (patientDoctorResponse.message == "success") {
      setCurrentDoctorList(
        patientDoctorResponse.data?.filter(
          (doctor: PatientDoctor) => doctor.active
        )
      );
    }
  };
  React.useEffect(() => {
    getAllList();
  }, [user]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await authPost(
      `doctor/${user.hospitalID}/${currentPatient.patientTimeLineID}/transfer`,
      {
        handshakingTo: doctorToID,
        handshakingfrom: doctorFromID,
        handshakingBy: user.id,
        reason: reason,
      },
      user.token
    );
    if (response.message == "success") {
      dispatch(setSuccess("Patient successfully handshaked"));
      handleClose();
    } else {
      dispatch(setError(response.message));
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Patient Revisit</DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              debouncedHandleSubmit(e);
            }}
          >
            <FormControl
              variant="outlined"
              fullWidth
              required
              sx={{ mt: "20px" }}
            >
              {/* <InputLabel></InputLabel> */}
              <InputLabel>From</InputLabel>
              <Select
                label="Doctor From"
                required
                onChange={(event: SelectChangeEvent) => {
                  setDoctorFromID(Number(event.target.value));
                }}
                name="doctorFromID"
                value={doctorFromID ? String(doctorFromID) : ""}
              >
                {currentDoctorList.map((doc) => {
                  return (
                    <MenuItem value={doc.doctorID}>
                      {doc.firstName
                        ? doc.firstName
                        : "" + doc.lastName
                        ? " " + doc.lastName
                        : ""}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              fullWidth
              required
              sx={{ mt: "20px" }}
            >
              {/* <InputLabel></InputLabel> */}
              <InputLabel>To</InputLabel>
              <Select
                label="Doctor To"
                required
                onChange={(event: SelectChangeEvent) => {
                  setDoctorToID(Number(event.target.value));
                }}
                name="doctorToID"
                value={doctorToID ? String(doctorToID) : ""}
              >
                {doctorList.map((doc) => {
                  return (
                    <MenuItem value={doc.id}>
                      {doc.firstName
                        ? doc.firstName
                        : "" + doc.lastName
                        ? " " + doc.lastName
                        : ""}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              id="outlined-required"
              label="Notes"
              variant="outlined"
              multiline
              rows={3}
              value={reason}
              required
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                //   medicineData[index].medicineName = event.target.value;
                setReason(event.target.value);
              }}
              fullWidth
              sx={{ mt: "20px" }}
            />
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
