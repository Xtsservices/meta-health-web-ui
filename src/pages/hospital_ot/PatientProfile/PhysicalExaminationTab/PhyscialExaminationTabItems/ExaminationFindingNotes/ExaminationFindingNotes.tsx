import { Box, TextField } from '@mui/material';
import styles from './ExaminationFindingNotes.module.scss';
import usePhysicalExaminationForm from '../../../../../../store/formStore/ot/usePhysicalExaminationForm';
import useOTConfig from '../../../../../../store/formStore/ot/useOTConfig';

const ExaminationFindingNotes: React.FC = () => {
  const { examinationFindingNotes, setExaminationFindingNotes } =
    usePhysicalExaminationForm();
  const { physicalExaminationReadOnly } = useOTConfig();

  const handleInputChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;
    setExaminationFindingNotes({ [name]: value });
  };

  return (
    <Box className={styles.formContainer}>
      <TextField
        label="Examination Finding Notes"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        disabled={physicalExaminationReadOnly}
        value={examinationFindingNotes.examinationFindingNotes}
        onChange={handleInputChange}
        name="examinationFindingNotes"
        margin='dense'
      />
      <TextField
        label="Smoking Tobacco"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        disabled={physicalExaminationReadOnly}
        value={examinationFindingNotes.smokingTobacco}
        onChange={handleInputChange}
        name="smokingTobacco"
        margin='dense'
      />
      <TextField
        label="Cardio Vascular Examination"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        disabled={physicalExaminationReadOnly}
        value={examinationFindingNotes.cardioVascularExamination}
        onChange={handleInputChange}
        name="cardioVascularExamination"
        margin='dense'
      />
      <TextField
        label="Abdominal Examination"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        disabled={physicalExaminationReadOnly}
        value={examinationFindingNotes.abdominalExamination}
        onChange={handleInputChange}
        name="abdominalExamination"
        margin='dense'
      />
      <TextField
        label="Alcohol"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        disabled={physicalExaminationReadOnly}
        value={examinationFindingNotes.alcohol}
        onChange={handleInputChange}
        name="alcohol"
        margin='dense'
      />
      <TextField
        label="Neuro Muscular Examination"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        disabled={physicalExaminationReadOnly}
        value={examinationFindingNotes.neuroMuscularExamination}
        onChange={handleInputChange}
        name="neuroMuscularExamination"
        margin='dense'
      />
      <TextField
        label="Spine Examination"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        disabled={physicalExaminationReadOnly}
        value={examinationFindingNotes.spineExamination}
        onChange={handleInputChange}
        name="spineExamination"
        margin='dense'
      />
    </Box>
  );
};

export default ExaminationFindingNotes;
