import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { staffType, wardType } from "../../../types";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { Role_NAME, patientStatus } from "../../../utility/role";
import { authFetch } from "../../../axios/useAuthFetch";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";
import { selectAllPatient } from "../../../store/patient/patient.selector";
import { setAllPatient } from "../../../store/patient/patient.action";
import { useNavigate } from "react-router-dom";
import { setError, setSuccess } from "../../../store/error/error.action";
import { capitalizeFirstLetter } from "../../../utility/global";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { makeStyles } from "@mui/styles";
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
export default function PatientRevisitDialog({ setOpen, open }: propType) {
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const [wardList, setWardList] = React.useState<wardType[]>([]);
  const [wardID, setWardID] = React.useState<number | undefined>(0);
  const [doctorList, setDoctorList] = React.useState<staffType[]>([]);
  const [departmentID, setDepartmentID] = React.useState<number | undefined>(0);
  const [userID, setUserID] = React.useState<number | undefined>(0);
  const currentPatient = useSelector(selectCurrPatient);
  const allPatient = useSelector(selectAllPatient);
  const [patientType, setPatientType] = React.useState<number | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getAllListApi = React.useRef(true);
  const getAllList = async () => {
    const doctorResponse = await authFetch(
      `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
      user.token
    );
    const wardResonse = await authFetch(`ward/${user.hospitalID}`, user.token);
    if (wardResonse.message == "success") {
      setWardList(wardResonse.wards);
    }
    if (doctorResponse.message == "success") {
      setDoctorList(doctorResponse.users);
    }
  };
  React.useEffect(() => {
    if (user.token && getAllListApi.current) {
      getAllListApi.current = false;
      getAllList();
    }
  }, [user]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("patient revisit data", currentPatient);
    const response = await authPost(
      `patient/${user.hospitalID}/patients/revisit/${currentPatient.id}`,
      {
        ptype: patientType,
        userID: userID,
        departmentID: departmentID,
        wardID: wardID,
      },
      user.token
    );
    if (response.message == "success") {
      const newPatientList = allPatient.filter(
        (patient) => patient.id != currentPatient.id
      );
      dispatch(setAllPatient(newPatientList));
      dispatch(setSuccess("Patient successfully added"));
      setTimeout(() => {
        navigate("../");
      }, 2000);
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
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            On clicking submit, the patient will be removed from discharched
            patient list and will be added on active inpatient list
          </DialogContentText> */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              debouncedHandleSubmit(e);
            }}
          >
            <FormControl required>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Type of Transfer
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="transferType"
                value={patientType || ""}
                // onChange={handleChange}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPatientType(Number(event.target.value))
                }
                // sx={{ display: "flex" }}
              >
                <FormControlLabel
                  value={patientStatus.inpatient}
                  control={<Radio />}
                  label="Inpatient"
                />
                <FormControlLabel
                  value={patientStatus.outpatient}
                  control={<Radio />}
                  label="Outpatient"
                />
                <FormControlLabel
                  value={patientStatus.emergency}
                  control={<Radio />}
                  label="Emergency"
                />
              </RadioGroup>
            </FormControl>
            <FormControl
              variant="outlined"
              fullWidth
              required
              sx={{ mt: "20px" }}
            >
              {/* <InputLabel></InputLabel> */}
              <InputLabel>Doctor</InputLabel>
              <Select
                label="Doctor"
                required
                onChange={(event: SelectChangeEvent) => {
                  setDepartmentID(() => {
                    return doctorList.filter(
                      (el) => el.id == Number(event.target.value)
                    )[0].departmentID;
                  });
                  setUserID(Number(event.target.value));
                }}
                name="userID"
                value={userID ? String(userID) : ""}
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
            {patientType == patientStatus.inpatient ? (
              <FormControl fullWidth required sx={{ mt: 2 }}>
                <InputLabel>Ward</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={wardID ? String(wardID) : ""}
                  label="Ward"
                  onChange={(event: SelectChangeEvent) =>
                    setWardID(Number(event.target.value))
                  }
                  name="wardID"
                  required
                >
                  {/* <MenuItem value={"others"}>Others</MenuItem> */}
                  {wardList.map((ward) => {
                    return (
                      <MenuItem value={ward.id}>
                        {capitalizeFirstLetter(ward.name)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            ) : (
              ""
            )}
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={!patientType}>
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
