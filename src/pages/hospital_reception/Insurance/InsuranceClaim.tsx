import React, { useState } from "react";
import styles from "./PatientRegistration.module.scss";
import { createTheme,ThemeProvider } from "@mui/material/styles";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stack,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CloudUpload, Add } from "@mui/icons-material";

const useStyles = makeStyles({
  dateInput: {
    '& input[type="date"]::-webkit-calendar-picker-indicator': {
      filter: "invert(55%) sepia(100%) saturate(800%) hue-rotate(15deg)",
    },
  },
});

const InsuranceClaim = ({ onSubmit }: { onSubmit: () => void }) => {
  const classes = useStyles();

  const [formValues, setFormValues] = useState({
    insuranceId: "",
    insuranceProvider: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    mailId: "",
    city: "",
    pincode: "",
    address: "",
    historyInsuranceId: "",
    historyInsuranceProvider: "",
    sumInsured: "",
    diagnosis: "",
    hospitalizedFirstName: "",
    hospitalizedLastName: "",
    hospitalizedGender: "",
    hospitalizedAge: "",
    relationship: "",
    occupation: "",
    hospitalizedMobileNumber: "",
    hospitalizedMailId: "",
    hospitalizedCity: "",
    hospitalizedPincode: "",
    hospitalizedAddress: "",
    covered: "",
    commencementDate: "",
    hospitalized: "",
    hospitalizedDate: "",
    hospitalizedInjuryType: "",
    injuryDate: "",
    medicoLegal: "",
    injureCause: "",
    hospitalizationDateOfAdmission: "",
    hospitalizationDateOfDischarge: "",
    hospitalizationCity: "",
    hospitalizationPincode: "",
    hospitalizationAddress: "",
    preHospitalizationExpenses: "",
    postHospitalizationExpenses: "",
    claimDateOfAdmission: "",
    claimDateOfDischarge: "",
    panCard: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    chequeDetails: "",
    ifscCode: "",
    claimDocuments: {
      claimForm: false,
      hospitalBreakupBill: false,
      oecg: false,
      operationTheatreNote: false,
      doctorRequestForInvestigation: false,
      mriCtUsghpg: false,
      hospitalMainBill: false,
      hospitalBillPaymentReceipt: false,
      pharmacyBill: false,
      claimIntimationCopy: false,
      dischargeBill: false,
      doctorsPrescription: false,
      others: false,
      claimUpload: false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      claimDocuments: {
        ...prevState.claimDocuments,
        [name]: checked,
      },
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormValues((prevState) => ({
      ...prevState,
      claimDocuments: {
        ...prevState.claimDocuments,
        [field]: file, // Dynamically set the file for the specific field
      },
    }));
  };

  const handleCancel = () => {};
  console.log("formValues", formValues);

// radio button theme color to avoid repeating 

const theme = createTheme({
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": { color: "#1977F3" }, // Default color
          "&.Mui-checked .MuiSvgIcon-root": { color: "#1977F3" }, // Checked color
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": { color: "#1977F3" }, // Default color
          "&.Mui-checked .MuiSvgIcon-root": { color: "#1977F3" }, // Checked color
        },
    },
  },
} });

  return (
    <div className={styles.patientRegistrationContainer}>
      <div className={styles.header}>
        <span>Patient ID: IDR985678</span>
      </div>
      <h3 className={styles.title}>Details Of The Primary Insured</h3>
      <form className={styles.form}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Insurance ID"
              variant="outlined"
              name="insuranceId"
              value={formValues.insuranceId}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Insurance Provider"
              variant="outlined"
              name="insuranceProvider"
              value={formValues.insuranceProvider}
              onChange={handleInputChange}
            />
          </Grid>
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
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              variant="outlined"
              name="mobileNumber"
              value={formValues.mobileNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Mail ID"
              variant="outlined"
              name="mailId"
              value={formValues.mailId}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Enter City"
              variant="outlined"
              name="city"
              value={formValues.city}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Pincode"
              variant="outlined"
              name="pincode"
              value={formValues.pincode}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              name="address"
              multiline
              rows={3}
              value={formValues.address}
              onChange={handleInputChange}
            />
          </Grid>
          {/* Horizontal Line */}
          <Grid item xs={12}>
            <div
              style={{ borderTop: "1px solid #ccc", margin: "10px 0" }}
            ></div>
          </Grid>
        </Grid>
        <h3 className={styles.title}>Insurance History Details</h3>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1" sx= {{color:"#000"}}>
              Currently covered by any other medicine:
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="covered"
                value={formValues.covered}
                onChange={handleInputChange}
                
              >
                <FormControlLabel value="yes" control={<Radio  sx={{
                                    "& .MuiSvgIcon-root": { color: "#FF9900" }, // Applying yellow to the radio icon
                                    "&.Mui-checked .MuiSvgIcon-root": {
                                      color: "#FF9900",
                                    },
                                  }} />}
                                  label={
                                    <Typography sx={{ fontWeight: "bold", color: "#000" }}>Yes</Typography>
                                  } />
                <FormControlLabel value="no" control={<Radio  sx={{
                                    "& .MuiSvgIcon-root": { color: "#FF9900" },
                                    "&.Mui-checked .MuiSvgIcon-root": {
                                      color: "#FF9900",
                                    }, // Ensures checked state is yellow
                                  }} />} 
                                  label={
                                    <Typography sx={{ fontWeight: "bold", color: "#000" }}>No</Typography>
                                  } />
              </RadioGroup>
            </FormControl>
          </Grid>
          {formValues.covered === "yes" && (
            <Grid item xs={6}>
              <Typography variant="body1" sx= {{fontWeight:"500", color:"#000"}}>
                Date of commencement of first insurance without break:
              </Typography>
              <TextField
                type="date"
                name="commencementDate"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}
        </Grid>
        {formValues.covered === "yes" && (
          <>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ color: "#000" }}>
                  Have you been hospitalized in the last four years since
                  inception of contactor?
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup row name="covered">
                    <FormControlLabel
                      value="yes"
                      control={<Radio  sx={{
                        "& .MuiSvgIcon-root": { color: "#1977F3" },
                        "&.Mui-checked .MuiSvgIcon-root": {
                          color: "#1977F3",
                        }, // Ensures checked state is yellow
                      }} />}
                      label="Yes"
                      sx={{
                        "& .MuiFormControlLabel-label": { color: "#000", fontWeight:"bold" },
                      }}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio sx={{
                        "& .MuiSvgIcon-root": { color: "#1977F3" },
                        "&.Mui-checked .MuiSvgIcon-root": {
                          color: "#1977F3",
                        }, // Ensures checked state is yellow
                      }} />}
                      label="No"
                      sx={{
                        "& .MuiFormControlLabel-label": { color: "#000", fontWeight:"bold" },
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ color: "#000" }}>
                  If Have you been hospitalized in the last four years since
                  inception of contactor enter date
                </Typography>
                <TextField
                  type="date"
                  name="commencementDate"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className={classes.dateInput}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Insurance ID"
                  variant="outlined"
                  name="historyInsuranceId"
                  value={formValues.historyInsuranceId}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Insurance Provider"
                  variant="outlined"
                  name="historyInsuranceProvider"
                  value={formValues.historyInsuranceProvider}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sum Insured"
                  variant="outlined"
                  name="sumInsured"
                  value={formValues.sumInsured}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Diagnosis"
                  variant="outlined"
                  name="diagnosis"
                  value={formValues.diagnosis}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </>
        )}

        <h3 className={styles.title}>Details Of The Hospitalized Person </h3>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              name="hospitalizedFirstName"
              value={formValues.hospitalizedFirstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              name="hospitalizedLastName"
              value={formValues.hospitalizedLastName}
            />
          </Grid>
          <Grid item xs={6}>
          <ThemeProvider theme = {theme}>
            <Typography variant="body1">Gender</Typography>
           
            <FormControl component="fieldset">
              
              <RadioGroup
                row
                name="hospitalizedGender"
                value={formValues.hospitalizedGender}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            
            </FormControl>
            </ThemeProvider>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Age"
              variant="outlined"
              name="hospitalizedAge"
              value={formValues.hospitalizedAge}
              onChange={handleInputChange}
            />
          </Grid>
          <ThemeProvider theme = {theme}>
          <Grid item xs={12}>

            <Typography variant="body1">Relationship</Typography>
           
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="relationship"
                value={formValues.relationship}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="mother"
                  control={<Radio />}
                  label="Mother"
                />
                <FormControlLabel
                  value="father"
                  control={<Radio />}
                  label="Father"
                />
                <FormControlLabel
                  value="sibling"
                  control={<Radio />}
                  label="Sibling"
                />
                <FormControlLabel
                  value="spouse"
                  control={<Radio />}
                  label="Spouse"
                />
                <FormControlLabel
                  value="child"
                  control={<Radio />}
                  label="Child"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
           
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">Occupation</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="occupation"
                value={formValues.occupation}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="selfEmployed"
                  control={<Radio />}
                  label="Self Employed"
                />
                <FormControlLabel
                  value="service"
                  control={<Radio />}
                  label="Service"
                />
                <FormControlLabel
                  value="homeMaker"
                  control={<Radio />}
                  label="Home Maker"
                />
                <FormControlLabel
                  value="student"
                  control={<Radio />}
                  label="Student"
                />
                <FormControlLabel
                  value="retired"
                  control={<Radio />}
                  label="Retired"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          </ThemeProvider>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              variant="outlined"
              name="hospitalizedMobileNumber"
              value={formValues.hospitalizedMobileNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Mail ID"
              variant="outlined"
              name="hospitalizedMailId"
              value={formValues.hospitalizedMailId}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Enter City"
              variant="outlined"
              name="hospitalizedCity"
              value={formValues.hospitalizedCity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Pincode"
              variant="outlined"
              name="hospitalizedPincode"
              value={formValues.hospitalizedPincode}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              name="hospitalizedAddress"
              multiline
              rows={3}
              value={formValues.hospitalizedAddress}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <h3 className={styles.title}>Details Of The Hospitalization </h3>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Name of hospital"
              variant="outlined"
              name="hospitalizedFirstName"
              value={formValues.hospitalizedFirstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Room category"
              variant="outlined"
              name="hospitalizedLastName"
              value={formValues.hospitalizedLastName}
            />
          </Grid>

          <ThemeProvider theme = {theme}>
          <Grid item xs={6}>
            <FormControl component="fieldset" fullWidth>
              <Typography variant="body1" className={styles.typoHeading}>Hospitalized Injury Type</Typography>
              <RadioGroup
                name="hospitalizedInjuryType"
                value={formValues.hospitalizedInjuryType}
                onChange={handleInputChange}
                row // Optional: for horizontal alignment
              >
                <FormControlLabel
                  value="Injure"
                  control={<Radio />}
                  label="Injure"
                />
                <FormControlLabel
                  value="Thess"
                  control={<Radio />}
                  label="Thess"
                />
                <FormControlLabel
                  value="Maternity"
                  control={<Radio />}
                  label="Maternity"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date of Injury/Disease Detected/Delivery"
              variant="outlined"
              type="date"
              name="injuryDate"
              value={formValues.injuryDate}
              onChange={handleInputChange} // Ensure this handles input changes
              InputLabelProps={{
                shrink: true, // Ensures the label doesn't overlap with the date value
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1"  className={styles.typoHeading}>If Medico Legal</Typography>
            <RadioGroup
              row
              name="medicoLegal"
              value={formValues.medicoLegal}
              onChange={handleInputChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1"  className={styles.typoHeading}>If Injure, Give Cause</Typography>

            <RadioGroup
              row
              name="injureCause"
              value={formValues.injureCause}
              onChange={handleInputChange}
            >
              <FormControlLabel
                value="selfInfected"
                control={<Radio />}
                label="Self Infected"
              />
              <FormControlLabel
                value="roadTrafficAccident"
                control={<Radio />}
                label="Road Traffic Accident"
              />
              <FormControlLabel
                value="substanceAlcohol"
                control={<Radio />}
                label="Substance Used/Alcohol Consumption"
              />
            </RadioGroup>
          </Grid>
          </ThemeProvider>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date of Admission"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              name="hospitalizationDateOfAdmission"
              value={formValues.hospitalizationDateOfAdmission}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date of Discharge"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              name="hospitalizationDateOfDischarge"
              value={formValues.hospitalizationDateOfDischarge}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Enter City"
              variant="outlined"
              name="hospitalizationCity"
              value={formValues.hospitalizationCity}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Pincode"
              variant="outlined"
              name="hospitalizationPincode"
              value={formValues.hospitalizationPincode}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              name="hospitalizationAddress"
              multiline
              rows={3}
              value={formValues.hospitalizationAddress}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <h3 className={styles.title}>Details of Claim</h3>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Pre Hospitalization Expenses"
              variant="outlined"
              name="preHospitalizationExpenses"
              placeholder="Enter"
              value={formValues.preHospitalizationExpenses}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Post Hospitalization Expenses"
              variant="outlined"
              name="postHospitalizationExpenses"
              placeholder="Enter"
              value={formValues.postHospitalizationExpenses}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date of Admission"
              variant="outlined"
              type= "date"
              InputLabelProps={{ shrink: true }}
              name="claimDateOfAdmission"
              value={formValues.claimDateOfAdmission}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date of Discharge"
              variant="outlined"
              name="claimDateOfDischarge"
              InputLabelProps={{ shrink: true }}
              value={formValues.claimDateOfDischarge}
              onChange={handleInputChange}
            />
          </Grid>
          
          <ThemeProvider theme= {theme} >
          <Grid item xs={12}>
            <Typography variant="body1" className={styles.blackText}>
              Claim Documents Submission Check List{" "}
              {/* <span className={styles.blueText}>
                (select the bills and upload the Receipt)
              </span> */}
            </Typography>

            <Grid container item xs={12} spacing={2}>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.claimForm}
                      onChange={handleCheckboxChange}
                      name="claimForm"
                    />
                  }
                  label="Claim form duly signed"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.hospitalBreakupBill}
                      onChange={handleCheckboxChange}
                      name="hospitalBreakupBill"
                    />
                  }
                  label="Hospital break-up bill"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.oecg}
                      onChange={handleCheckboxChange}
                      name="oecg"
                    />
                  }
                  label="OECG"
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={2}>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.operationTheatreNote}
                      onChange={handleCheckboxChange}
                      name="operationTheatreNote"
                    />
                  }
                  label="Operation theatre note"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        formValues.claimDocuments.doctorRequestForInvestigation
                      }
                      onChange={handleCheckboxChange}
                      name="doctorRequestForInvestigation"
                    />
                  }
                  label="Doctor request for investigation"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.mriCtUsghpg}
                      onChange={handleCheckboxChange}
                      name="mriCtUsghpg"
                    />
                  }
                  label="MRI/CT/USG/HPG bill"
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={2}>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.hospitalMainBill}
                      onChange={handleCheckboxChange}
                      name="hospitalMainBill"
                    />
                  }
                  label="Hospital main bill"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        formValues.claimDocuments.hospitalBillPaymentReceipt
                      }
                      onChange={handleCheckboxChange}
                      name="hospitalBillPaymentReceipt"
                    />
                  }
                  label="Hospital bill payment Receipt"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.pharmacyBill}
                      onChange={handleCheckboxChange}
                      name="pharmacyBill"
                    />
                  }
                  label="Pharmacy bill"
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={2}>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.claimIntimationCopy}
                      onChange={handleCheckboxChange}
                      name="claimIntimationCopy"
                    />
                  }
                  label="Copy of claim intimation"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.dischargeBill}
                      onChange={handleCheckboxChange}
                      name="dischargeBill"
                    />
                  }
                  label="Discharge bill"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.doctorsPrescription}
                      onChange={handleCheckboxChange}
                      name="doctorsPrescription"
                    />
                  }
                  label="Doctor's Prescription"
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={2}>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.claimDocuments.others}
                      onChange={handleCheckboxChange}
                      name="others"
                    />
                  }
                  label="Others"
                />
              </Grid>
            </Grid>
          </Grid>
          </ThemeProvider>

          <Grid item xs={12}>
            <label htmlFor="upload" className={styles.label} style ={{fontSize:"18px"}}>
              Upload Patient Claim Documents
            </label>
            <div
              className={styles.uploadSection}
              onClick={() => document.getElementById("upload")?.click()}
            >
              <CloudUpload className={styles.cloudIcon} />
              <span className={styles.browseText}>
                Drag and drop files here, or browse to select files from your computer. Accepted formats:PDF, PNG, JPG, Each file must be under 10MB
              </span>
              <input
                type="file"
                id="upload"
                name="upload"
                className={styles.fileInput}
                onChange={(e) => handleFileChange(e, "claimUpload")}
              />
              <button type="button" className={styles.addButton}>
                <Add className={styles.addIcon} />
              </button>
            </div>
          </Grid>

          {formValues.covered === "no" && (
            <>
              <Grid item xs={12}>
                <h3 className={styles.title}>
                  Details Of Primary Insured Bank
                </h3>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="PAN Card"
                  variant="outlined"
                  name="panCard"
                  value={formValues.panCard}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  variant="outlined"
                  name="accountNumber"
                  value={formValues.accountNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  variant="outlined"
                  name="bankName"
                  value={formValues.bankName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Branch"
                  variant="outlined"
                  name="branch"
                  value={formValues.branch}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cheque/DD payable Details"
                  variant="outlined"
                  name="chequeDetails"
                  value={formValues.chequeDetails}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  variant="outlined"
                  name="ifscCode"
                  value={formValues.ifscCode}
                  onChange={handleInputChange}
                />
              </Grid>
            </>
          )}
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
      </form>
    </div>
  );
};

export default InsuranceClaim;
