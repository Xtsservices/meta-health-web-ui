import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Container,
  Grid,
} from "@mui/material";
import { PreAnaestheticData } from "./preAnaestheticForm";

function InvestigationForm() {
  const [formData, setFormData] = useState({
    hb: "",
    hiv: false,
    bt: "",
    ct: "",
    prothrombinTime: "",
    urineAlbuminSugar: "",
    bloodSugar: "",
    bloodGroup: "",
    serumCreatinine: "",
    serumElectrolytes: "",
    lft: "",
    chestXRay: "",
    ecg: "",
    echo: "",
    other: "",
    opinion: "",
    asaGrade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name:field, value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [field]: field === "hiv" ? checked : value,
    }));
    if (field==="hiv"){
      PreAnaestheticData[field]=checked;
    }
    else {
      PreAnaestheticData[field]=value;
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
            <TextField
              fullWidth
              label="Hb%"
              name="hb"
              value={formData.hb}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="hiv"
                  checked={formData.hiv}
                  onChange={handleChange}
                />
              }
              label="HIV"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="BT"
              name="bt"
              value={formData.bt}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CT"
              name="ct"
              value={formData.ct}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Prothrombin Time"
              name="prothrombinTime"
              value={formData.prothrombinTime}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Urine-albumin/sugar"
              name="urineAlbuminSugar"
              value={formData.urineAlbuminSugar}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Blood sugar"
              name="bloodSugar"
              value={formData.bloodSugar}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="S.Creatinine"
              name="serumCreatinine"
              value={formData.serumCreatinine}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="S.Electrolytes"
              name="serumElectrolytes"
              value={formData.serumElectrolytes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="LFT"
              name="lft"
              value={formData.lft}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Chest X-Ray"
              name="chestXRay"
              value={formData.chestXRay}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ECG"
              name="ecg"
              value={formData.ecg}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="2D ECHO"
              name="echo"
              value={formData.echo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Other"
              name="other"
              value={formData.other}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Opinion"
              name="opinion"
              value={formData.opinion}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ASA grade"
              name="asaGrade"
              value={formData.asaGrade}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default InvestigationForm;
