import React, { useRef } from "react";
import styles from "./Symptomps.module.scss";
import symptomps_gif from "./../../../../../src/assets/PatientProfile/symptomps_tab_icon.gif";
import SymptompsTable from "./SymptompsTable";
import { symptompstype } from "../../../../types";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
function SymptompsTab() {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const getAllSymptompsApi = useRef(true)
  // console.log("timeline from symptom tab", timeline);
  const getAllSymptomps = async () => {
    const response = await authFetch(`symptom/${timeline.patientID}`, user.token);
    console.log("response while fetching all the symptom", response);
    if (response.message == "success") {
      setSelectedList(response.symptoms);
    }
  };
  React.useEffect(() => {
    if (user.token && timeline.id && getAllSymptompsApi.current) {
      getAllSymptompsApi.current = false
      getAllSymptomps();
    }
  }, [user, timeline]);
  const [selectedList, setSelectedList] = React.useState<symptompstype[]>([]);
  // const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_info}>
          <div className={styles.info_header}>
            <h4>Symptoms At Admission</h4>
          </div>
          <div className={styles.info_list}>
            <SymptompsTable
              selectedList={selectedList}
              setSelectedList={setSelectedList}
            />
          </div>
        </div>
        <div className={styles.container_gif}>
          <img src={symptomps_gif} alt="" />
        </div>
      </div>
    </>
  );
}

export default SymptompsTab;
