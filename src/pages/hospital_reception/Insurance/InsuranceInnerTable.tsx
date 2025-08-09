import { useEffect, useState } from "react";
import styles from "./insurance.module.scss";
import PatientRegistration from "./PatientRegistration";
import { Stepper, Step, StepLabel, StepIconProps } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InsuranceClaim from "./InsuranceClaim";
import VerificationValidation from "./VerificationValidation";
import insurance_reimbursement_banner from "../../../assets/reception/insurance_reimbursement_banner.png"
import {
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Stack,
  Box,
  Button,
  Dialog, DialogContent, Typography,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";

import { CloudUpload, Add } from "@mui/icons-material";
import mailImg from '../../../assets/addPatient/newmail.png'


type InsuranceInnerTableProps = {
  value?: string; // Adjust the type based on your actual value type
  showInnerTable?:boolean;
};

type FormDataType = {
  insuranceType: string;
  patientID: string;
  patientName: string;
  contactMobile: string;
  address: string;
  upload: File | null;
  email: string;
};

const InsuranceInnerTable: React.FC<InsuranceInnerTableProps> = ({ value ,showInnerTable}) => {
  const [activeTab, setActiveTab] = useState("Patient Registration");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [electricCompletedSteps, setElectricCompletedSteps] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [dynamicValue, setDynamicValue] = useState(value);
  const  [dynamicshowInnerTable, setDynamicShowInnerTable] = useState(showInnerTable);

 
  const [formData, setFormData] = useState<FormDataType>({
    insuranceType: "",
    patientID: "",
    patientName: "",
    contactMobile: "",
    address: "",
    upload: null,
    email: "",
  });
  
  const [electronicformData, setElectronicFormData] = useState({
    patientID: "",
    insuranceID: "",
    firstName: "",
    lastName: "",
    email: "",
    upload: null, // To store the uploaded file
  });
  
  const [newClaim, setNewClaim] = useState({
    insuranceType: "",
    insuranceClaimType: "",
    patientID: "",
  });


  const steps = [
    "Patient Registration",
    "Insurance Claim",
    "Verification & Validation"
  ];

 
  const electronicSteps = [
    "Insurance Submission",
    "Verification & Validation"
  ];

  

  const handleTabClick = (tab: string) => {
    if (tab === activeTab) return; // No action if clicking the current tab

    if (steps.indexOf(tab) < steps.indexOf(activeTab)) {
      // Going back to a previous tab
      setCompletedSteps((prev) =>
        prev.filter((step) => steps.indexOf(step) < steps.indexOf(tab))
      );
    } else {
      // Going forward to a new tab
      if (!completedSteps.includes(activeTab)) {
        setCompletedSteps((prev) => [...prev, activeTab]);
      }
    }
    setActiveTab(tab);
  };

  const handleSubmitPatientRegistration = () => {
    setCompletedSteps((prev) => [...prev, "Patient Registration"]); // Mark as completed
    setActiveTab("Insurance Claim");
  };

  const handleSubmitInsuranceClaim = (): void => {
    setCompletedSteps((prev) => [...prev, "Insurance Claim"]); // Mark as completed
    setActiveTab("Verification & Validation");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Patient Registration":
        return (
          <PatientRegistration onSubmit={handleSubmitPatientRegistration} />
        );
      case "Insurance Claim":
        return <InsuranceClaim onSubmit={handleSubmitInsuranceClaim} />;
      case "Verification & Validation":
        return <VerificationValidation />;
      default:
        return null;
    }
  };

  const StepIcon = (props: StepIconProps) => {
    const { active, completed, className } = props;

    return completed ? (
      <CheckCircleIcon className={styles.completedIcon} />
    ) : (
      <div className={`${className} ${active ? styles.activeStep : ""}`}>
        {props.icon}
      </div>
    );
  };


 

  

  // Function to handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormDataType
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, [field]: file });
  };

  useEffect(() => {
    if (value) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        insuranceType: value, // Set the insurance type when value is updated
      }));
    }
  }, [value]); // Runs whenever `value` changes
  

  const handleElectronicInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setElectronicFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  
  const handleElectronicFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormDataType
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    setElectronicFormData({ ...electronicformData, [field]: file });
  };

  const handleOpen = () => {
    setOpen(true);
    handleNext()
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  // Function to mark a step as completed
const handleCompleteStep = (step: string) => {
  setElectricCompletedSteps((prevSteps) => [...prevSteps, step]);
};

// Example: Call handleCompleteStep when a user completes a step
const handleNext = () => {
  const currentStep = electronicSteps[activeStep]; // Get the current step
  if (!electricCompletedSteps.includes(currentStep)) {
    handleCompleteStep(currentStep);
  }
  
  // Move to next step (if not last step)
  if (activeStep < electronicSteps.length - 1) {
    setActiveStep(activeStep + 1);
  }
};

const handleNewClaimInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  setNewClaim((prev) => ({
    ...prev,
    [name]: value,
  }));
};



