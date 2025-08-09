import React, { useState } from "react";
import { CloudUpload, Add } from "@mui/icons-material";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Button,
  Stack,
} from "@mui/material";
import styles from "./PatientRegistration.module.scss";

type FormValues = {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  address: string;
  upload: File | null;
  uploadIncident: File | null;
  uploadPolicy: File | null;
};

const PatientRegistration = ({ onSubmit }: { onSubmit: () => void }) => {
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    address: "",
    upload: null,
    uploadIncident: null,
    uploadPolicy: null,
  });

  const [accepted, setAccepted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormValues
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormValues({ ...formValues, [field]: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accepted) {
      alert(`Email: ${formValues.email}\nTerms Accepted: ${accepted}`);
    } else {
      alert("Please accept the Terms and Conditions.");
    }
  };

  const handleCancel = () => {
    setFormValues({
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      address: "",
      upload: null,
      uploadIncident: null,
      uploadPolicy: null,
    });
    setAccepted(false);
  };

  return (
    <div className={styles.patientRegistrationContainer}>
      <div className={styles.header}>
        <span>Patient ID: IDR985678</span>
      </div>

      <h3 className={styles.title}>Policyholder Information</h3>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* First Name and Last Name */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              name="firstName"
              value={formValues.firstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={formValues.lastName}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Contact Number and Email */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact Number"
              variant="outlined"
              name="contactNumber"
              value={formValues.contactNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="E-mail Address"
              variant="outlined"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Grid>

          {/* Upload Patient Images */}
          <Grid item xs={12}>
            <label htmlFor="upload" className={styles.label}>
              Upload Patient Images in Hospital*
            </label>
            <div
              className={styles.uploadSection}
              onClick={() => document.getElementById("upload")?.click()}
            >
              <CloudUpload className={styles.cloudIcon} />
              <span className={styles.browseText}>
                Browse and choose a file to upload from your computer
              </span>
              <input
                type="file"
                id="upload"
                name="upload"
                className={styles.fileInput}
                onChange={(e) => handleFileChange(e, "upload")}
              />
              <button type="button" className={styles.addButton}>
                <Add className={styles.addIcon} />
              </button>
            </div>
          </Grid>

          {/* Horizontal Line */}
          <Grid item xs={12} sx = {{padding:"10px"}}>
            <div
              style={{ borderTop: "1px solid #ccc", margin: "10px 0" }}
            ></div>
        

          <Box mt={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: "16px", color: "#333" }}
            >
              Insurance Provider Details
            </Typography>

            {/* Insurance ID, Provider, Type, Incident Date, and Description */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Insurance ID"
                  variant="outlined"
                  placeholder="Enter policy ID"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Insurance Provider"
                  variant="outlined"
                  placeholder="Enter the provider name"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Insurance Type"
                  variant="outlined"
                  placeholder="Enter insurance type"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Incident Date & Time"
                  variant="outlined"
                  placeholder="Enter incident date & time"
                />
              </Grid>

              {/* Description of Incident */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description of the Incident"
                  variant="outlined"
                  placeholder="Enter description of the incident"
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Location */}
              {/* <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  variant="outlined"
                  placeholder="Enter location"
                />
              </Grid> */}

              {/* Upload Incident and Policy Documents */}

              <Grid item xs={6}>
                <label htmlFor="uploadIncident" className={styles.label}>
                  Upload Incident Images*
                </label>
                <div
                  className={styles.uploadSection}
                  onClick={() =>
                    document.getElementById("uploadIncident")?.click()
                  }
                >
                  <CloudUpload className={styles.cloudIcon} />
                  <span className={styles.browseText}>
                    Browse and choose a file to upload from your computer
                  </span>
                  <input
                    type="file"
                    id="uploadIncident"
                    name="uploadIncident"
                    className={styles.fileInput}
                    onChange={(e) => handleFileChange(e, "uploadIncident")}
                  />
                  <button
                    type="button"
                    className={`${styles.addButton} ${styles.blueBackground}`}
                  >
                    <Add className={styles.addIcon} />
                  </button>
                </div>
              </Grid>

              <Grid item xs={6}>
                <label htmlFor="uploadPolicy" className={styles.label}>
                  Upload Policy Documents*
                </label>
                <div
                  className={styles.uploadSection}
                  onClick={() =>
                    document.getElementById("uploadPolicy")?.click()
                  }
                >
                  <CloudUpload className={styles.cloudIcon} />
                  <span className={styles.browseText}>
                    Browse and choose a file to upload from your computer
                  </span>
                  <input
                    type="file"
                    id="uploadPolicy"
                    name="uploadPolicy"
                    className={styles.fileInput}
                    onChange={(e) => handleFileChange(e, "uploadPolicy")}
                  />
                  <button
                    type="button"
                    className={`${styles.addButton} ${styles.orangeBackground}`}
                  >
                    <Add className={styles.addIcon} />
                  </button>
                </div>
              </Grid>

              {/* Receiver Mail ID and Terms Acceptance */}
              {/* <Grid item xs={12}>
                <Typography variant="body1">Receiver Mail ID</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Enter Email"
                  variant="outlined"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I accept the Terms & Conditions above."
                />
              </Grid> */}

              {/* Submit and Cancel Buttons */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  width: "100%",
                }}
              >
                <Stack
                  direction="row"
                  spacing={5}
                  sx={{
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCancel}
                    sx={{
                      padding: "6px 46px",
                      width: "fit-content",
                      borderRadius: "20px",
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={onSubmit}
                    sx={{
                      padding: "6px 46px",
                      width: "fit-content",
                      borderRadius: "20px",
                      textTransform: "none",
                    }}
                  >
                    Submit
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default PatientRegistration;
