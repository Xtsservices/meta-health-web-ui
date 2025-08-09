import CardioVascular from './PhyscialExaminationTabItems/CardioVascular/CardioVascular';
import ExaminationFindingNotes from './PhyscialExaminationTabItems/ExaminationFindingNotes/ExaminationFindingNotes';
import GeneralPhysicalExamination from './PhyscialExaminationTabItems/GeneralPhysicalExamination/GeneralPhysicalExamination';
import Hepato from './PhyscialExaminationTabItems/Hepato_Gastrointestinal/Hepato';
import Mallampati_Grade from './PhyscialExaminationTabItems/Mallampati_Grade/Mallampati_Grade';
import Neuro from './PhyscialExaminationTabItems/Neuro/Neuro';
import Renal from './PhyscialExaminationTabItems/Renal/Renal';
import Respiratory from './PhyscialExaminationTabItems/Respiratory/Respiratory';
import Others from './PhyscialExaminationTabItems/Others/Others';

const PhysicalExaminationData = [
  {
    id: 1,
    text: 'General Physical Examination',
    value: <GeneralPhysicalExamination />,
  },
  { id: 2, text: 'Mallampati Grade', value: <Mallampati_Grade /> },
  {
    id: 3,
    text: 'Respiratory',
    value: <Respiratory />,
  },
  { id: 4, text: 'Hepato/Gastrointestinal', value: <Hepato /> },
  { id: 5, text: 'CardioVascular', value: <CardioVascular /> },
  { id: 6, text: 'Neuro/Musculoskeietal', value: <Neuro /> },
  { id: 7, text: 'Renal/Endocrine', value: <Renal /> },
  { id: 8, text: 'Other', value: <Others /> },
  {
    id: 9,
    text: 'Examination Finding Notes',
    value: <ExaminationFindingNotes />,
  },
];
export default PhysicalExaminationData;
