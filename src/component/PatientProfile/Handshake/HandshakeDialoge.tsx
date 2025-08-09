import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
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
import handshakebanner from "../../../assets/addDoctorBanner/handshakebanner.png"

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

const reasons = [
  "Patient Request",
  "Patient Preference",
  "Retirement",
  "Relocation",
  "Termination",
  "Vacation",
  "Sick Leave",
  "Maternity/Paternity Leave",
  "Sabbatical",
  "Continuing Medical Education (CME)",
  "Conference or Seminar",
  "Personal Reasons",
  "Medical Leave",
  "Bereavement Leave",
  "Off-Duty",
];

export default function HandshakeDialog({ setOpen, open }: propType) {
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const [doctorList, setDoctorList] = React.useState<staffType[]>([]);
  const [, setCurrentDoctorList] = React.useState<PatientDoctor[]>([]);
  const [doctorToID, setDoctorToID] = React.useState<number | null>();
  const [reason, setReason] = React.useState<string>("");
  const currentPatient = useSelector(selectCurrPatient);
  const dispatch = useDispatch();
  const getAllListApi = React.useRef(true);
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
      setDoctorList(
        doctorResponse.users.filter((each: any) => each.id !== user.id)
      );
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
    if (getAllListApi.current) {
      getAllListApi.current = false;
      getAllList();
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await authPost(
      `doctor/${user.hospitalID}/${currentPatient.patientTimeLineID}/transfer`,
      {
        handshakingTo: doctorToID,
        handshakingfrom: user.id,
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
        <DialogTitle style = {{fontWeight:"bold", marginTop:"10px"}}>Handshake Patient </DialogTitle>
        <img src = {handshakebanner} alt = "handshake banner" style = {{width:"200px", position:"absolute", left:"75%"}} /> 
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
              {/* <InputLabel>From</InputLabel> */}
              <FormControl
                variant="outlined"
                fullWidth
                required
                sx={{ mt: "20px" }}
              >
                <TextField
                  label="From"
                  placeholder="Enter surgeryType"
                  disabled
                  value={user.firstName}
                  name="manualsurgeryType"
                />
              </FormControl>
              {/* <Select
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
              </Select> */}
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

            <FormControl
              variant="outlined"
              fullWidth
              required
              sx={{ mt: "20px" }}
            >
              <InputLabel>Reason</InputLabel>
              <Select
                label="Reason"
                required
                onChange={(event: SelectChangeEvent) => {
                  setReason(event.target.value);
                }}
                name="reason"
                value={reason}
              >
                {reasons.map((each) => {
                  return <MenuItem value={each}>{each}</MenuItem>;
                })}
              </Select>
            </FormControl>

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
