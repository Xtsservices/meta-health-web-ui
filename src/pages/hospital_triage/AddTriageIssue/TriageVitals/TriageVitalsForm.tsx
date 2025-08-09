import styles from "./triageVitals.module.scss";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import TriageFormContext from "../contexts/TriageFormContext";
import React, { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zoneType } from "../../../../utility/role";
import { VitalsFormType } from "../contexts/types";
import { TriageLastKnownSequence } from "../contexts/contants";
import { useWebSocket } from "../contexts/WebSocketContext";

const validateForm = ({
  vitals: data,
  isSubmission = false,
}: {
  vitals: VitalsFormType;
  isSubmission?: boolean;
}) => {
  const errors = {
    oxygen: "",
    pulse: "",
    temperature: "",
    respiratoryRate: "",
    bpH: "",
    bpL: "",
  };

  if (data.oxygen || isSubmission) {
    if (data.oxygen < 50) errors.oxygen = "Oxygen value should be >= 50";
    else if (data.oxygen > 100) errors.oxygen = "Oxygen value should be <= 100";
  }

  if (data.bpH || isSubmission) {
    if (data.bpL && data.bpH < data.bpL)
      errors.bpH = "High value should be greater than low value";
    else if (data.bpH > 400) errors.bpH = "High value should be <= 400";
    else if (data.bpH < 50) errors.bpH = "High value should be >= 50";
  }

  if (data.bpL || isSubmission) {
    if (data.bpH && data.bpH < data.bpL)
      errors.bpL = "Low value should be less than high value";
    else if (data.bpL > 300) errors.bpL = "Low value should be <= 300";
    else if (data.bpL < 30) errors.bpL = "Low value should be >= 30";
  }

  if (data.pulse || isSubmission) {
    if (data.pulse < 30) errors.pulse = "Pulse value should be >= 30";
    else if (data.pulse > 300) errors.pulse = "Pulse value should be <= 300";
  }

  if (data.temperature || isSubmission) {
    if (data.temperature < 20)
      errors.temperature = "Temperature value should be >= 20";
    else if (data.temperature > 45)
      errors.temperature = "Temperature value should be <= 45";
  }

  if (data.respiratoryRate || isSubmission) {
    if (data.respiratoryRate < 1)
      errors.respiratoryRate = "Respiratory Rate value should be >= 1";
    else if (data.respiratoryRate > 50)
      errors.respiratoryRate = "Respiratory Rate value should be <= 50";
  }

  const hasErrors = Object.entries(errors).some(([, value]) => !!value);

  return { errors, hasErrors };
};

// const getTime = (time: string): string => {
//   if (!isNaN(Number(time))) return '';
//   const date = new Date(time);
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   return `${hours}:${minutes}`;
// };

const TriageVitalsForm = () => {
  const { formData, setFormData } = useContext(TriageFormContext);
  const {
    vitals,
    errors: { vitals: errs },
  } = formData;
  const navigate = useNavigate();
  const {
    sendMessage,
    receivedMessage,
    isMessageConsumed,
    setIsMessageConsumed,
  } = useWebSocket();

  const handleNext = useCallback(() => {
    const { errors, hasErrors } = validateForm({ vitals, isSubmission: true });

    if (hasErrors) {
      setFormData((prev) => ({
        ...prev,
        errors: { ...prev.errors, vitals: { ...errors } },
      }));
      return;
    }
    sendMessage({ type: "vitals", data: formData.vitals });
  }, [vitals, sendMessage, formData.vitals, setFormData]);

  useEffect(() => {
    if (receivedMessage !== null && !isMessageConsumed) {
      setIsMessageConsumed(true);
      const zone = receivedMessage.zone;
      if (zone) {
        setFormData((p) => ({ ...p, zone: zone }));
        if (zone === zoneType.red) navigate("./../zone-form");
        else navigate("./../abcd");
      }
    }
  }, [
    isMessageConsumed,
    navigate,
    receivedMessage,
    setFormData,
    setIsMessageConsumed,
  ]);

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown; type: string }
      >
    ) => {
      const { name } = event.target;
      let { value } = event.target;
      const intArray = [
        "pulse",
        "temperature",
        "oxygen",
        "bpH",
        "bpL",
        "respiratoryRate",
      ];
      value = intArray.includes(name as string)
        ? value
          ? Number(value)
          : ""
        : value;

      const { errors } = validateForm({
        vitals: { ...vitals, [name as string]: value },
      });
      const time = String(Date.now());

      setFormData((prevFormData) => ({
        ...prevFormData,
        vitals: {
          ...prevFormData.vitals,
          [name as string]: value,
          time: time,
        },
        errors: {
          ...prevFormData.errors,
          vitals: {
            ...prevFormData.errors.vitals,
            ...errors,
          },
        },
      }));
    },
    [vitals, setFormData]
  );

  const back = () => navigate(-1);

  useEffect(() => {
    setFormData((d) => ({
      ...d,
      lastKnownSequence: TriageLastKnownSequence.VITALS,
    }));
  }, [setFormData]);

  useEffect(() => {
    setFormData((d) => ({
      ...d,
      vitals: { ...d.vitals, time: String(Date.now()) },
    }));
  }, [setFormData]);

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <Grid
          container
          sx={{ mt: "2rem" }}
          width={"100%"}
          columnSpacing={2}
          rowGap={2}
          alignItems={"center"}
        >
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Oxygen(%)"
              value={vitals.oxygen || ""}
              name="oxygen"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
              type="text"
              error={!!errs.oxygen}
              helperText={errs.oxygen}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              id="outlined-required"
              label="Blood Pressure High(mm Hg)"
              value={vitals.bpH || ""}
              required={vitals.bpL ? true : false}
              name="bpH"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
              type="text"
              error={!!errs.bpH}
              helperText={errs.bpH}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              id="outlined-required"
              label="Low(mm Hg)"
              value={vitals.bpL || ""}
              required={vitals.bpH ? true : false}
              name="bpL"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
              type="text"
              error={!!errs.bpL}
              helperText={errs.bpL}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Pulse(bpm)"
              value={vitals.pulse || ""}
              name="pulse"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
              type="text"
              inputProps={{
                step: "0.01",
              }}
              error={!!errs.pulse}
              helperText={errs.pulse}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Temperature(&deg;celsius)"
              value={vitals.temperature || ""}
              name="temperature"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
              type="text"
              inputProps={{
                step: "0.01", // Allows decimal values with 2 decimal places
              }}
              error={!!errs.temperature}
              helperText={errs.temperature}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Respiratory Rate (per min)"
              value={vitals.respiratoryRate || ""}
              name="respiratoryRate"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
              type="text"
              error={!!errs.respiratoryRate}
              helperText={errs.respiratoryRate}
            />
          </Grid>

          {/* <Grid item xs={12}>
            <TextField
              disabled
              label="Time of observation"
              type="time"
              value={vitals.time ? getTime(vitals.time) : ''}
              name="givenTime"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid> */}
        </Grid>
      </form>

      <div className={styles.bottom}>
        <button onClick={back}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default TriageVitalsForm;
