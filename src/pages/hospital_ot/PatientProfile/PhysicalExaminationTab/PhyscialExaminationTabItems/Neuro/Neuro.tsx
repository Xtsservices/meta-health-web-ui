import React from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import styles from './Neuro.module.scss';
import usePhysicalExaminationForm from '../../../../../../store/formStore/ot/usePhysicalExaminationForm';

const Neuro: React.FC = () => {
  const { neuroMuscular, setNeuroMuscular } = usePhysicalExaminationForm();

  const handleCheckboxChange = (event: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = event.target;
    setNeuroMuscular({ [name]: checked });
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formSection}>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.rhArthritis}
                onChange={handleCheckboxChange}
                name="rhArthritis"
              />
            }
            label="Rh arthritis"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.gout}
                onChange={handleCheckboxChange}
                name="gout"
              />
            }
            label="Gout"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.backache}
                onChange={handleCheckboxChange}
                name="backache"
              />
            }
            label="Backache"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.headAche}
                onChange={handleCheckboxChange}
                name="headAche"
              />
            }
            label="Head Ache"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.seizures}
                onChange={handleCheckboxChange}
                name="seizures"
              />
            }
            label="Seizures"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.scoliosisKyphosis}
                onChange={handleCheckboxChange}
                name="scoliosisKyphosis"
              />
            }
            label="Scoliosis/ Kyphosis"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.paresthesia}
                onChange={handleCheckboxChange}
                name="paresthesia"
              />
            }
            label="Paresthesia"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.locUnconscious}
                onChange={handleCheckboxChange}
                name="locUnconscious"
              />
            }
            label="Loc/Unconscious"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.muscleWeakness}
                onChange={handleCheckboxChange}
                name="muscleWeakness"
              />
            }
            label="Muscle Weakness"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.cvaTia}
                onChange={handleCheckboxChange}
                name="cvaTia"
              />
            }
            label="CVA/TIA"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.headInjury}
                onChange={handleCheckboxChange}
                name="headInjury"
              />
            }
            label="Head Injury"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.paralysis}
                onChange={handleCheckboxChange}
                name="paralysis"
              />
            }
            label="Paralysis"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={neuroMuscular.psychDisorder}
                onChange={handleCheckboxChange}
                name="psychDisorder"
              />
            }
            label="Psych Disorder"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Neuro;
