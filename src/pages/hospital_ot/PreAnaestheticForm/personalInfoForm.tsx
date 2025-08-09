import React from "react";
import { TextField, Container, Grid } from "@mui/material";
import { PreAnaestheticData } from "./preAnaestheticForm";

function PersonalInfoForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    age: "",
    sex: "",
    weight: "",
    height: "",
    OT: "",
    unit: "",
    date: '',
    diagnosis: "",
    surgery: "",
    ipNo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name:field, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    PreAnaestheticData[field]=value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Height"
              name="height"
              value={formData.height}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="OT"
              name="OT"
              value={formData.OT}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Surgery"
              name="surgery"
              value={formData.surgery}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="IP No."
              name="ipNo"
              value={formData.ipNo}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default PersonalInfoForm;
