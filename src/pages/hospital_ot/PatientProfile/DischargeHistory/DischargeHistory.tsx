import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  selectCurrPatient,
  selectTimeline,
} from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import { TimelineType } from "../../../../types";
import styles from "./DischargeHistory.module.scss";
import {
  Reminder,
  usePrintInPatientStore,
} from "../../../../store/zustandstore";
import { capitalizeFirstLetter } from "../../../../utility/global";

const dischargeTypes = {
  Success: 1,
  DOPR: 2,
  Abscond: 3,
  Left: 4,
  Death: 5,
  tranfer: 6,
};

function getDischargeType(type: number) {
  const entry = Object.entries(dischargeTypes).find(
    ([, value]) => value === type
  );

  if (entry) {
    const reason = entry[0];
    // console.log(`reason: ${reason}`)
    return reason;
  }
  return "Unknown";
}

function compareDates(a: Reminder, b: Reminder) {
  return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
}

function DischargeHistory() {
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const [history, setHistory] = React.useState<TimelineType[]>([]);
  const [filteredHistory, setFilteredHistory] = React.useState<TimelineType[]>(
    []
  );
  //   console.log("Repor page is working");
  const getAllDischargeHistory = async () => {
    const response = await authFetch(
      `patientTimeLine/hospital/${user.hospitalID}/patient/${timeline.patientID}`,
      user.token
    );
    // console.log("response ", response);
    if (response.message == "success") {
      setHistory(response.patientTimeLines);
    }
  };
  React.useEffect(() => {
    if (timeline.id && user.token) {
      getAllDischargeHistory();
    }
  }, [timeline, user]);

  React.useEffect(() => {
    setFilteredHistory(history.splice(1)); // 0 index not required
  }, [history]);

  const {
    setSymptoms,
    setReminder,
    setVitalAlert,
    setMedicineHistory,
    setVitalFunction,
    // vitalAlert,
    // reminder,
    // medicalHistory,
    // symptoms,
    // vitalFunction,
  } = usePrintInPatientStore();

  ///////////////////////////Loading Data////////////////////////////////
  const loadPrintData = async (timeLineID: number) => {
    // console.log("function loaded");
    const responseTimeline = await authFetch(
      `medicine/${timeLineID}/reminders/all`,
      user.token
    );
    // console.log("all medicine response", response);
    if (responseTimeline.message == "success") {
      setReminder(responseTimeline.reminders.sort(compareDates));
    }
    const alertResponse = await authFetch(
      `alerts/hospital/${user.hospitalID}/vitalAlerts/${currentPatient.id}`,
      user.token
    );
    if (alertResponse.message == "success") {
      setVitalAlert(alertResponse.alerts);
    }
    const responseSymptoms = await authFetch(
      `symptom/${currentPatient.id}`,
      user.token
    );
    // console.log("responseSymptoms while fetching all the symptom", responseSymptoms);
    if (responseSymptoms.message == "success") {
      setSymptoms(responseSymptoms.symptoms);
    }
    const responseMedicalHistory = await authFetch(
      `history/${user.hospitalID}/patient/${currentPatient.id}`,
      user.token
    );
    // console.log("resonse medical", responseMedicalHistory);
    if (responseMedicalHistory.message == "success") {
      setMedicineHistory(responseMedicalHistory.medicalHistory);
    }
    const vitalFunctionResponse = await authFetch(
      `vitals/${user.hospitalID}/functions/${currentPatient.id}`,
      user.token
    );
    if (vitalFunctionResponse.message == "success") {
      setVitalFunction(vitalFunctionResponse);
    }
    if (
      alertResponse.message == "success" &&
      responseSymptoms.message == "success" &&
      // responseMedicalHistory.message == "success" &&
      responseTimeline.message == "success"
    ) {
      // setDataLoaded(true);
      setTimeout(() => {
        const button = document.querySelector("#pdf-link") as HTMLAnchorElement;
        if (button) {
          button.click();
        }
      }, 800);
    }
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.container_header}>
        {!history.length ? "No Discharge History found" : ""}
      </div> */}
      <div className={styles.report}>
        {filteredHistory.map((item) => {
          return (
            <div className={styles.uploaded_box} key={item.id}>
              <h6>Discharge Type</h6>
              <h3>
                {capitalizeFirstLetter(
                  getDischargeType(Number(item?.dischargeType))
                )}
              </h3>

              <h6>Discharge On</h6>
              <h3>{item.endTime.split("T")[0]}</h3>

              <div className={styles.uploaded_box_buttons}>
                <button
                  className=""
                  onClick={() => loadPrintData(item.id || 0)}
                >
                  View{" "}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DischargeHistory;
