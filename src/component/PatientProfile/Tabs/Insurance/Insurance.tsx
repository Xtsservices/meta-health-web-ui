import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { CloudUpload, Add } from "@mui/icons-material";
import "./Insurance.scss";

const steps = [
  "All Documents Submitted",
  "Approved",
  "Verification Completed",
  "Claimed Successfully",
];

interface StepInfo {
  step: number;
  status: string;
  addedBy: string;
  date: string;
}

const Insurance: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepDetails, setStepDetails] = useState<StepInfo[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null); // State to store the filename

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name); // Set the filename when a file is selected
      console.log(`${field} file uploaded:`, file.name);
    }
  };

  useEffect(() => {
    // Sample data
    const sampleData: StepInfo[] = [
      { step: 1, status: "Completed", addedBy: "John Doe", date: "2024-12-28" },
      {
        step: 2,
        status: "Completed",
        addedBy: "Jane Smith",
        date: "2024-12-29",
      },
      { step: 3, status: "Reject", addedBy: "", date: "" },
    ];

    setStepDetails(sampleData);

    // Determine the active step
    const lastCompletedStep = sampleData
      .filter((data) => data.status === "Completed")
      .reduce((max, item) => Math.max(max, item.step), 0);

    setActiveStep(lastCompletedStep);
  }, []);

  return (
    <div className="insurance-tab">
      {/* Stepper */}
      <Box sx={{ width: "100%", mb: 4, mt: 8 }}>
        <Stepper activeStep={activeStep} alternativeLabel className="custom-stepper">
          {steps.map((label, index) => {
            const currentStep = stepDetails.find(
              (detail) => detail.step === index + 1
            );
            const isReject = currentStep?.status === "Reject";

            return (
              <Step key={label}>
                <StepLabel
                  error={isReject} // Apply error style if step is rejected
                >
                  {label}
                  {isReject && (
                    <Box sx={{ mt: 1, ml: 4 }}>
                   
                      <>
                        <Typography variant="body2">
                          <strong>Status:</strong> {currentStep.status}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Completed by:</strong>{" "}
                          {currentStep.addedBy || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong> {currentStep.date || "N/A"}
                        </Typography>
                      </>
                   
                  </Box>
                  )}
                </StepLabel>
                {currentStep && (
                  <Box sx={{ mt: 1, ml: 4 }}>
                    {!isReject && (
                      <>
                        <Typography variant="body2">
                          <strong>Status:</strong> {currentStep.status}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Completed by:</strong>{" "}
                          {currentStep.addedBy || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong> {currentStep.date || "N/A"}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Step>
            );
          })}
        </Stepper>
      </Box>

      <Grid container spacing={4} sx={{ justifyContent: "space-around", alignItems: "flex-start" }}>
        {/* Insurance Details */}
        <Grid item xs={12} md={6}>
          <div className="insurance-details">
            <h3>Insurance Details</h3>
            <Typography>
              <strong>Primary contact:</strong> Ravindra Sai, +91776554567
            </Typography>
            <Typography>
              <strong>Secondary concern:</strong> John Doe
            </Typography>
            <Typography>
              <strong>Insurance type:</strong> Reimbursement
            </Typography>
            <Typography>
              <strong>Insurance expiry date:</strong> 12/04/2025
            </Typography>
            <Typography>
              <strong>Insurance claiming amount:</strong> ₹50,000
            </Typography>
          </div>
        </Grid>

        {/* File Upload Section */}
        <Grid item xs={12} md={4}>
          <h3 className="uploadheading">Upload Incident Images</h3>

          <div
            className="uploadSection"
            onClick={() =>
              document.getElementById("uploadInsurenceDocuments")?.click()
            }
          >
            <CloudUpload className="cloudIcon" />
            <span className="browseText">
              Browse and choose a file to upload from your computer (JPG, PNG,
              PDF).
            </span>
            <input
              type="file"
              id="uploadInsurenceDocuments"
              name="uploadInsurenceDocuments"
              className="fileInput"
              onChange={(e) => handleFileChange(e, "uploadInsurenceDocuments")}
            />
            <button type="button" className="addButton blueBackground">
              <Add className="addIcon" />
            </button>
          </div>

          {/* Display the filename if a file is selected */}
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Selected file:</strong> {selectedFile}
            </Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Insurance;
