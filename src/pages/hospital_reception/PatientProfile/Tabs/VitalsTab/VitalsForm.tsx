import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import { vitalsFormType1 } from "../../../../../types";

type formDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  doRemderAfterUpdate: (message: string) => void;
};

export default function VitalsFormDialog({ open, setOpen }: formDialogType) {
  const [checked, setChecked] = React.useState(false);

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
    respiratoryRate: 0,
    bpH: "",
    bpL: "",
    bpTime: "",
    oxygenTime: "",
    temperatureTime: "",
    pulseTime: "",
    respiratoryRateTime: "",
    hrv: 0,
    hrvTime: "",
  };
  const [formData, setFormData] = React.useState<vitalsFormType1>(initialState);
  const [givenTime, setGivenTime] = React.useState("");

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const intArray = ["pulse", "temperature", "oxygen"];

    let value: number | string = event.target.value;
    if (intArray.includes(name)) {
      value = Number(event.target.value);
    }

    if (name === "oxygen" && parseInt(event.target.value) > 100) {
      return;
    }
    if (name === "temperature" && parseInt(event.target.value) > 45) {
      return;
    }
    if (
      (name === "bpH" || name === "bpL" || name === "pulse") &&
      parseInt(event.target.value) > 200
    ) {
      return;
    }

    setFormData((state) => {
      return {
        ...state,
        [name]: value,
      };
    });
  };

  React.useEffect(() => {
    if (checked && givenTime) {
      setFormData((prev) => {
        return {
          ...prev,
          bpTime: givenTime,
          temperatureTime: givenTime,
          pulseTime: givenTime,
          oxygenTime: givenTime,
          respiratoryRateTime: givenTime,
        };
      });
    }
  }, [givenTime, checked]);

  const handleFormSubmit:
    | React.FormEventHandler<HTMLFormElement>
    | undefined = async (e) => {
    e.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const dialogStyles = {
    width: "800px",
    minWidth: "800px",
  };

  const dialogTitleStyles = {
    backgroundColor: "#1977f3",
    color: "white",
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: dialogStyles,
        }}
      >
        <DialogTitle style={dialogTitleStyles}>Add Vitals</DialogTitle>
        <form onSubmit={handleFormSubmit}>
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
              {/* ==============oxygen==== */}
              <Grid item xs={checked ? 12 : 6}>
                <TextField
                  id="outlined-required"
                  label="Oxygen(%)"
                  //   defaultValue="Hello World"
                  value={formData.oxygen || ""}
                  // error={true}
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

              {/* ==================rr================= */}
              <Grid item xs={checked ? 12 : 6}>
                <TextField
                  id="outlined-required"
                  label="Respiratory Rate(bpm)"
                  //   defaultValue="Hello World"
                  value={formData.respiratoryRate || ""}
                  // error={true}
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
                    //   defaultValue="Hello World"
                    required={formData.respiratoryRate ? true : false}
                    value={formData.respiratoryRateTime}
                    // error={true}
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
                  //   defaultValue="Hello World"
                  value={formData.bpH || ""}
                  required={formData.bpL ? true : false}
                  // error={true}
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
                  //   defaultValue="Hello World"
                  value={formData.bpL || ""}
                  required={formData.bpH ? true : false}
                  // error={true}
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
                  value={formData.pulse || ""}
                  // error={true}
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
                    //   defaultValue="Hello World"
                    value={formData.pulseTime}
                    // error={true}
                    name="pulseTime"
                    fullWidth
                    variant="filled"
                    onChange={handleChangeInput}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: 30,
                      max: 200,
                      step: "0.01",
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={checked ? 12 : 6}>
                <TextField
                  id="outlined-required"
                  label="Temperature(&deg;celsius)"
                  //   defaultValue="Hello World"
                  value={formData.temperature || ""}
                  // error={true}
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
