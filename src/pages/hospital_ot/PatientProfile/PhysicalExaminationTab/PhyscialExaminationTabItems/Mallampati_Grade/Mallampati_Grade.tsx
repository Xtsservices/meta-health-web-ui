import { Box, Button } from '@mui/material';
import styles from './Mallampati_Grade.module.scss';
import usePhysicalExaminationForm from '../../../../../../store/formStore/ot/usePhysicalExaminationForm';
import useOTConfig from '../../../../../../store/formStore/ot/useOTConfig';
import Mallampati_img from '../../../../../../assets/mallampati.jpg'

const Mallampati_Grade: React.FC = () => {
  const { mallampatiGrade, setMallampatiGrade } = usePhysicalExaminationForm();
  const { physicalExaminationReadOnly } = useOTConfig();
  const handleButtonClick = (grade: number) => {
    setMallampatiGrade({ class: grade });
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formSection}>
        <Box>
          <img src={Mallampati_img} alt="Mallampati Grade" height={300} />
          <Box className={styles.buttonGroup}>
            <Button
              variant={mallampatiGrade.class === 1 ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick(1)}
              disabled={physicalExaminationReadOnly}
            >
              Class-I
            </Button>
            <Button
              variant={mallampatiGrade.class === 2 ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick(2)}
              disabled={physicalExaminationReadOnly}
            >
              Class-II
            </Button>
            <Button
              variant={mallampatiGrade.class === 3 ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick(3)}
              disabled={physicalExaminationReadOnly}
            >
              Class-III
            </Button>
            <Button
              variant={mallampatiGrade.class === 4 ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick(4)}
              disabled={physicalExaminationReadOnly}
            >
              Class-IV
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Mallampati_Grade;
