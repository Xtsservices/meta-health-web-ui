import React from "react";
import styles from "./previousHistory.module.scss";
import ReportDialogs from "./ReportDialog";
import { TimelineType } from "../../../../../types";
import { patientStatus } from "../../../../../utility/role";

type timelineProp = {
  timeline: TimelineType;
};
function TimelineItem({ timeline }: timelineProp) {
  type colorObjType = {
    [key: string]: string;
  };
  const colorObj: colorObjType = {
    [patientStatus.inpatient]: "#FFA07A",
    [patientStatus.outpatient]: "#ADD8E6",
    [patientStatus.emergency]: "#98FB98",
  };
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  // const [timelineID, setTimeLineID] = React.useState<number>(0);
  return (
    <>
      <div className={styles.timeline_item}>
        <span className={styles.circle} />
        <div
          className={styles.timeline_item_content}
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <span
            className={styles.tag}
            style={{
              background:
                colorObj[timeline.patientStartStatus as keyof colorObjType],
            }}
          >
            {
              Object.keys(patientStatus)[
                Object.values(patientStatus).indexOf(
                  timeline.patientStartStatus || 0
                )
              ]
            }
          </span>
          <time>
            {String(
              new Date(timeline.startTime || "")
                .toLocaleString("en-GB")
                .split(",")[0]
            ) +
              " - " +
              (timeline.patientEndStatus
                ? String(
                    new Date(timeline.endTime)
                      .toLocaleString("en-GB")
                      .split(",")[0]
                  )
                : "Present")}
          </time>
          <p>{timeline.diagnosis || "Diagnosis data not available"}</p>
          {/* {timeline.link && (
            <a href={timeline.link.url} target="_blank" rel="noopener noreferrer">
              {timeline.link.text}
            </a>
          )} */}
        </div>
      </div>
      {openDialog ? (
        <ReportDialogs
          setOpen={setOpenDialog}
          open={openDialog}
          timelineID={timeline.id || 0}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default TimelineItem;
