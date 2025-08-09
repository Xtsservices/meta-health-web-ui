import MedicationSelector from '../../../../component/MedicationSelector/MedicationSelector';
import usePostOPStore from '../../../../store/formStore/ot/usePostOPForm';
import Tests from './PostOpRecordTabItems/Tests/Tests';

const PostOpRecordData = [
  {
    id: 1,
    text: 'Tests',
    value: <Tests />,
  },
  {
    id: 2,
    text: 'Post-Medication',
    // value: <MedicationSelector store={usePostOPStore} />,
    value: <MedicationSelector store={usePostOPStore} setPostMedications={usePostOPStore.getState().setPostMedications} />,
 
  },
];
export default PostOpRecordData;
