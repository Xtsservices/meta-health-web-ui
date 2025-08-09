import { Box, FormControlLabel, Checkbox } from '@mui/material';
import styles from './GeneralPhysicalExamination.module.scss';
import usePhysicalExaminationForm from '../../../../../../store/formStore/ot/usePhysicalExaminationForm';

const GeneralPhysicalExamination: React.FC = () => {
  const { generalphysicalExamination, setGeneralPhysicalExamination } =
    usePhysicalExaminationForm();

  const handleCheckboxChange = (event: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = event.target;
    setGeneralPhysicalExamination({ [name]: checked });
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formSection}>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={generalphysicalExamination.jvp}
                onChange={handleCheckboxChange}
                name="jvp"
              />
            }
            label="JVP"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={generalphysicalExamination.pallor}
                onChange={handleCheckboxChange}
                name="pallor"
              />
            }
            label="Pallor"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={generalphysicalExamination.cyanosis}
                onChange={handleCheckboxChange}
                name="cyanosis"
              />
            }
            label="Cyanosis"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={generalphysicalExamination.icterus}
                onChange={handleCheckboxChange}
                name="icterus"
              />
            }
            label="Icterus"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={generalphysicalExamination.pupils}
                onChange={handleCheckboxChange}
                name="pupils"
              />
            }
            label="Pupils"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={generalphysicalExamination.edema}
                onChange={handleCheckboxChange}
                name="edema"
              />
            }
            label="Edema"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={generalphysicalExamination.syncopatAttack}
                onChange={handleCheckboxChange}
                name="syncopatAttack"
              />
            }
            label="Syncopat Attack"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={generalphysicalExamination.paipitation}
                onChange={handleCheckboxChange}
                name="paipitation"
              />
            }
            label="Paipitation"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={generalphysicalExamination.other}
                onChange={handleCheckboxChange}
                name="other"
              />
            }
            label="Other"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default GeneralPhysicalExamination;