const handleInputChange2 = (
  event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
) => {
  const { name, value } = event.target as
    | HTMLInputElement
    | HTMLSelectElement;

  setNewClaim((prevData) => ({
    ...prevData,
    [name]: value,
  }));

  
};


useEffect(() => {
  if (newClaim.insuranceType && newClaim.patientID) {
    // If insuranceType is "Claim", use insuranceClaimType; otherwise, use insuranceType
    const updatedValue =
      newClaim.insuranceType === "Claim"
        ? newClaim.insuranceClaimType
        : newClaim.insuranceType;
    setDynamicValue(updatedValue);
    setDynamicShowInnerTable(false)
  } else {
    // If insuranceType is not set, fallback to the original `value`
    setDynamicValue(value);
    //setDynamicShowInnerTable(false)
  }
}, [newClaim.insuranceType, newClaim.insuranceClaimType, value, newClaim.patientID]);


  return (
    <>
   
      {dynamicValue && dynamicValue === "Reimbursement" && (
        <div>
        <h2 style={{ textAlign: "center", width: "100%" }}>{value}</h2>

          <Grid container spacing={2} justifyContent="center"> 
        
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter Patient ID"
              name="patientID"
              value={formData.patientID}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactMobile"
              value={formData.contactMobile}
              onChange={handleInputChange}
              inputProps={{
                maxLength: 10, // Limits input to 10 characters
                pattern: "[0-9]{10}", // Ensures input is numeric (only digits)
              }}
            />
          </Grid>
          <Grid item xs={12}>
        <TextField
          label="Address"
          //   helperText="Enter your name"
          multiline
          rows={3}
          variant="outlined"
          type="text"
          fullWidth
          required
          name="address"
          onChange={handleInputChange}
          value={formData.address}
        
        />
      </Grid>
      <Grid item xs={12}>
            <label htmlFor="upload" className={styles.label}>
            Upload: Patient Hospital Bills and Raceipts. Docters's Prescretions, Discharge Summary, Medical reports, Miscellaneous Receipts
            </label>
            <div
              className={styles.uploadSection}
              onClick={() => document.getElementById("upload")?.click()}
            >
              <CloudUpload className={styles.cloudIcon} />
              <span className={styles.browseText}>
              Drag and drop flies there, or orowise to select files from your computer Accepted formats: PDF, PNG the Let Accepted formats: PDF, PNG, JPG. Each file must be under 20 MB
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

          <Grid item xs={12}>
        <TextField
          label="Receiver Email"
          variant="outlined"
          type="email"
          fullWidth
          name="email"
          onChange={handleInputChange}
          value={formData.email}
        />
      </Grid>

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
                    onClick={handleOpen}
                    sx={{
                      padding: "6px 56px",
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
                    // onClick={onSubmit}
                    sx={{
                      padding: "6px 56px",
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
        </div>
      )}

{dynamicValue !=="Electronic" && dynamicValue !== "Reimbursement"&& !dynamicshowInnerTable && (
  <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        {steps.map((step) => (
          <button
            key={step}
            className={activeTab === step ? styles.active : ""}
            onClick={() => handleTabClick(step)}
          >
            {step}
          </button>
        ))}
      </div>

      {/* Stepper */}
      <Stepper
        activeStep={steps.indexOf(activeTab)}
        alternativeLabel
        sx={{
          width: "80%",
          margin: "0 auto",
          "& .MuiStepLabel-label": {
            fontWeight: "bold",
            color: "gray"
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: "#1977F3"
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: "#1977F3"
          },
          "& .MuiStepConnector-line": {
            borderColor: "lightgray"
          },
          "& .Mui-active .MuiStepConnector-line": {
            borderColor: "#1977F3"
          },
          "& .Mui-completed .MuiStepConnector-line": {
            borderColor: "#1977F3"
          }
        }}
        // sx={{ width: "80%", margin: "0 auto" }}
      >
        {steps.map((label) => (
          <Step key={label} completed={completedSteps.includes(label)}>
            <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* <div className={styles.tabContent}>{renderContent()}</div> */}

       {/* Scrollable Content Area */}
  <div className={styles.tabContentContainer}>
    <div className={styles.tabContent}>{renderContent()}</div>
  </div>
  </div>
)}
   
   {dynamicValue && dynamicValue ==="Electronic" && (

 <div>


  
   <h2 style={{ textAlign: "center", width: "100%" }}>Send Insurance Documents</h2>
   <Stepper
        activeStep={electronicSteps.indexOf(activeTab)}
        alternativeLabel
        sx={{
          width: "80%",
          margin: "0 auto",
          "& .MuiStepLabel-label": {
            fontWeight: "bold",
            color: "gray"
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: "#1977F3"
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: "#1977F3"
          },
          "& .MuiStepConnector-line": {
            borderColor: "lightgray"
          },
          "& .Mui-active .MuiStepConnector-line": {
            borderColor: "#1977F3"
          },
          "& .Mui-completed .MuiStepConnector-line": {
            borderColor: "#1977F3"
          }
        }}
        // sx={{ width: "80%", margin: "0 auto" }}
      >
        {electronicSteps.map((label) => (
          <Step key={label} completed={electricCompletedSteps.includes(label)}>
            <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container spacing={2}>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Enter Patient ID"
          name="patientID"
          value={electronicformData.patientID}
          onChange={handleElectronicInputChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Insurance ID"
          name="insuranceID"
          value={electronicformData.insuranceID}
          onChange={handleElectronicInputChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={electronicformData.firstName}
          onChange={handleElectronicInputChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={electronicformData.lastName}
          onChange={handleElectronicInputChange}
        />
      </Grid>

      <Grid item xs={12}>
        <label htmlFor="upload" className={styles.label}>
          Upload Patient <span style={{ fontWeight: "bold" }}>Claim documents, Insurance Form, Patient Medical
          Records</span> Supporting Document <span style={{ fontWeight: "bold" }}>Attach Patient Images</span>
        </label>
        <div
          className={styles.uploadSection}
          onClick={() => document.getElementById("upload")?.click()}
        >
          <CloudUpload className={styles.cloudIcon} />
          <span className={styles.browseText}>
            Drag and drop files here, or browse to select files from your
            computer. Accepted formats: PDF, PNG, JPG. Each file must be under
            20 MB.
          </span>
          <input
            type="file"
            id="upload"
            name="upload"
            className={styles.fileInput}
            onChange={(e) => handleElectronicFileChange(e, "upload")}
            accept=".pdf, .png, .jpg, .jpeg"
          />
         <button type="button" className={styles.addButton} style={{background:"#4caf50"}} >
                <Add className={styles.addIcon} />
              </button>
        </div>
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Insurance Provider Email"
          variant="outlined"
          type="email"
          fullWidth
          name="email"
          onChange={handleElectronicInputChange}
          value={electronicformData.email}
        />
      </Grid>

      <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  width: "100%",
                  mb:3,
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
                    // onClick={handleCancel}
                    sx={{
                      padding: "6px 56px",
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
                    onClick={handleOpen}
                    sx={{
                      padding: "6px 56px",
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
    </div>
  )}  


{dynamicshowInnerTable  && (
  <div style = {{display:"flex", flexDirection:"column", paddingLeft:"10%"}}>
    <h3 style = {{textAlign:"center", fontWeight:"500", fontSize:"22px"}}>Reimbursement</h3>
      <Grid item xs={12} sx={{mt: 2}}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="insuranceType"
                value={newClaim.insuranceType}
                onChange={handleNewClaimInputChange}
              >
                <FormControlLabel
                  value="Reimbursement"
                  control={<Radio sx={{"&.Mui-checked .MuiSvgIcon-root": {
                    color: "#1977F3"}, paddingLeft:"40px"
                }}  />}
                  label="Reimbursement"
                  
                />
                <FormControlLabel
                  value="Claim"
                
                  control={<Radio sx={{"&.Mui-checked .MuiSvgIcon-root": {
                      color: "#1977F3"},
                  }}  
                  />}
                  label="Claim"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

{newClaim.insuranceType === "Claim" && (

   <Grid item xs={12}>
   <FormControl fullWidth>
     <InputLabel id="insurance-label">Insurance Claim Type</InputLabel>
     <Select
       labelId="insurance-label"
       id="insuranceClaimType"
       name="insuranceClaimType"
       value={newClaim.insuranceClaimType}
       onChange={handleInputChange2}
       label="Insurance Claim Type"
     >
       <MenuItem value="Paper">Paper</MenuItem>
       <MenuItem value="Electronic">Electronic</MenuItem>
     </Select>
   </FormControl>
 </Grid>
)}

{(newClaim.insuranceType === "Claim"  || newClaim.insuranceType === "Reimbursement") && (
 <Grid item xs={12} sx={{ mt: 2 }}>
 <TextField
   fullWidth
   label="Enter Patient ID"
   name="patientID"
   value={newClaim.patientID}
   onChange={handleNewClaimInputChange}
 />
</Grid>
)}
  

 <img src= {insurance_reimbursement_banner} alt = "insurance reimbursement banner" style = {{width:"350px", alignSelf:"center", marginTop:"20px"}} />
      
  </div>
)}

    <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            width: "500px",
            maxWidth: "90%",
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <img
              src={mailImg} 
              alt="Mail Sent"
              style={{ width: "120px", height: "120px" }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "green",
              marginBottom: "8px",
            }}
          >
            Mail Sent Successfully!
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#666",
              marginBottom: "20px",
            }}
          >
            Your insurance details have been sent successfully to the registered
            email ID. Please check your inbox for confirmation.
          </Typography>

          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "20px",
              padding: "6px 40px",
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default InsuranceInnerTable;
