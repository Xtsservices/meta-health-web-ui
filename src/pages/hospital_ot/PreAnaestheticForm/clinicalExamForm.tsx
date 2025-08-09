import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  Container,
  Grid,
} from "@mui/material";
import { PreAnaestheticData } from "./preAnaestheticForm";

function ClinicalExamForm(){
  const [formData, setFormData] = useState({
    built: "moderate",
    hydration: false,
    paltor: false,
    cyanosis: false,
    np: false,
    clubbing: false,
    pedalEdema: false,
    ascitis: false,
    nose: false,
    tmMovement: false,
    shortNeck: false,
    goitre: false,
    murmurs: false,
    cardiacEnlargements: false,
    liverSpleen: false,
    oralCavity: "",
    mouthOpening: "",
    teeth: "",
    trachea: "",
    cervicalSpineMovement: "",
    mallampatiGrade: "",
    spine: "",
    lungs: "",
    bp: "",
    pulseRate: "",
    rytm: "",
    rr: "",
    temperature: "",
    heartSounds: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name:field, value, checked, type } = e.target;
    if (field && type==="checked") {
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
            <FormControl fullWidth>
              <InputLabel id="built-label">Built</InputLabel>
              <Select
                labelId="built-label"
                id="built"
                name="built"
                label="Built"
                value={formData.built}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value,
                  }));
                }}
              >
                <MenuItem value="obese">Obese</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="thin">Thin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="hydration"
                  checked={formData.hydration}
                  onChange={handleChange}
                />
              }
              label="Hydration"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="paltor"
                  checked={formData.paltor}
                  onChange={handleChange}
                />
              }
              label="Paltor"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="cyanosis"
                  checked={formData.cyanosis}
                  onChange={handleChange}
                />
              }
              label="Cyanosis"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="np"
                  checked={formData.np}
                  onChange={handleChange}
                />
              }
              label="NP"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="clubbing"
                  checked={formData.clubbing}
                  onChange={handleChange}
                />
              }
              label="Clubbing"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="pedalEdema"
                  checked={formData.pedalEdema}
                  onChange={handleChange}
                />
              }
              label="Pedal Edema"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="ascitis"
                  checked={formData.ascitis}
                  onChange={handleChange}
                />
              }
              label="Ascitis"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="nose"
                  checked={formData.nose}
                  onChange={handleChange}
                />
              }
              label="Nose"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="tmMovement"
                  checked={formData.tmMovement}
                  onChange={handleChange}
                />
              }
              label="TM Movement"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="shortNeck"
                  checked={formData.shortNeck}
                  onChange={handleChange}
                />
              }
              label="Short Neck"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="goitre"
                  checked={formData.goitre}
                  onChange={handleChange}
                />
              }
              label="Goitre"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="mumurs"
                  checked={formData.murmurs}
                  onChange={handleChange}
                />
              }
              label="Murmurs"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="cardiacEnlargements"
                  checked={formData.cardiacEnlargements}
                  onChange={handleChange}
                />
              }
              label="Cardiac Enlargements"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="liverSpleen"
                  checked={formData.liverSpleen}
                  onChange={handleChange}
                />
              }
              label="Liver/Slpeen"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Oral Cavity"
              name="oralCavity"
              value={formData.oralCavity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Mouth Opening"
              name="mouthOpening"
              value={formData.mouthOpening}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Teeth (loose/protruding/missing-dentures)"
              name="teeth"
              value={formData.teeth}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Trachea"
              name="trachea"
              value={formData.trachea}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Cervical Spine Movement"
              name="cervicalSpineMovement"
              value={formData.cervicalSpineMovement}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="mallampati-grade-label">
                Mallampati Grade
              </InputLabel>
              <Select
                labelId="mallampati-grade-label"
                id="mallampatiGrade"
                name="mallampatiGrade"
                label="Mallampati Grade"
                value={formData.mallampatiGrade}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value,
                  }));
                }}
              >
                <MenuItem value="I">I</MenuItem>
                <MenuItem value="II">II</MenuItem>
                <MenuItem value="III">III</MenuItem>
                <MenuItem value="IV">IV</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Spine (Kyphosis/scoliosis)"
              name="spine"
              value={formData.spine}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Lungs"
              name="lungs"
              value={formData.lungs}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="BP"
              name="bp"
              value={formData.bp}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Pulse Rate"
              name="pulseRate"
              value={formData.pulseRate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Rytm"
              name="rytm"
              value={formData.rytm}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="RR"
              name="rr"
              value={formData.rr}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Temperature"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Heart Sounds"
              name="heartSounds"
              value={formData.heartSounds}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default ClinicalExamForm;
