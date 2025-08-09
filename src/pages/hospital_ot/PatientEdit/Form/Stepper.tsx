import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

const steps = ["Basic Info", "Symptomps", "Medical History", "Report"];
type stepperProps = {
  step: number;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
};
export default function HorizontalStepperWithError({ step }: stepperProps) {
  const isStepFailed = (step: number) => {
    return step === 5;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label, index) => {
          const labelProps: {
            optional?: React.ReactNode;
            error?: boolean;
          } = {};
          if (isStepFailed(index)) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                Alert message
              </Typography>
            );
            labelProps.error = true;
          }

          return (
            <Step key={label}>
              <StepLabel
                {...labelProps}
                // StepIconProps={{ style: { marginBottom: "8px" } }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
