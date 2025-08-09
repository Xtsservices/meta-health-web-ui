import styles from "./PatientFileTab.module.scss";
import DropdownBar from "../../../../component/DropdownBar/DropdownBar";
import dataPatientFile from "./PatientData";
import useOTConfig from "../../../../store/formStore/ot/useOTConfig";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import usePatientFileStore from "../../../../store/formStore/ot/usePatientFileForm";
import React from "react";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";

type PatientFileTabProps = {
  incrementTab: () => void;
};

const PatientFileTab = ({ incrementTab }: PatientFileTabProps) => {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const { setSymptoms, setVitals, setTestReports } = usePatientFileStore();

  const [isInitialTabsNextButtonVisible, isInitialTabsAPICallAllowed] =
    useOTConfig((state) => [
      state.isInitialTabsNextButtonVisible(),
      state.isInitialTabsAPICallAllowed(),
    ]);

  const getAllSymptomps = async () => {
    const response = await authFetch(`symptom/${timeline.patientID}`, user.token);
    if (response.message == "success") {
      setSymptoms(response.symptoms);
    }
  };

  const getAllVitals = async () => {
    const response = await authFetch(
      `vitals/${user.hospitalID}/${timeline.patientID}`,
      user.token
    );
    // console.log("vitals", response);
    if (response.message == "success") {
      setVitals(response.vitals);
    }
  };

  const getAllReports = async () => {
    const response = await authFetch(
      `attachment/${user.hospitalID}/all/${timeline.patientID}`,
      user.token
    );
    if (response.message == "success") {
      setTestReports(response.attachments);
    }
  };

  React.useEffect(() => {
    if (user.token && timeline.id) {
      getAllSymptomps();
      getAllVitals();
      getAllReports();
    }
  }, [user, timeline.id]);

  const nextHandler = () => {
    // Call the api
    if (!isInitialTabsAPICallAllowed) null;
    if (isInitialTabsNextButtonVisible) {
      incrementTab();
    }
  };

  return (
    <div className={styles.patientDetails_Medical}>
      {dataPatientFile.map((item) => {
        return (
          <DropdownBar key={item.id} text={item.text} value={item.value} />
        );
      })}

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

export default PatientFileTab;
