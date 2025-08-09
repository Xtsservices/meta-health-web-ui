import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Role_NAME, patientStatus, transferType } from "../../../utility/role";
import {
  TransferFormDataType,
  // departmentType,
  staffType,
  // transferTypes,
  vitalsType,
  wardType,
} from "../../../types";
import { capitalizeFirstLetter } from "../../../utility/global";
// import Draggable from "react-draggable";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useVitalsStore } from "../../../store/zustandstore";
import { selectTimeline } from "../../../store/currentPatient/currentPatient.selector";
import { authPatch } from "../../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
import { setError, setSuccess } from "../../../store/error/error.action";
import { setTimeline } from "../../../store/currentPatient/currentPatient.action";
import { useNavigate } from "react-router-dom";
// import FormControl from "@mui/material/FormControl";
type propType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
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
export default function TransferPatientDialog({ open, setOpen }: propType) {
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [wardList, setWardList] = React.useState<wardType[]>([]);
  const { setVitals, vitals } = useVitalsStore();
  const [doctorList, setDoctorList] = React.useState<staffType[]>([]);
  // const [departmentList, setDepartmentList] = React.useState<departmentType[]>(
  //   []
  // );
  const navigate = useNavigate();
  //   console.log("vitalsss", vitals);
  const getWardData = async () => {
    const wardResonse = await authFetch(`ward/${user.hospitalID}`, user.token);
    if (wardResonse.message == "success") {
      setWardList(wardResonse.wards);
    }
  };
  const getAllDepartment = async () => {
    // const data = await authFetch(`department/${user.hospitalID}`, user.token);
    // if (data.departments.length) {
    //   setDepartmentList(data.departments);
    // }
    const doctorResponse = await authFetch(
      `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
      user.token
    );
    if (doctorResponse.message == "success") {
      setDoctorList(doctorResponse.users);
    }
  };
  const getAllVitals = async () => {
    const response = await authFetch(
      `vitals/${user.hospitalID}/${timeline.patientID}`,
      user.token
    );
    // console.log("vitals", response);
    if (response.message == "success") {
      setVitals(response.vitals);
    }
  };

  React.useEffect(() => {
    if (user.token) {
      getWardData();
      getAllVitals();
      getAllDepartment();
    }
  }, [user]);

  const initialState = {
    oxygen: 0,
    pulse: 0,
    temp: 0,
    bpH: "",
    bpL: "",
  };
  React.useEffect(() => {
    // console.log("new", vitals);
    let vitalObj = initialState;
    vitals.reverse().forEach((el: vitalsType) => {
      // console.log(vitalObj);
      vitalObj = {
        oxygen: vitalObj.oxygen ? vitalObj.oxygen : el.oxygen,
        pulse: vitalObj.pulse ? vitalObj.pulse : el.pulse,
        temp: vitalObj.temp ? vitalObj.temp : el.temperature,
        bpH: vitalObj.bpH ? vitalObj.bpH : el.bp?.split("/")[0],
        bpL: vitalObj.bpL ? vitalObj.bpL : el.bp?.split("/")[1],
      };
    });
    formData.bpH.value = vitalObj.bpH;
    formData.oxygen.value = vitalObj.oxygen;
    formData.pulse.value = vitalObj.pulse;
    formData.temp.value = vitalObj.temp;
    formData.bpL.value = vitalObj.bpL;
  }, [vitals]);
  const [formData, setFormData] = React.useState<TransferFormDataType>({
    transferType: {
      valid: true,
      message: "",
      value: transferType.internal,
      showError: false,
      name: "transferType",
    },
    wardID: {
      valid: false,
      message: "",
      value: 0,
      showError: false,
      name: "wardID",
    },
    userID: {
      valid: false,
      message: "",
      value: 0,
      showError: false,
      name: "userID",
    },
    departmentID: {
      valid: false,
      message: "",
      value: 0,
      showError: false,
      name: "departmentID",
    },
    reason: {
      valid: false,
      message: "",
      value: "",
      showError: false,
      name: "reason",
    },
    bpL: {
      valid: true,
      message: "",
      value: "",
      showError: false,
      name: "bpL",
    },
    bpH: {
      valid: true,
      message: "",
      value: "",
      showError: false,
      name: "bpH",
    },
    oxygen: {
      valid: true,
      message: "",
      value: 0,
      showError: false,
      name: "oxygen",
    },
    temp: {
      valid: true,
      message: "",
      value: 0,
      showError: false,
      name: "temp",
    },
    pulse: {
      valid: true,
      message: "",
      value: 0,
      showError: false,
      name: "pulse",
    },
    hospitalName: {
      valid: true,
      message: "",
      value: "",
      showError: false,
      name: "hopitalName",
    },
    relativeName: {
      valid: false,
      message: "",
      value: "",
      showError: false,
      name: "relativeName",
    },
  });
  const [patientType, setPatientType] = React.useState<number | null>(null); ////To set whether patient wants to be transffered to outpatient or inpatient
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => {
      const name: string = event.target.name;
      //   console.log("event", event.target.validity.valid);
      return {
        ...prevData,
        [name]: {
          valid: event.target.validity.valid,
          message: event.target.validity.valid ? "" : "This field is required",
          value: event.target.value,
          showError: event.target.validity.valid ? false : true,
          name,
        },
      };
    });
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData((prevData) => {
      const name: string = event.target.name;
      return {
        ...prevData,
        [name]: {
          valid: event.target.value ? true : false,
          message: event.target.value ? "" : "This field is required",
          value: event.target.value,
          showError: event.target.value ? false : true,
          name,
        },
      };
    });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let valid = true;
    Object.keys(formData).forEach((el: string) => {
      if (
        !formData[el as keyof TransferFormDataType].valid &&
        el != "wardID" &&
        el != "departmentID"
      ) {
        formData[el as keyof TransferFormDataType].showError = true;
        formData[el as keyof TransferFormDataType].message =
          "This field is required";
        valid = false;
      }
      if (
        el == "departmentID" &&
        formData.transferType.value == transferType.internal &&
        !formData[el].value
      ) {
        formData[el].showError = true;
        valid = false;
      }
    });
    if (!valid) {
      return;
    }

    const reqObj = {
      wardID: formData.wardID.value,
      transferType: formData.transferType.value,
      bp: formData.bpH.value
        ? formData.bpH.value + "/" + formData.bpL.value
        : null,
      temp: formData.temp.value || null,
      oxygen: formData.oxygen.value || null,
      pulse: formData.pulse.value || null,
      hospitalName: formData.hospitalName.value || null,
      reason: formData.reason.value,
      relativeName: formData.relativeName.value,
      departmentID: formData.departmentID.value,
      userID: formData.userID.value,
      status: patientType,
    };
    const response = await authPatch(
      `patient/${user.hospitalID}/patients/${timeline.patientID}/transfer`,
      reqObj,
      user.token
    );
    if (response.message == "success") {
      dispatch(setSuccess("Patient successfully transfered"));
      if (formData.transferType.value == transferType.internal){
        navigate("../");
        dispatch(setTimeline({ timeline: { ...response.timeline } }));
      }
      else navigate("../../");
      handleClose();
    } else {
      dispatch(setError(response.message));
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit,DEBOUNCE_DELAY)
  //   console.log("showerror", formData.wardID);
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <form onSubmit={(e) => {
	e.preventDefault();
	debouncedHandleSubmit(e);
}
}>
          <DialogTitle
            sx={{
              backgroundColor: "#1977f3",
              color: "white",
              mb: 1,
            }}
            className={classes.draggableHandle}
          >
            Transfer Patient Form
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid container item xs={12}>
                <FormControl required>
                  <FormLabel
                    id="demo-controlled-radio-buttons-group"
                    style={{
                      color: formData.transferType.showError ? "red" : "black",
                    }}
                  >
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
              </Grid>

              {patientType == patientStatus.inpatient ? (
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={formData.wardID.showError && !formData.wardID.valid}
                    required
                  >
                    <InputLabel id="demo-simple-select-helper-label--gender">
                      Ward
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={
                        formData.wardID.value
                          ? String(formData.wardID.value)
                          : ""
                      }
                      label="Ward"
                      onChange={handleSelectChange}
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
                    <FormHelperText>{formData.wardID.message}</FormHelperText>
                  </FormControl>
                </Grid>
              ) : (
                ""
              )}
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={
                    formData.departmentID.showError &&
                    !formData.departmentID.valid
                  }
                  required
                >
                  <InputLabel id="demo-simple-select-helper-label--gender">
                    Doctor Name
                  </InputLabel>
                  {/* <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={
                          formData.departmentID.value
                            ? String(formData.departmentID.value)
                            : ""
                        }
                        label="Department"
                        onChange={handleSelectChange}
                        name="departmentID"
                        required
                      > */}
                  {/* <MenuItem value={"others"}>Others</MenuItem> */}
                  {/* {departmentList.map((department) => {
                          return (
                            <MenuItem value={department.id}>
                              {capitalizeFirstLetter(department.name)}
                            </MenuItem>
                          );
                        })}
                      </Select> */}
                  <Select
                    label="Doctor Name"
                    required
                    onChange={(event: SelectChangeEvent) => {
                      setFormData((state) => {
                        const departmentID =
                          doctorList.filter(
                            (el) => el.id == Number(event.target.value)
                          )[0].departmentID || 0;
                        return {
                          ...state,
                          departmentID: {
                            value: departmentID,
                            showError: false,
                            message: "",
                            valid: true,
                            name: "departmentID",
                          },
                          // userID: {
                          //   value: Number(event.target.value),
                          //   showError: false,
                          //   message: "",
                          //   valid: true,
                          // },
                        };
                      });
                      handleSelectChange(event);
                    }}
                    name="userID"
                    value={String(formData.userID.value) || undefined}
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
                  <FormHelperText>
                    {formData.departmentID.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Reason"
                  //   helperText="Enter your name"
                  multiline
                  rows={3}
                  variant="outlined"
                  type="text"
                  fullWidth
                  name="reason"
                  onChange={handleChange}
                  value={formData.reason.value}
                  error={formData.reason.showError && !formData.reason.valid}
                  helperText={formData.reason.message}
                  required
                />
              </Grid>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={12}>
                  Vitals
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Oxygen (%)"
                    //   helperText="Enter your name"
                    variant="outlined"
                    fullWidth
                    name="oxygen"
                    type="number"
                    inputProps={{
                      min: 50,
                      max: 100,
                    }}
                    onChange={handleChange}
                    value={formData.oxygen.value || ""}
                    error={formData.oxygen.showError && !formData.oxygen.valid}
                    helperText={formData.oxygen.message}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Temperature (Celcius)"
                    //   helperText="Enter your name"
                    variant="outlined"
                    fullWidth
                    name="temp"
                    onChange={handleChange}
                    value={formData.temp.value || ""}
                    error={formData.temp.showError && !formData.temp.valid}
                    helperText={formData.temp.message}
                    type="number" // Set the input type to "text"
                    inputProps={{
                      min: 20,
                      max: 45,
                      step: "0.01", // Allows decimal values with 2 decimal places
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    label="Pulse (bpm)"
                    //   helperText="Enter your name"
                    variant="outlined"
                    fullWidth
                    name="pulse"
                    onChange={handleChange}
                    value={formData.pulse.value || ""}
                    error={formData.pulse.showError && !formData.pulse.valid}
                    helperText={formData.pulse.message}
                    type="number"
                    inputProps={{
                      min: 30,
                      max: 300,
                      step: "0.01",
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Blood Pressure High (mm Hg)"
                    //   helperText="Enter your name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    name="bpH"
                    onChange={handleChange}
                    value={formData.bpH.value || ""}
                    error={
                      Number(formData?.bpL.value) > Number(formData.bpH.value)
                    }
                    helperText={formData.bpH.message}
                    required={formData.bpL.value ? true : false}
                    inputProps={{
                      min: formData.bpL.value || 50,
                      max: 400,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Blood Presure Low (mm Hg)"
                    //   helperText="Enter your name"
                    required={formData.bpH.value ? true : false}
                    variant="outlined"
                    type="text"
                    fullWidth
                    name="bpL"
                    onChange={handleChange}
                    value={formData.bpL.value || ""}
                    helperText={formData.bpL.message}
                    inputProps={{
                      min: 30,
                      max: formData.bpH.value || 300,
                    }}
                    error={
                      Number(formData?.bpL.value) > Number(formData.bpH.value)
                    }
                  />
                </Grid>
                <Grid xs={12} item>
                  {/* Note: Default value of */}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Relative Name"
                  //   helperText="Enter your name"
                  variant="outlined"
                  type="text"
                  fullWidth
                  name="relativeName"
                  onChange={handleChange}
                  value={formData.relativeName.value || ""}
                  error={formData.relativeName.showError}
                  helperText={formData.relativeName.message}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
