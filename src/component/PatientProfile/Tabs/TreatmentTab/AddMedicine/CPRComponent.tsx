import CPR from "../../../../../assets/treatmentPlan/procedures/cpr/CPR.png";
import {
  DialogContent,
  Box,
  FormControl,
  Grid,
  Checkbox,
  TextField,
} from "@mui/material";
import styles from "../TreatmentTab.module.scss";
import SelectComponent from "./SelectComponent";
import { CPRComponentProps } from "../../../../../interfaces/procedures";
import timer_cpr from "../../../../../assets/treatmentPlan/procedures/cpr/timer_cpr.png";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useState } from "react";

const CPRComponent: React.FC<CPRComponentProps> = ({
  procedureSelected,
  handleProcedure,
  proceduresOptions,
  commonMenuProps,
  cprData,
  handleChangeForCPR,
}) => {
  
  const [, setElapsedTime] = useState<number>(0);

  return (
    <DialogContent sx={{ height: "550px" }}>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-start"
        flexDirection="row"
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3
            style={{
              fontWeight: "bold",
              fontSize: "25px",
            }}
          >
            Cardiopulmonary Resuscitation (CPR) Time Record
          </h3>
          <p style={{ fontWeight: 400 }}>
            Manually enter the CPR duration or let the system set the default
            time. Choose your preference below to proceed
          </p>
        </div>

        <img src={CPR} alt="CPR image" className={styles.backgroundImageCPR} />
      </Box>
      {/* select functionality for procedures */}
      <SelectComponent
        label="Select Procedures"
        name="procedure"
        value={procedureSelected}
        onChange={handleProcedure}
        options={proceduresOptions}
        MenuProps={commonMenuProps}
      />
      <FormControl
        sx={{
          background: "#F6FAFF",
          borderRadius: "16px",
          mt: "5px",
          mb: "5px",
          height: "180px",
          paddingRight: "5px",
        }}
        fullWidth
      >
        <br />
        <Grid
          container
          alignItems="center"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Grid item>
              <Checkbox
                id="custom-cpr-checkbox"
                checked={cprData.customCPR}
                onChange={handleChangeForCPR}
                name="customCPR"
                sx={{
                  "&.Mui-checked": {
                    color: "blue", // Change tick and border color when checked
                  },
                  "& .MuiSvgIcon-root": {
                    color: cprData.customCPR ? "#1977F3" : "default", // Ensure tick color updates
                  },
                }}
              />
            </Grid>

            <Grid item>
              <label htmlFor="custom-cpr-checkbox" style={{ fontWeight: 500, marginTop:"6px" }}>
                I want to set a custom CPR Duration
              </label>
            </Grid>
          </div>
          <img
            src={timer_cpr}
            alt="cpr timer"
            style={{ justifySelf: "flex-end", width: "20px" }}
          />
        </Grid>
        {!cprData.customCPR && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "80px",
            }}
          >
            <CountdownCircleTimer
              isPlaying
              duration={10000}
              strokeWidth={2}
              size={100}
              colors={"#00C2FF"}
              onUpdate={(time) => setElapsedTime(1000 - time)}
            >
              {({ elapsedTime }) => {
                const minutes = Math.floor(elapsedTime / 60);
                const seconds = Math.floor(elapsedTime % 60);
                return (
                  <span style={{ color: "#00C2FF" }}>
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                  </span>
                );
              }}
            </CountdownCircleTimer>
          </div>
        )}

        <br />
        {cprData.customCPR && (
          <Grid style={{ display: "flex", padding: "5px" }} alignItems="center">
            <label style={{ fontWeight: "bold", marginRight: "10px" }}>
              Minutes:
            </label>
            <TextField
              type="text"
              placeholder="Enter Minutes"
              name="cprDuration"
              style={{ border: "0.5px solid #A6A6A6", width: "200px", borderRadius:"10px"}}
              onChange={handleChangeForCPR}
              value={cprData.cprDuration}
            />
          </Grid>
        )}
      </FormControl>
      <p style={{ fontWeight: 200 }}>
        If you do not select the custom time option, the system will
        automatically use the default CPR duration when you submit.
      </p>

      <Grid item xs={12}>
        <TextField
          label="Note"
          multiline
          rows={3}
          variant="outlined"
          type="text"
          fullWidth
          name="cprNote"
          onChange={handleChangeForCPR}
          value={cprData.cprNote}
        />
      </Grid>
    </DialogContent>
  );
};

export default CPRComponent;
