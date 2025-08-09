import styles from "./TriageNonTraumaForm.module.scss";

import React, { useCallback, useContext, useEffect } from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
} from "@mui/material";
import TriageFormContext from "../contexts/TriageFormContext";
import { useNavigate } from "react-router-dom";
import { NonTraumaErrorsType, NonTraumaFormType } from "../contexts/types";
import { useWebSocket } from "../contexts/WebSocketContext";
import { TriageLastKnownSequence } from "../contexts/contants";

const validateForm = (data: NonTraumaFormType) => {
  const errors = {
    poisoningCause: "",
    burnPercentage: "",
    feverSymptoms: "",
  } as NonTraumaErrorsType;

  if (data.poisoning && data.poisoningCause === "")
    errors.poisoningCause = "This field is required.";

  if (data.burn && !data.burnPercentage)
    errors.burnPercentage = "This field is required.";

  if (data.pregnancy && !data.trimester)
    errors.trimester = "This field is required.";

  if (data.internalBleeding && !data.internalBleedingCause)
    errors.internalBleedingCause = "This field is required.";

  if (data.burn && isNaN(parseFloat(data.burnPercentage)))
    errors.burnPercentage = "Burn percentage should be numeric.";
  else if (
    data.burn &&
    (parseFloat(data.burnPercentage) > 100 ||
      parseFloat(data.burnPercentage) < 0)
  )
    errors.burnPercentage = "Burn percent must be between 0 and 100";
  if (data.fever && !data.feverSymptoms)
    errors.feverSymptoms = "This field is required.";
  return errors;
};

