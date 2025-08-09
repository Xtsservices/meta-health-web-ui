import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@mui/styles";
import discharge_gif from "./../../../../../src/assets/dischargePatient/discharge_summary_gif.gif";
import FormControl from "@mui/material/FormControl";
import { TimelineType } from "../../../../types";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
const useStyles = makeStyles({
  dialogPaper: {
    width: "900px",
    minWidth: "900px",
  },
});

type dischargeDialog = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  timelineData: TimelineType;
};
export default function TimeLineDailog({
  open,
  setOpen,
  timelineData,
}: dischargeDialog) {
  //   const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  console.log("timelineData", timelineData);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="alert-dialog-title">
          Patient TimeLine Summary
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: "20px" }}>
            <Grid item container xs={9} spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-required"
                  label={
                    timelineData.diagnosis ? "Final Diagnosis" : "Symptoms"
                  }
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  disabled
                  value={
                    timelineData.diagnosis
                      ? timelineData.diagnosis
                      : timelineData.symptomsDetails?.length
                      ? timelineData.symptomsDetails
                          .map(
                            (symptom) =>
                              `${symptom.symptom} - ${symptom.duration} ${symptom.durationParameter}`
                          )
                          .join("\n")
                      : "Diagnosis or Symptoms data not available"
                  }
                />
              </Grid>

              {timelineData.followUpDate && (
                <>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Grid item xs={6}>
                        <TextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          id="outlined-required"
                          label="Follow up Date"
                          variant="outlined"
                          fullWidth
                          type="text"
                          value={timelineData?.followUp ? "Yes" : "No"}
                        />
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="outlined-required"
                      label="Follow up Date"
                      variant="outlined"
                      fullWidth
                      type="text"
                      value={timelineData.followUpDate?.split("T")[0]}
                    />
                  </Grid>
                </>
              )}

              {/* <Item>xs=8</Item> */}
            </Grid>
            <Grid item container xs={3} height={1}>
              <Grid xs={12} height={1}>
                <img
                  src={discharge_gif}
                  alt=" "
                  style={{
                    margin: "o 1rem",
                    height: "15rem",
                    width: "13rem",
                    objectFit: "contain",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
