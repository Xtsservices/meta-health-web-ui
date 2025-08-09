import React, { useRef } from "react";
import { useSelector } from "react-redux";
import styles from "./previoushistory.module.scss";
import TimelineItem from "./TimelineItem";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import { selectCurrPatient } from "../../../../store/currentPatient/currentPatient.selector";
import { TimelineType } from "../../../../types";



const PreviousHistory = () => {
  const getAllTimelineApi = useRef(true)
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const [timelines, setTimelines] = React.useState<TimelineType[]>([]);

  const getAllTimeline = async () => {
    const res = await authFetch(
      `patientTimeLine/hospital/${user.hospitalID}/patient/${currentPatient.id}`,
      user.token
    );

    if (res.message == "success") {
      setTimelines(res.patientTimeLines);
    }
  };
  React.useEffect(() => {
    if (currentPatient.id && user.token && getAllTimelineApi.current) {
      getAllTimelineApi.current = false
      getAllTimeline();
    }
  }, [currentPatient, user]);
  
  return (
    <>
      <div className={styles.container}>
        {timelines.length > 0 && (
          <div className={styles.timeline_container}>
            {timelines?.map((timeline, idx) => (
              <TimelineItem timeline={timeline} index = {idx} key={idx} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PreviousHistory;
