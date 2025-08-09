import React from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import styles from './Renal.module.scss';
import usePhysicalExaminationForm from '../../../../../../store/formStore/ot/usePhysicalExaminationForm';

const Renal: React.FC = () => {
  const { renal, setRenal } = usePhysicalExaminationForm();

  const handleCheckboxChange = (event: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = event.target;
    setRenal({ [name]: checked });
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formSection}>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={renal.uti}
                onChange={handleCheckboxChange}
                name="uti"
              />
            }
            label="UTI"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={renal.haemateria}
                onChange={handleCheckboxChange}
                name="haemateria"
              />
            }
            label="Haemateria"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={renal.renalInsufficiency}
                onChange={handleCheckboxChange}
                name="renalInsufficiency"
              />
            }
            label="Renal Insufficiency"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={renal.aorenocorticalInsuff}
                onChange={handleCheckboxChange}
                name="aorenocorticalInsuff"
              />
            }
            label="Aorenocortical Insuff"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={renal.thyroidDisorder}
                onChange={handleCheckboxChange}
                name="thyroidDisorder"
              />
            }
            label="Thyroid Disorder"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={renal.pituitaryDisorder}
                onChange={handleCheckboxChange}
                name="pituitaryDisorder"
              />
            }
            label="Pituitary Disorder"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={renal.diabeticsMalitus}
                onChange={handleCheckboxChange}
                name="diabeticsMalitus"
              />
            }
            label="Diabetics Malitus"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Renal;
