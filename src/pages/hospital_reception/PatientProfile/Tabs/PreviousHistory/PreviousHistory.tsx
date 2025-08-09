import styles from "./previousHistory.module.scss";
import React from "react";
import TimelineItem from "./TimelineItem";
import { TimelineType } from "../../../../../types";

const PreviousHistory = () => {
  const [timelines] = React.useState<TimelineType[]>([]);
  // const timeline = useSelector(selectTimeline);

  return (
    <>
      <div className={styles.container}>
        {timelines.length > 0 && (
          <div className={styles.timeline_container}>
            {timelines?.map((timeline, idx) => (
              <TimelineItem timeline={timeline} key={idx} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PreviousHistory;
