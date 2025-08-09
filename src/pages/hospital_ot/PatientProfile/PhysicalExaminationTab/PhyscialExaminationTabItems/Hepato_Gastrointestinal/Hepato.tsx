import { Box, FormControlLabel, Checkbox } from '@mui/material';
import styles from './Hepato.module.scss';
import usePhysicalExaminationForm from '../../../../../../store/formStore/ot/usePhysicalExaminationForm';

const Hepato: React.FC = () => {
  const { hepato, setHepato } = usePhysicalExaminationForm();

  const handleCheckboxChange = (event: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = event.target;
    setHepato({ [name]: checked });
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formSection}>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hepato.vomiting}
                onChange={handleCheckboxChange}
                name="vomiting"
              />
            }
            label="Vomiting"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hepato.gerd}
                onChange={handleCheckboxChange}
                name="gerd"
              />
            }
            label="GERD"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hepato.diarrhoea}
                onChange={handleCheckboxChange}
                name="diarrhoea"
              />
            }
            label="Diarrhoea"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hepato.galbladderDS}
                onChange={handleCheckboxChange}
                name="galbladderDS"
              />
            }
            label="Galbladder DS"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hepato.jaundice}
                onChange={handleCheckboxChange}
                name="jaundice"
              />
            }
            label="Jaundice"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hepato.cirrhosis}
                onChange={handleCheckboxChange}
                name="cirrhosis"
              />
            }
            label="Cirrhosis"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Hepato;
