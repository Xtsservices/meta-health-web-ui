import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../../utility/debounce";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { useVitalsStore } from "../../../../store/zustandstore";
import { setError, setSuccess } from "../../../../store/error/error.action";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import { vitalsFormType } from "../../../../types";
type formDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
  },
  blueDialogTitle: {
    backgroundColor: "#1977f3", // Change this to the desired background color
    color: "white", // Optionally, you can set the text color
  },
});
export default function VitalsFormDialog({ open, setOpen }: formDialogType) {
  const initialState: vitalsFormType = {
    userID: 0,
    oxygen: 0,
    pulse: 0,
    temperature: 0,
    bpH: "",
    bpL: "",
    bpTime: "",
    oxygenTime: "",
    temperatureTime: "",
    pulseTime: "",
  };
  const handleClose = () => {
    setChecked(false);
    setFormData(initialState);
    setOpen(false);
  };

  const [formData, setFormData] = React.useState<vitalsFormType>(initialState);
  const [givenTime, setGivenTime] = React.useState("");
  const { setNewVitals } = useVitalsStore();
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const dispatch = useDispatch();
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const intArray = ["pulse", "temperature", "oxygen"];

    let value: number | string = event.target.value;
    if (intArray.includes(name)) {
      value = Number(event.target.value);
    }
    setFormData((state) => {
      return {
        ...state,
        [name]: value,
      };
    });
  };

  function createTime(timeString: string) {
    const [hours, minutes] = timeString.split(":");
    const currentDate = new Date();
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      Number(hours),
      Number(minutes)
    ).toISOString();
    return date;
  }
  React.useEffect(() => {
    if (checked && givenTime) {
      // console.log(time);
      setFormData((prev) => {
        return {
          ...prev,
          bpTime: givenTime,
          temperatureTime: givenTime,
          pulseTime: givenTime,
          oxygenTime: givenTime,
        };
      });
    }
  }, [givenTime]);
  React.useEffect(() => {
    setFormData((prev) => ({ ...prev, userID: user.id }));
  }, [user]);
  const handleFormSubmit:
    | React.FormEventHandler<HTMLFormElement>
    | undefined = async (e) => {
    e.preventDefault();

    // console.log(createTime(formData.bpTime));
    // console.log(formData.bpTime);
    // const form = new FormData();
    // const formKeys: Array<keyof vitalsFormType> = Object.keys(
    //   formData
    // ) as Array<keyof vitalsFormType>;
    // formKeys.forEach((el: keyof vitalsFormType) => {
    //   if (formData[el]) {
    //     console.log(el, formData[el]);
    //     console.log(formData);
    //     form.append(el, String(formData[el]) as string | Blob);
    //   }
    // });

    // console.log(user.id);
    // form.append("userID", String(user.id));
    const response = await authPost(
      `vitals/${user.hospitalID}/${timeline.patientID}`,
      {
        userID: user.id,
        patientID: timeline.patientID,
        timeLineID: timeline.id,
        oxygen: formData.oxygen,
        pulse: formData.pulse,
        temperature: formData.temperature,
        bp:
          formData.bpH && formData.bpL ? formData.bpH + "/" + formData.bpL : "",
        bpTime: formData.bpTime ? createTime(formData.bpTime) : "",
        oxygenTime: formData.oxygenTime ? createTime(formData.oxygenTime) : "",
        temperatureTime: formData.temperatureTime
          ? createTime(formData.temperatureTime)
          : "",
        pulseTime: formData.pulseTime ? createTime(formData.pulseTime) : "",
      },
      user.token
    );
    // console.log("vitals resonse", response);
    if (response.message == "success") {
      dispatch(setSuccess("Vitals successfully added"));
      setNewVitals(response.vital);
      setFormData(initialState);
      setGivenTime("");
      setTimeout(() => {
        handleClose();
      }, 1000);
    } else {
      dispatch(setError(response.message));
    }
  };
  const debouncedHandleSubmit = debounce(handleFormSubmit, DEBOUNCE_DELAY);
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  // console.log("formData", formData);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle className={classes.blueDialogTitle}>
          Add Vitals
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            debouncedHandleSubmit(e);
          }}
        >
          <DialogContent>
            <Grid
              container
              sx={{ mt: "2rem" }}
              rowGap={2}
              alignItems={"center"}
            >
              <Grid item xs={12}>
                <Stack direction="row">
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <p>Apply time to all</p>
                </Stack>
              </Grid>
              <Grid item xs={checked ? 12 : 6}>
                <TextField
                  id="outlined-required"
                  label="Oxygen(%)"
                  //   defaultValue="Hello World"
                  value={formData.oxygen}
                  // error={true}
                  name="oxygen"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="number"
                />
              </Grid>
              {!checked && (
                <Grid item xs={6}>
                  <TextField
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    //   defaultValue="Hello World"
                    required={formData.oxygen ? true : false}
                    value={formData.oxygenTime}
                    // error={true}
                    name="oxygenTime"
                    fullWidth
                    variant="filled"
                    onChange={handleChangeInput}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              <Grid item xs={checked ? 6 : 3}>
                <TextField
                  id="outlined-required"
                  label="Blood Pressure High(mm Hg)"
                  //   defaultValue="Hello World"
                  value={formData.bpH}
                  required={formData.bpL ? true : false}
                  // error={true}
                  name="bpH"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="blood pressure"
                  error={Number(formData?.bpL) > Number(formData.bpH)}
                />
              </Grid>

              <Grid item xs={checked ? 6 : 3}>
                <TextField
                  id="outlined-required"
                  label="Low(mm Hg)"
                  //   defaultValue="Hello World"
                  value={formData.bpL}
                  required={formData.bpH ? true : false}
                  // error={true}
                  name="bpL"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="blood pressure"
                  error={Number(formData?.bpL) > Number(formData.bpH)}
                  //   min={0}
                />
              </Grid>
              {!checked && (
                <Grid item xs={6}>
                  <TextField
                    required={formData.bpH ? true : false}
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    //   defaultValue="Hello World"
                    value={formData.bpTime}
                    // error={true}
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
                  label="Pulse(bpm)"
                  //   defaultValue="Hello World"
                  value={formData.pulse}
                  // error={true}
                  name="pulse"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="number"
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
                    //   defaultValue="Hello World"
                    value={formData.pulseTime}
                    // error={true}
                    name="pulseTime"
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
                  label="Temperature(&deg;celsius)"
                  //   defaultValue="Hello World"
                  value={formData.temperature}
                  // error={true}
                  name="temperature"
                  fullWidth
                  variant="filled"
                  onChange={handleChangeInput}
                  type="number"
                  //   min={0}
                />
              </Grid>
              {!checked && (
                <Grid item xs={6}>
                  <TextField
                    required={formData.temperature ? true : false}
                    id="outlined-required"
                    label="Time of observation"
                    type="time"
                    //   defaultValue="Hello World"
                    value={formData.temperatureTime}
                    // error={true}
                    name="temperatureTime"
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
                    //   defaultValue="Hello World"
                    value={givenTime}
                    // error={true}
                    name="givenTime"
                    fullWidth
                    variant="filled"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      // console.log("Input Time", event.target.value);
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
}
