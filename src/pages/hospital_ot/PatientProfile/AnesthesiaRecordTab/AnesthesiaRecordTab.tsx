import DropdownBar from "../../../../component/DropdownBar/DropdownBar";
import styles from "./AnesthesiaRecordTab.module.scss";
import AnesthesiaRecordData from "./AnesthesiaRecordData";
import AnesthesiaRecordForm from "./AnesthesiaRecordTabItems/AnesthesiaRecord/AnesthesiaRecordForm";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import useAnesthesiaForm from "../../../../store/formStore/ot/useAnesthesiaForm";
import { authPost } from "../../../../axios/useAuthPost";
import { setError, setSuccess } from "../../../../store/error/error.action";
import { selectCurrPatient } from "../../../../store/currentPatient/currentPatient.selector";
import { useEffect, useState } from "react";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';

const airwayManagementOptions = ["Oral", "Nasal", "ETT", "SGD", "Tracheostomy"];
const airwaySizeOptions = ["Size 1", "Size 2", "Size 3"];
const laryngoscopyOptions = ["Grade 1", "Grade 2", "Grade 3", "Grade 4"];
const vascularAccessOptions = ["IV", "Central"];

type AnesthesiaRecordTabProps = {
  incrementTab: any;
};

const AnesthesiaRecordTab = ({ incrementTab }: AnesthesiaRecordTabProps) => {
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const dispatch = useDispatch();
  const { anesthesiaRecordForm, breathingForm, monitors } = useAnesthesiaForm();

   // State to track whether the "Save" button should be enabled
   const [isSaveEnabled, setIsSaveEnabled] = useState(false);

   // Check if any field in the form has been filled
   useEffect(() => {
     const isFormFilled =
       Object.values(anesthesiaRecordForm).some((value) => value) ||
       Object.values(breathingForm).some((value) => value) ||
       Object.values(monitors).some((value) => value);
 
     setIsSaveEnabled(isFormFilled);
   }, [anesthesiaRecordForm, breathingForm, monitors]);

  const saveHandler = async () => {
    const anesthesiaRecordData = {
      anesthesiaRecordForm: anesthesiaRecordForm,
      breathingForm: breathingForm,
      monitors: monitors,
    };
    console.log("anesthesiaRecordData", anesthesiaRecordData)
    try {
      const response = await authPost(
        `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/anesthesiaRecord`,
        { anesthesiaRecordData: anesthesiaRecordData },
        user.token
      );
      if (response.status === 201) {
        dispatch(setSuccess("Anesthesia form added "));
        incrementTab();
      } else {
        dispatch(setError("Anesthesia form update Failed"));
      }
    } catch (err) {
      // console.log(err);
    }
  };
  const debouncedSaveHandler = debounce(saveHandler, DEBOUNCE_DELAY);

  return (
    <>
      <div className={styles.container}>
        <AnesthesiaRecordForm
          airwayManagementOptions={airwayManagementOptions}
          airwaySizeOptions={airwaySizeOptions}
          laryngoscopyOptions={laryngoscopyOptions}
          vascularAccessOptions={vascularAccessOptions}
        />
        <div className={styles.container_dropdown}>
          {AnesthesiaRecordData.map((item) => {
            return (
              <DropdownBar key={item.id} text={item.text} value={item.value} />
            );
          })}
        </div>
        <div className={styles.container_button}>
          <button className={styles.NextButton} onClick={debouncedSaveHandler} disabled={!isSaveEnabled} >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AnesthesiaRecordTab;
