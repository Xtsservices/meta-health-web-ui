import React, { useState } from "react";
import {
  FormControlLabel,
  Checkbox,
  TextField,
  Container,
  Grid,
} from "@mui/material";
import { PreAnaestheticData } from "./preAnaestheticForm";

function HistoryForm () {
  const [formData, setFormData] = useState({
    diabetesMellitus: false,
    tb: false,
    palpitation: false,
    drugSensitivity: false,
    syncopalAttack: false,
    cav: false,
    jaundice: false,
    smokingAlcoholDrugAbuse: false,
    backache: false,
    bleedingTendency: false,
    allergy: "",
    lastMeal: Date.now(),
    convulsions: false,
    asthma: false,
    breathlessness: false,
    anaestheticExposure: false,
    hypertension: false,
    ischemicHeartDiseases: false,
    hospitalisation: false,
    anyOther: "",
    presentMedication: "",
    coughSputum: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name:field, value, checked, type } = e.target;
    if (field && type==="checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [field]: checked ? value : "",
      }));
      PreAnaestheticData[field] = checked;
    } else if (field) {
      // For other inputs, handle the value change
      setFormData((prevState) => ({
        ...prevState,
        [field]: value as string, // Assuming value is always a string here
      }));
      PreAnaestheticData[field] = value;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, for example, send data to backend
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="diabetesMellitus"
                  checked={formData.diabetesMellitus}
                  onChange={handleChange}
                />
              }
              label="Diabetes Mellitus"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="tb"
                  checked={formData.tb}
                  onChange={handleChange}
                />
              }
              label="TB"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="palpitation"
                  checked={formData.palpitation}
                  onChange={handleChange}
                />
              }
              label="Palpitation"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="drugSensitivity"
                  checked={formData.drugSensitivity}
                  onChange={handleChange}
                />
              }
              label="H/o Drug sensitivity scoline"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="syncopalAttack"
                  checked={formData.syncopalAttack}
                  onChange={handleChange}
                />
              }
              label="Syncopal attack"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="cav"
                  checked={formData.cav}
                  onChange={handleChange}
                />
              }
              label="H/o CAV"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="jaundice"
                  checked={formData.jaundice}
                  onChange={handleChange}
                />
              }
              label="Jaundice"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="smokingAlcoholDrugAbuse"
                  checked={formData.smokingAlcoholDrugAbuse}
                  onChange={handleChange}
                />
              }
              label="H/o smoking/alcohol/drug-abuse"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="backache"
                  checked={formData.backache}
                  onChange={handleChange}
                />
              }
              label="H/o backache"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="bleedingTendency"
                  checked={formData.bleedingTendency}
                  onChange={handleChange}
                />
              }
              label="H/o bleeding tendency"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="convulsions"
                  checked={formData.convulsions}
                  onChange={handleChange}
                />
              }
              label="Convulsions"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="asthma"
                  checked={formData.asthma}
                  onChange={handleChange}
                />
              }
              label="Asthma"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="breathlessness"
                  checked={formData.breathlessness}
                  onChange={handleChange}
                />
              }
              label="Breathlessness"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="anaestheticExposure"
                  checked={formData.anaestheticExposure}
                  onChange={handleChange}
                />
              }
              label="Anaesthetic exposure"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="hypertension"
                  checked={formData.hypertension}
                  onChange={handleChange}
                />
              }
              label="Hypertension"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="ischemicHeartDiseases"
                  checked={formData.ischemicHeartDiseases}
                  onChange={handleChange}
                />
              }
              label="Ichemic Heart Diseases"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="hospitalisation"
                  checked={formData.hospitalisation}
                  onChange={handleChange}
                />
              }
              label="Hospitalisation"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Allergy"
              name="allergy"
              value={formData.allergy}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="time"
              label="Time of Last Meal"
              name="lastMeal"
              value={formData.lastMeal}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Any Other"
              name="anyOther"
              value={formData.anyOther}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Present Medication"
              name="presentMedication"
              value={formData.presentMedication}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Cough/Sputum"
              name="coughSputum"
              value={formData.coughSputum}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default HistoryForm;
