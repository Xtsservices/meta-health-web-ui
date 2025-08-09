import styles from './PhysicalExamination.module.scss';
import DropdownBar from '../../../../component/DropdownBar/DropdownBar';
import PhysicalExaminationData from './PhysicalExaminationData';
import FormComponent from './PhyscialExaminationTabItems/FormComponent/FormComponent';
import useOTConfig from '../../../../store/formStore/ot/useOTConfig';
import { FormControl } from '@mui/material';
import usePhysicalExaminationForm from '../../../../store/formStore/ot/usePhysicalExaminationForm';
import { useCallback } from 'react';
import { authPost } from '../../../../axios/useAuthPost';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../../store/user/user.selector';
import { setError } from '../../../../store/error/error.action';
import { useParams } from 'react-router-dom';
import { selectCurrPatient } from '../../../../store/currentPatient/currentPatient.selector';

type PhysicalExaminationTabProps = {
  incrementTab: any;
};

const PhysicalExaminationTab = ({
  incrementTab,
}: PhysicalExaminationTabProps) => {
  const user = useSelector(selectCurrentUser);
  const { id } = useParams();
  // const timeline = useSelector(selectTimeline);
  const {
    mainFormFields,
    examinationFindingNotes,
    generalphysicalExamination,
    mallampatiGrade,
    respiratory,
    hepato,
    cardioVascular,
    neuroMuscular,
    renal,
    others,
  } = usePhysicalExaminationForm();

  const currentPatient = useSelector(selectCurrPatient);

  const [isInitialTabsNextButtonVisible, isInitialTabsAPICallAllowed] =
    useOTConfig((state) => [
      state.isInitialTabsNextButtonVisible(),
      state.isInitialTabsAPICallAllowed(),
    ]);

  const nextHandler = useCallback(() => {
    const physicalExaminationData = {
      mainFormFields,
      examinationFindingNotes,
      generalphysicalExamination,
      mallampatiGrade,
      respiratory,
      hepato,
      cardioVascular,
      neuroMuscular,
      renal,
      others,
    };
    console.log("/physicalExaminat", physicalExaminationData)
    const postPhysicalExamination = async () => {
      try {
        const response = await authPost(
          `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/physicalExamination`,
          { physicalExaminationData: physicalExaminationData },
          user.token
        );
        if (response.status === 201) {
          incrementTab();
        } else {
          setError('Physical Examination Failed');
        }
      } catch (err) {
        // console.log(err);
      }
    };

    if (isInitialTabsAPICallAllowed) postPhysicalExamination();
    if (isInitialTabsNextButtonVisible && !isInitialTabsAPICallAllowed) {
      incrementTab();
    }
  }, [
    mainFormFields,
    examinationFindingNotes,
    generalphysicalExamination,
    mallampatiGrade,
    respiratory,
    hepato,
    cardioVascular,
    neuroMuscular,
    renal,
    others,
    isInitialTabsAPICallAllowed,
    isInitialTabsNextButtonVisible,
    user.hospitalID,
    user.token,
    id,
    incrementTab,
  ]);

  return (
    <div className={styles.patientDetails_Medical}>
      <FormControl component="fieldset" disabled={!isInitialTabsAPICallAllowed}>
        <FormComponent />
        {PhysicalExaminationData.map((item) => {
          return (
            <DropdownBar key={item.id} text={item.text} value={item.value} />
          );
        })}
      </FormControl>

      <div className={styles.patientDetails_Medical_Button}>
        {isInitialTabsNextButtonVisible && (
          <button className={styles.nextButton} onClick={nextHandler}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};
export default PhysicalExaminationTab;