const TriageNonTraumaForm: React.FC = () => {
  const { formData, setFormData } = useContext(TriageFormContext);

  const { nonTrauma } = formData;
  const { nonTrauma: errors } = formData.errors;
  const navigate = useNavigate();

  const back = () => navigate(-1);

  const {
    sendMessage,
    receivedMessage,
    isMessageConsumed,
    setIsMessageConsumed,
  } = useWebSocket();

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown; type: string }
      >
    ) => {
      const { name, value, type } = event.target;
      const data = {
        ...formData.nonTrauma,
        [name as string]:
          type === "checkbox"
            ? (event.target as HTMLInputElement).checked
            : value,
      };

      if (!data.pregnancy) {
        data.trimester = "";
        data.pregnancyIssue = "";
      }

      const errors = validateForm(data);

      setFormData((prev) => ({
        ...prev,
        nonTrauma: {
          ...data,
        },
        errors: {
          ...prev.errors,
          nonTrauma: {
            ...errors,
          },
        },
      }));
    },
    [setFormData, formData]
  );

  const handleSelectionChange = (e: unknown) =>
    handleInputChange(
      e as React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown; type: string }
      >
    );

  const handleSubmit = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      let hasErrors = false;
      const errs = validateForm(formData.nonTrauma);

      Object.keys(errs).forEach((k) => {
        if (errs[k as keyof NonTraumaErrorsType]) hasErrors = true;
      });

      if (hasErrors) {
        setFormData((p) => ({
          ...p,
          errors: { ...p.errors, nonTrauma: errs },
        }));
        return;
      }

      sendMessage({ type: "nonTrauma", data: formData.nonTrauma });
    },
    [formData.nonTrauma, sendMessage, setFormData]
  );

  useEffect(() => {
    setFormData((p) => ({
      ...p,
      lastKnownSequence: TriageLastKnownSequence.NON_TRAUMA,
    }));
  }, [setFormData]);

  useEffect(() => {
    if (receivedMessage !== null && !isMessageConsumed) {
      setIsMessageConsumed(true);
      const zone = receivedMessage.zone;
      if (zone) {
        setFormData((p) => ({ ...p, zone: zone }));
        navigate("./../zone-form");
      }
    }
  }, [
    isMessageConsumed,
    navigate,
    receivedMessage,
    setFormData,
    setIsMessageConsumed,
  ]);

  return (
    <div className={styles.container}>
      <h3>Non Trauma Form</h3>

      <form className={styles.container_grids}>
        <div className={styles.grid}>
          <div className={styles.gridItemFull}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={nonTrauma.pregnancy}
                  onChange={handleInputChange}
                  name="pregnancy"
                />
              }
              label="Pregnancy"
            />
            {nonTrauma.pregnancy && (
              <FormControl fullWidth required>
                <InputLabel id="trimester">Trimester</InputLabel>
                <Select
                  label="Trimester"
                  value={nonTrauma.trimester}
                  onChange={handleSelectionChange}
                  name="trimester"
                  error={!!errors.trimester}
                  required
                >
                  <MenuItem value="first">First</MenuItem>
                  <MenuItem value="second">Second</MenuItem>
                  <MenuItem value="third">Third</MenuItem>
                </Select>
                {!!errors.trimester && (
                  <FormHelperText error>{errors.trimester}</FormHelperText>
                )}
              </FormControl>
            )}
          </div>

          {nonTrauma.pregnancy && nonTrauma.trimester && (
            <div className={styles.gridItem}>
              <FormControl fullWidth required>
                <InputLabel id="pregnancyIssue">Pregnancy Issue</InputLabel>
                <Select
                  label="pregnancyIssue"
                  value={nonTrauma.pregnancyIssue}
                  onChange={handleSelectionChange}
                  name="pregnancyIssue"
                  required
                >
                  <MenuItem value="abdominal pain">Abdominal Pain</MenuItem>
                  <MenuItem value="vaginal bleeding">Vaginal Bleeding</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
          {/* {nonTrauma.pregnancy &&
            nonTrauma.trimester &&
            nonTrauma.pregnancyIssue && (
              <div
                style={{
                  gridColumn: "2",
                  display: "flex",
                  justifyContent: "end",
                  paddingRight: "1.5rem",
                }}
              >
                <button onClick={handleSubmit}>next</button>
              </div>
            )} */}
        </div>

        {!(
          nonTrauma.pregnancy &&
          nonTrauma.trimester &&
          nonTrauma.pregnancyIssue
        ) && (
          <>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.breathlessness}
                      onChange={handleInputChange}
                      name="breathlessness"
                    />
                  }
                  label="Breathlessness"
                />
              </div>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.edema}
                      onChange={handleInputChange}
                      name="edema"
                    />
                  }
                  label="Edema"
                />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.internalBleeding}
                      onChange={handleInputChange}
                      name="internalBleeding"
                    />
                  }
                  label="Internal Bleeding"
                />
              </div>
              <div className={styles.gridItemFull}>
                {nonTrauma.internalBleeding && (
                  <FormControl fullWidth>
                    <InputLabel id="bleedingCause">Bleeding Cause</InputLabel>
                    <Select
                      label="Bleeding Cause"
                      value={nonTrauma.internalBleedingCause}
                      onChange={handleSelectionChange}
                      name="internalBleedingCause"
                      error={!!errors.internalBleedingCause}
                      required
                    >
                      <MenuItem value="noseEnt">Nose & ENT</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="pr">P/R</MenuItem>
                    </Select>
                    {errors.internalBleedingCause && (
                      <FormHelperText error>
                        {errors.internalBleedingCause}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.poisoning}
                      onChange={handleInputChange}
                      name="poisoning"
                    />
                  }
                  label="Poisoning"
                />
              </div>
              <div className={styles.gridItemFull}>
                {nonTrauma.poisoning && (
                  <FormControl fullWidth>
                    <InputLabel id="poisoning-cause">Poison Cause</InputLabel>
                    <Select
                      value={nonTrauma.poisoningCause}
                      onChange={handleSelectionChange}
                      name="poisoningCause"
                      required
                      label={"Poison Cause"}
                      error={!!errors.poisoningCause}
                    >
                      <MenuItem value="snake">Snake</MenuItem>
                      <MenuItem value="scorpion">Scorpion</MenuItem>
                      <MenuItem value="others">Others</MenuItem>
                    </Select>
                    {errors.poisoningCause && (
                      <FormHelperText error>
                        {errors.poisoningCause}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.burn}
                      onChange={handleInputChange}
                      name="burn"
                    />
                  }
                  label="Burn"
                />
              </div>
              <div className={styles.gridItemFull}>
                {nonTrauma.burn && (
                  <TextField
                    type="number"
                    label="Burn Percentage"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={nonTrauma.burnPercentage}
                    onChange={handleInputChange}
                    name="burnPercentage"
                    required
                    error={!!errors.burnPercentage}
                    helperText={errors.burnPercentage}
                  />
                )}
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.hanging}
                      onChange={handleInputChange}
                      name="hanging"
                    />
                  }
                  label="Hanging"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.drowning}
                      onChange={handleInputChange}
                      name="drowning"
                    />
                  }
                  label="Drowning"
                />
              </div>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.electrocution}
                      onChange={handleInputChange}
                      name="electrocution"
                    />
                  }
                  label="Electrocution"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.heatStroke}
                      onChange={handleInputChange}
                      name="heatStroke"
                    />
                  }
                  label="Heat Stroke"
                />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.fever}
                      onChange={handleInputChange}
                      name="fever"
                    />
                  }
                  label="Fever"
                />
              </div>
              <div className={styles.gridItemFull}>
                {nonTrauma.fever && (
                  <FormControl fullWidth>
                    <InputLabel id="fever-symptoms">Symptoms</InputLabel>
                    <Select
                      value={nonTrauma.feverSymptoms}
                      onChange={handleSelectionChange}
                      name="feverSymptoms"
                      label={"Symptoms"}
                      required
                      error={!!errors.feverSymptoms}
                    >
                      <MenuItem value="headache">Headache</MenuItem>
                      <MenuItem value="chest pain">Chest Pain</MenuItem>
                      <MenuItem value="jaundice">Jaundice</MenuItem>
                      <MenuItem value="chemotherapy">Chemotherapy</MenuItem>
                      <MenuItem value="hiv">HIV</MenuItem>
                      <MenuItem value="diabetic">Diabetic</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>

                    {errors.feverSymptoms && (
                      <FormHelperText error>
                        {errors.feverSymptoms}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.drugOverdose}
                      onChange={handleInputChange}
                      name="drugOverdose"
                    />
                  }
                  label="Drug Overdose"
                />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.stoolPass}
                      onChange={handleInputChange}
                      name="stoolPass"
                    />
                  }
                  label="Stool Pass"
                />
              </div>

              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.urinePass}
                      onChange={handleInputChange}
                      name="urinePass"
                    />
                  }
                  label="Urine Pass"
                />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.swellingWound}
                      onChange={handleInputChange}
                      name="swellingWound"
                    />
                  }
                  label="Swelling or Wound"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.coughCold}
                      onChange={handleInputChange}
                      name="coughCold"
                    />
                  }
                  label="Cough or Cold"
                />
              </div>

              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.dizziness}
                      onChange={handleInputChange}
                      name="dizziness"
                    />
                  }
                  label="Dizziness"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.headache}
                      onChange={handleInputChange}
                      name="headache"
                    />
                  }
                  label="Headache"
                />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.skinRash}
                      onChange={handleInputChange}
                      name="skinRash"
                    />
                  }
                  label="Skin Rash"
                />
              </div>
              <div className={styles.gridItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nonTrauma.medicoLegalExamination}
                      onChange={handleInputChange}
                      name="medicoLegalExamination"
                    />
                  }
                  label="For Medico-Legal Examination"
                />
              </div>
            </div>
          </>
        )}
      </form>
      <div className={styles.container_bottom}>
        <button onClick={back}>Back</button>
        {/* {!(
          nonTrauma.pregnancy &&
          nonTrauma.pregnancyIssue &&
          nonTrauma.trimester
        ) &&  */}
        <button onClick={handleSubmit}>Submit</button>
        {/* } */}
      </div>
    </div>
  );
};

export default TriageNonTraumaForm;
