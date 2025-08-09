import { useState } from 'react';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import PersonalInfoForm from './personalInfoForm';
import ClinicalExamForm from './clinicalExamForm';
import HistoryForm from './historyForm';
import InvestigationForm from './investigationForm';
import PreoperativeInstructionsForm from './preOperativeForm';
import { PreAnaestheticClass } from '../../../utility/preAnaestheticClass';
import './pre.scss';

const PreAnaestheticData = new PreAnaestheticClass();

function PreAnaestheticForm() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < 4) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    else {
      // console.log(PreAnaestheticData);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    'Personal Information',
    'Medical History',
    'Clinical Examination',
    'Investigations',
    'Pre-Operative Instructions',
  ];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PersonalInfoForm />;
      case 1:
        return <HistoryForm />;
      case 2:
        return <ClinicalExamForm />;
      case 3:
        return <InvestigationForm />;
      case 4:
        return <PreoperativeInstructionsForm />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="pre-anaesthetic-form">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        <div className="step-content">
          {getStepContent(activeStep)}
          <div className="step-controller">
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PreAnaestheticForm, PreAnaestheticData };
