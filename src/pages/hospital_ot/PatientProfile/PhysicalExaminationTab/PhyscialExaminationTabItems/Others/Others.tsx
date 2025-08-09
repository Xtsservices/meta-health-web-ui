import React from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import styles from './Others.module.scss';
import usePhysicalExaminationForm from '../../../../../../store/formStore/ot/usePhysicalExaminationForm';

const Others: React.FC = () => {
  const { others, setOthers } = usePhysicalExaminationForm();

  const handleCheckboxChange = (event: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = event.target;
    setOthers({ [name]: checked });
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formSection}>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={others.hematDisorder}
                onChange={handleCheckboxChange}
                name="hematDisorder"
              />
            }
            label="Hemat Disorder"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={others.pregnant}
                onChange={handleCheckboxChange}
                name="pregnant"
              />
            }
            label="Pregnant"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={others.radiotherapy}
                onChange={handleCheckboxChange}
                name="radiotherapy"
              />
            }
            label="Radiotherapy"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={others.chemotherapy}
                onChange={handleCheckboxChange}
                name="chemotherapy"
              />
            }
            label="Chemotherapy"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={others.immuneSuppressed}
                onChange={handleCheckboxChange}
                name="immuneSuppressed"
              />
            }
            label="Immune Suppressed"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={others.steroidUse}
                onChange={handleCheckboxChange}
                name="steroidUse"
              />
            }
            label="Steroid Use"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={others.cervicalSpineMovement}
                onChange={handleCheckboxChange}
                name="cervicalSpineMovement"
              />
            }
            label="Cervical Spine Movement"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={others.intraopUrineOutput}
                onChange={handleCheckboxChange}
                name="intraopUrineOutput"
              />
            }
            label="Intraop Urine Output"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={others.bloodLossToBeRecorded}
                onChange={handleCheckboxChange}
                name="bloodLossToBeRecorded"
              />
            }
            label="Blood Loss To Be Recorded"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Others;
