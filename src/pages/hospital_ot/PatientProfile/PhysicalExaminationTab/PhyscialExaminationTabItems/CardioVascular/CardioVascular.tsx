import { Box, FormControlLabel, Checkbox } from '@mui/material';
import styles from './CardioVascular.module.scss';
import usePhysicalExaminationForm from '../../../../../../store/formStore/ot/usePhysicalExaminationForm';

const CardioVascular: React.FC = () => {
  const { cardioVascular, setCardioVascular } = usePhysicalExaminationForm();

  const handleCheckboxChange = (event: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = event.target;
    setCardioVascular({ [name]: checked });
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formSection}>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.hypertension}
                onChange={handleCheckboxChange}
                name="hypertension"
              />
            }
            label="Hypertension"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.cafDOE}
                onChange={handleCheckboxChange}
                name="cafDOE"
              />
            }
            label="CAF DOE"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.ischemicHeartDisease}
                onChange={handleCheckboxChange}
                name="ischemicHeartDisease"
              />
            }
            label="Ischemic Heart Disease"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.rheumaticFever}
                onChange={handleCheckboxChange}
                name="rheumaticFever"
              />
            }
            label="Rheumatic Fever"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.orthpneaPND}
                onChange={handleCheckboxChange}
                name="orthpneaPND"
              />
            }
            label="Orthpnea/PND"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.murmurs}
                onChange={handleCheckboxChange}
                name="murmurs"
              />
            }
            label="Murmurs"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.cad}
                onChange={handleCheckboxChange}
                name="cad"
              />
            }
            label="CAD"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.exerciseTolerance}
                onChange={handleCheckboxChange}
                name="exerciseTolerance"
              />
            }
            label="Exercise Tolerance"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.cardicEnlargement}
                onChange={handleCheckboxChange}
                name="cardicEnlargement"
              />
            }
            label="Cardic Enlargement"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.angina}
                onChange={handleCheckboxChange}
                name="angina"
              />
            }
            label="Angina"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.mi}
                onChange={handleCheckboxChange}
                name="mi"
              />
            }
            label="Mi"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.mtdLessThan4}
                onChange={handleCheckboxChange}
                name="mtdLessThan4"
              />
            }
            label="MTD<4"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cardioVascular.mtdGreaterThan4}
                onChange={handleCheckboxChange}
                name="mtdGreaterThan4"
              />
            }
            label="MTD>4"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CardioVascular;
