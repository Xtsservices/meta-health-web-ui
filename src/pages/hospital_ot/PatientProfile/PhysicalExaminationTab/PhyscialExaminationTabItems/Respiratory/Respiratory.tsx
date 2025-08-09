import { Box, FormControlLabel, Checkbox } from '@mui/material';
import styles from './Respiratory.module.scss';
import usePhysicalExaminationForm from '../../../../../../store/formStore/ot/usePhysicalExaminationForm';

const Respiratory: React.FC = () => {
  const { respiratory, setRespiratory } = usePhysicalExaminationForm();

  const handleCheckboxChange = (event: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = event.target;
    setRespiratory({ [name]: checked });
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formSection}>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.dryCough}
                onChange={handleCheckboxChange}
                name="dryCough"
              />
            }
            label="Dry Cough"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.productiveCough}
                onChange={handleCheckboxChange}
                name="productiveCough"
              />
            }
            label="Productive Cough"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.asthma}
                onChange={handleCheckboxChange}
                name="asthma"
              />
            }
            label="Asthma"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.recentURILRTI}
                onChange={handleCheckboxChange}
                name="recentURILRTI"
              />
            }
            label="Recent URI/LRTI"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.tb}
                onChange={handleCheckboxChange}
                name="tb"
              />
            }
            label="TB"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.pneumonia}
                onChange={handleCheckboxChange}
                name="pneumonia"
              />
            }
            label="Pneumonia"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.copd}
                onChange={handleCheckboxChange}
                name="copd"
              />
            }
            label="COPD"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.osa}
                onChange={handleCheckboxChange}
                name="osa"
              />
            }
            label="OSA"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.recurrentTonsils}
                onChange={handleCheckboxChange}
                name="recurrentTonsils"
              />
            }
            label="Recurrent Tonsils"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.breathlessness}
                onChange={handleCheckboxChange}
                name="breathlessness"
              />
            }
            label="Breathlessness"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={respiratory.dyspnea}
                onChange={handleCheckboxChange}
                name="dyspnea"
              />
            }
            label="Dyspnea"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Respiratory;
