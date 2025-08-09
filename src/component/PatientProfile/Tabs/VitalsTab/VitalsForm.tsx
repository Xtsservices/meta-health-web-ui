import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../../utility/debounce";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { useAlertStore, useVitalsStore } from "../../../../store/zustandstore";
import { setError, setSuccess } from "../../../../store/error/error.action";
import { Vital, vitalsFormType1, wardType } from "../../../../types";
import { authFetch } from "../../../../axios/useAuthFetch";
import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  ChangeEvent,
  FormEventHandler,
} from "react";
import vitalsBanner from "../../../../assets/addDoctorBanner/vitalsBanner.png"
import { checkExistingVitals } from "../../../../utility/vitalsUtils";

const alarmSound = new Audio("../../../../../src/assets/notification.wav");

type formDialogType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  doRemderAfterUpdate: (message: string) => void;
};

const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
  },
  blueDialogTitle: {
    color: "#000000",

  },
});

const VitalsFormDialog = ({
  open,
  setOpen,
  doRemderAfterUpdate,
}: formDialogType) => {
  const handleClose = () => {
    setOpen(false);
    setChecked(false);
    setGivenTime("");
    setFormData(initialState);
  };

  const initialState: vitalsFormType1 = {
    userID: 0,
    oxygen: 0,
    pulse: 0,
    temperature: 0,
    hrv: 0,
    respiratoryRate: 0,
    bpH: "",
    bpL: "",
    bpTime: "",
    oxygenTime: "",
    temperatureTime: "",
    pulseTime: "",
    respiratoryRateTime: "",
    hrvTime: "",
  };
  const [formData, setFormData] = useState<vitalsFormType1>(initialState);
  const [givenTime, setGivenTime] = useState("");
  const { setNewVitals } = useVitalsStore();
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const dispatch = useDispatch();
  const { setAlertNumber } = useAlertStore();
  const hasAnyVitalData = () => {
    return (
      formData.oxygen ||
      formData.respiratoryRate ||
      formData.pulse ||
      formData.temperature ||
      formData.bpH ||
      formData.bpL ||
      formData.hrv
    );
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const intArray = ["pulse", "temperature", "oxygen", "hrv"];
    let value: number | string = event.target.value;
    if (intArray.includes(name)) {
      value = Number(event.target.value);
    }

    if (name == "oxygen" && parseInt(event.target.value) > 100) {
      return;
    }
    if (name == "temperature" && parseInt(event.target.value) > 45) {
      return;
    }
    if (
      (name == "bpH" || name == "bpL" || name == "pulse") &&
      parseInt(event.target.value) > 200
    ) {
      return;
    }
    if (name == "hrv" && parseInt(event.target.value) > 200) {
      return;
    }


    setFormData((state) => {
      return {
        ...state,
        [name]: value,
      };
    });
  };

  function createTime(timeString: string): string {
    const [hours, minutes] = timeString
      .split(":")
      .map((num) => parseInt(num, 10));

    // Create a new Date object in local timezone
    const currentDate = new Date();
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes,
      0, // Seconds
      0 // Milliseconds
    );

    // Get the offset in minutes and convert it to milliseconds
    const timezoneOffset = date.getTimezoneOffset() * 60000;

    // Adjust the date to UTC
    const utcDate = new Date(date.getTime() - timezoneOffset);

    // Convert to ISO string
    const isoDateString = utcDate.toISOString();

    return isoDateString;
  }

  useEffect(() => {
    if (checked && givenTime) {
      setFormData((prev) => {
        return {
          ...prev,
          bpTime: givenTime,
          temperatureTime: givenTime,
          pulseTime: givenTime,
          oxygenTime: givenTime,
          respiratoryRateTime: givenTime,
          hrvTime: givenTime,
        };
      });
    }
  }, [givenTime]);
  useEffect(() => {
    setFormData((prev) => ({ ...prev, userID: user.id }));
  }, [user]);

  function calculateAge(dob: string) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If birth month is greater than the current month or the same month but birth date is greater, decrease age by 1
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const getAlertCount = async () => {
    const response = await authFetch(
      `alerts/hospital/${user.hospitalID}/unseenCount`,
      user.token
    );
    if (response.message === "success") {
      setAlertNumber(response.count);
      // Get previous count from localStorage
      const previousCountString = localStorage.getItem("alertcount");
      // Parse previous count only if it's not null
      const previousCount =
        previousCountString !== null ? parseInt(previousCountString) : 0;
      // Check if the new count is greater than the previous count
      if (response.count > previousCount) {
        // Update localStorage with the new count
        localStorage.setItem("alertcount", response.count.toString());
        alarmSound.play();
      }
    }
  };

  const handleFormSubmit:
    | FormEventHandler<HTMLFormElement>
    | undefined = async (e) => {
      e.preventDefault();

      const vitalTimes: { time: string; type: keyof Vital }[] = [
        { time: formData.bpTime, type: 'bpTime' as keyof Vital },
        { time: formData.oxygenTime, type: 'oxygenTime' as keyof Vital },
        { time: formData.temperatureTime, type: 'temperatureTime' as keyof Vital },
        { time: formData.pulseTime, type: 'pulseTime' as keyof Vital },
        { time: formData.respiratoryRateTime, type: 'respiratoryRateTime' as keyof Vital },
      ].filter((vital) => vital.time);

      for (const vital of vitalTimes) {
        const vitalExists = await checkExistingVitals(vital.time, timeline.patientID || 1, user, vital.type);
        if (vitalExists) {
          dispatch(setError(`A vital reading already exists for ${vital.type} at ${vital.time}`));
          return;
        }
      }

      const wardName = timeline?.wardID
        ? wardList.find((ward) => ward.id == timeline.wardID)?.name
        : "";
      const patientAge = calculateAge(user.dob);
      //respiratoryRate
      const response = await authPost(
        `vitals/${user.hospitalID}/${timeline.patientID}`,
        {
          userID: user.id,
          patientID: timeline.patientID,
          timeLineID: timeline.id,
          oxygen: formData.oxygen,
          hrv: formData.hrv,
          respiratoryRate: formData.respiratoryRate,
          pulse: formData.pulse,
          temperature: formData.temperature,
          bp: formData.bpH ? formData.bpH + "/" + formData.bpL : "",
          bpTime: formData.bpTime ? createTime(formData.bpTime) : "",
          oxygenTime: formData.oxygenTime ? createTime(formData.oxygenTime) : "",
          hrvTime: formData.hrvTime ? createTime(formData.hrvTime) : "",
          respiratoryRateTime: formData.respiratoryRateTime
            ? createTime(formData.respiratoryRateTime)
            : "",
          temperatureTime: formData.temperatureTime
            ? createTime(formData.temperatureTime)
            : "",
          pulseTime: formData.pulseTime ? createTime(formData.pulseTime) : "",
          ward: wardName,
          age: patientAge,
        },
        user.token
      );
      if (response.message == "success") {
        dispatch(setSuccess("Vitals successfully added"));
        doRemderAfterUpdate("render");
        setNewVitals(response.vital);
        setGivenTime("");
        setTimeout(() => {
          handleClose();
        }, 1000);
        await getAlertCount();
      } else {
        dispatch(setError(response.message));
      }
    };
  const debouncedHandleSubmit = debounce(handleFormSubmit, DEBOUNCE_DELAY);

  const [checked, setChecked] = useState(false);
  const [wardList, setWardList] = useState<wardType[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  useEffect(() => {
    async function wardsData() {
      const wardResonse = await authFetch(
        `ward/${user.hospitalID}`,
        user.token
      );
      if (wardResonse.message == "success") {
        setWardList(wardResonse.wards);
      }
    }
    wardsData();
  }, []);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle className={classes.blueDialogTitle} style={{ fontWeight: "bold" }}>
          Add Vitals
        </DialogTitle>
        <img src={vitalsBanner} alt="vitalsBanner" style={{ width: "180px", position: "absolute", left: "76%" }} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!hasAnyVitalData()) {
              dispatch(setError("Please enter at least one vital measurement"));
              return;
            }
            if (checked && !givenTime) {
              dispatch(setError("Please provide a time when applying to all"));
              return;
            }
            debouncedHandleSubmit(e);
          }}
        >
          <DialogContent>
            <Grid
              container
              sx={{ mt: "1rem" }}
              rowGap={2}
              alignItems={"center"}
            >
              <Grid item xs={12} spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1} >
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <p>Apply time to all</p>
                </Stack>
              </Grid>
              {/* ==============oxygen==== */}
              <Grid item xs={checked ? 12 : 6}>
                <TextField
                  id="outlined-required"
                  label="Oxygen(%)"
                  value={formData.oxygen || ""}
                  name="oxygen"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="number"
                  inputProps={{
                    min: 50,
                    max: 100,
                  }}
                />
              </Grid>
              {!checked && (
                <Grid item xs={6}>
                  <TextField
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    required={formData.oxygen ? true : false}
                    value={formData.oxygenTime}
                    name="oxygenTime"
                    fullWidth
                    variant="filled"
                    onChange={handleChangeInput}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              <Grid item xs={checked ? 12 : 6}>
                <TextField
                  id="outlined-required"
                  label="Respiratory Rate(breaths/min)"
                  value={formData.respiratoryRate || ""}
                  name="respiratoryRate"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="number"
                  inputProps={{
                    min: 1,
                    max: 40,
                  }}
                />
              </Grid>
              {!checked && (
                <Grid item xs={6}>
                  <TextField
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    required={formData.respiratoryRate ? true : false}
                    value={formData.respiratoryRateTime}
                    name="respiratoryRateTime"
                    fullWidth
                    variant="filled"
                    onChange={handleChangeInput}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              {/* =========bph= */}
              <Grid item xs={checked ? 6 : 3}>
                <TextField
                  id="outlined-required"
                  label="Blood Pressure High(mm Hg)"
                  value={formData.bpH || ""}
                  required={formData.bpL ? true : false}
                  name="bpH"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    min: formData.bpL || 50,
                    max: 200,
                  }}
                  onChange={handleChangeInput}
                  type="number"
                  error={Number(formData?.bpL) > Number(formData.bpH)}
                />
              </Grid>

              <Grid item xs={checked ? 6 : 3}>
                <TextField
                  id="outlined-required"
                  label="Low(mm Hg)"
                  value={formData.bpL || ""}
                  required={formData.bpH ? true : false}
                  name="bpL"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="number"
                  inputProps={{
                    min: 30,
                    max: formData.bpH || 200,
                  }}
                  error={Number(formData?.bpL) > Number(formData.bpH)}
                />
              </Grid>
              {!checked && (
                <Grid item xs={6}>
                  <TextField
                    required={formData.bpH ? true : false}
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    value={formData.bpTime}
                    name="bpTime"
                    fullWidth
                    variant="filled"
                    onChange={handleChangeInput}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              <Grid item xs={checked ? 12 : 6}>
                <TextField
                  id="outlined-required"
                  label="Pulse(beats/min)"
                  value={formData.pulse || ""}
                  name="pulse"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="number"
                  inputProps={{
                    min: 30,
                    max: 200,
                    step: "0.01",
                  }}
                //   min={0}
                />
              </Grid>
              {!checked && (
                <Grid item xs={6}>
                  <TextField
                    required={formData.pulse ? true : false}
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    value={formData.pulseTime}
                    name="pulseTime"
                    fullWidth
                    variant="filled"
                    onChange={handleChangeInput}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: 30,
                      max: 200,
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={checked ? 12 : 6}>
                <TextField
                  id="outlined-required"
                  label="Temperature(&deg;celsius)"
                  value={formData.temperature || ""}
                  name="temperature"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="number" // Set the input type to "text"
                  inputProps={{
                    min: 20,
                    max: 45,
                    step: "0.01", // Allows decimal values with 2 decimal places
                  }}
                />
              </Grid>
              {!checked && (
                <Grid item xs={6}>
                  <TextField
                    required={formData.temperature ? true : false}
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    value={formData.temperatureTime}
                    name="temperatureTime"
                    fullWidth
                    variant="filled"
                    onChange={handleChangeInput}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              {/* =================hrv================== */}
              <Grid item xs={checked ? 12 : 6}>
                <TextField
                  id="outlined-required"
                  label="Heart Rate Variability(ms)"
                  value={formData.hrv || ""}
                  name="hrv"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="number"
                  inputProps={{
                    min: 20,
                    max: 200,
                    step: 1,
                  }}
                />
              </Grid>
              {!checked && (
                <Grid item xs={6}>
                  <TextField
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    required={formData.hrv ? true : false}
                    value={formData.hrvTime}
                    name="hrvTime"
                    fullWidth
                    variant="filled"
                    onChange={handleChangeInput}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              {checked && (
                <Grid item xs={12}>
                  <TextField
                    required
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    value={givenTime}
                    name="givenTime"
                    fullWidth
                    variant="filled"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setGivenTime(event.target.value);
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default VitalsFormDialog;
