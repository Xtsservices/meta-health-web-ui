import React from "react";
import { TimelineType } from "../../../../types";
import { patientStatus } from "../../../../utility/role";
import styles from "./previoushistory.module.scss";
import TimeLineDailog from "./TimeLineDailog";
import dayjs from "dayjs";
type timelineProp = {
  timeline: TimelineType;
  index: number;
};

// type SymptomDetail = {
//   symptom: string;
//   duration: string; // This can be number as well, if you want to parse it later.
//   symptomAddedOn: string; // Date-time string
//   durationParameter: string; // Example: 'days', 'hours', etc.
// };



type SurgeryDetail = {
  id: number;
  scope: string;
  status: string;
  addedOn: string;
  approvedBy: string;
  patientType: string;
  surgeryType: string;
  approvedTime?: string | null;
  rejectReason?: string;
  scheduleTime: string;
  completedTime?: string | null;
  key?: number;
  patientAddedon?: string;
  rejectedTime?: string | null;
};

type TransferDetail = {
  toDoc: string;
  reason: string;
  toWard: string;
  fromDoc: string;
  fromWard: string;
  hospitalName: string | null;
  transferDate: string;
  transferType: number;
  transferToDepartment: number;
  transferFromDepartment: number;
};

type ExternalTransferDetail = {
  reason: string;
  fromDoc: string;
  fromWard: string;
  transferDate: string; // or Date if you want to parse it into a Date object
  transferType: number;
  tohospitalName: string;
  fromhospitalName: string;
  transferFromDepartment: number;
};

type HandshakeDetail = {
  scope?: string;
  fromDoc: string;
  toDoc: string;
  assignedDate: string;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "Invalid Date";
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() + 330); // Add 5 hours and 30 minutes (330 minutes)

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
const formatOtDate = (dateString: string) => {
  if (!dateString) return "Invalid Date";
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes()); // Add 5 hours and 30 minutes (330 minutes)

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Component for rendering a timeline event
const TimelineEvent: React.FC<{
  children: React.ReactNode;
  tagBackground: string;
  tagText: string;
  onEventClick?: () => void;
}> = ({ children, tagBackground, tagText, onEventClick }) => (
  <div onClick={onEventClick} className={styles.timeline_item}>
    <span className={styles.circle} />
    <div className={styles.timeline_item_content}>
      <span
        className={styles.tag}
        style={{
          borderRadius: "3px",
          background: tagBackground,
          textTransform: "uppercase",
        }}
      >
        {tagText}
      </span>
      {children}
    </div>
  </div>
);

function getDepartment(module: number): string {
  switch (module) {
    case 1:
      return "OUTPATIENT";
    case 2:
      return "INPATIENT";
    case 3:
      return "EMERGENCY";
    default:
      return "Unknown Department";
  }
}

// Component for rendering transfer details
const TransferDetails: React.FC<{
  transferDetails: TransferDetail;
  primaryDoc: string;
}> = ({ transferDetails, primaryDoc }) => {
  return (
    <ul className={styles.unorderedStyle}>
      <li className={styles.ulMainSubHeading}>
        Patient transferred from{" "}
        {transferDetails?.transferFromDepartment ==
        transferDetails?.transferToDepartment
          ? `${transferDetails.fromWard} to ${transferDetails.toWard}`
          : `${getDepartment(
              transferDetails?.transferFromDepartment
            )} to ${getDepartment(transferDetails?.transferToDepartment)}`}
      </li>
      <li className={styles.ultime}>
        Date Of Transfer:{" "}
        {formatDate(
          transferDetails?.transferDate ? transferDetails.transferDate : "N/A"
        )}
      </li>
      <li className={styles.ulMainSubHeading}>
        Transfer
        {transferDetails?.transferFromDepartment ==
        transferDetails?.transferToDepartment
          ? ` to : Dr. ${primaryDoc}`
          : ` by : Dr. ${
              transferDetails?.fromDoc ? transferDetails.fromDoc : "N/A"
            }`}
      </li>
    </ul>
  );
};

// Component for rendering transfer details
const ExternalTransferDetails: React.FC<{
  externalTransferDetails: ExternalTransferDetail[];
}> = ({ externalTransferDetails }) => (
  <>
    {externalTransferDetails?.length > 0 && (
      <>
        <ul className={styles.unorderedStyle}>
          <li className={styles.ulMainSubHeading}>
            Patient Transferred from{" "}
            {externalTransferDetails[0].fromhospitalName} to{" "}
            {externalTransferDetails[0].tohospitalName}
          </li>
          <li className={styles.ultime}>
            Date Of Transfer :{" "}
            {formatDate(externalTransferDetails[0].transferDate)}
          </li>
          <li className={styles.ulMainSubHeading}>
            Transfer By :{" "}
            <span className={styles.ulMainValue}>
              {externalTransferDetails[0].fromDoc}{" "}
            </span>
          </li>
        </ul>
      </>
    )}
  </>
);

// Component for rendering surgery details
const SurgeryDetails: React.FC<{
  otData: SurgeryDetail;
}> = ({ otData }) => (
  <>
    <ul className={styles.unorderedStyle}>
      <li className={styles.ulMainSubHeading}>
        Type of Surgery: {otData.surgeryType}
      </li>
      <li className={styles.ulMainSubHeading}>
        Surgery Urgency: {otData.patientType}
      </li>

      {/* Surgeon Section */}
      {otData.scope === "surgon" && (
        <>
          <li className={styles.ulMainSubHeading}>
            Surgery Status: {otData.status}
          </li>
          <li className={styles.ultime}>
            Date Of Surgery: {formatOtDate(otData?.scheduleTime ?? "N/A")}
          </li>
          <li className={styles.ulMainSubHeading}>
            Scheduled By: {otData.approvedBy ?? "N/A"}
          </li>
        </>
      )}

      {otData.status == "pending" && (
        <>
          <li className={styles.ulMainSubHeading}>Surgery Status: Pending</li>

          <li className={styles.ultime}>
            Request Date: {formatOtDate(otData?.addedOn ?? "N/A")}
          </li>
        </>
      )}

      {/* Anesthetic Section */}
      {otData.scope === "anesthetic" && (
        <>
          {/* Common fields for Anesthetic */}

          {otData.status === "rejected" && (
            <>
              <li className={styles.ulMainSubHeading}>
                Surgery Status: Rejected
              </li>
              <li className={styles.ulMainSubHeading}>
                Rejection Reason: {otData.rejectReason ?? "N/A"}
              </li>
              <li className={styles.ultime}>
                Rejected Date: {formatOtDate(otData?.rejectedTime ?? "N/A")}
              </li>
              <li className={styles.ulMainSubHeading}>
                Rejected By: {otData.approvedBy ?? "N/A"}
              </li>
            </>
          )}

          {(otData.status === "approved" || otData.status === "scheduled") && (
            <>
              <li className={styles.ulMainSubHeading}>
                Surgery Status: Approved
              </li>
              <li className={styles.ultime}>
                Approved Date: {formatOtDate(otData?.approvedTime ?? "N/A")}
              </li>
              <li className={styles.ulMainSubHeading}>
                Approved By: {otData.approvedBy ?? "N/A"}
              </li>
            </>
          )}
        </>
      )}
    </ul>
  </>
);

// Component for rendering handshake details
const HandshakeDetails: React.FC<{ handshake: HandshakeDetail }> = ({
  handshake,
}) => {
  return (
    <ul className={styles.unorderedStyle}>
      <li className={styles.ulMainSubHeading}>
        Patient was Reffered to Dr. {handshake?.toDoc ? handshake.toDoc : "N/A"}
      </li>
      <li className={styles.ultime}>
        Date :{" "}
        {formatDate(handshake?.assignedDate ? handshake.assignedDate : "N/A")}
      </li>
      <li className={styles.ulMainSubHeading}>
        Transfer by : Dr. {handshake?.fromDoc ? handshake.fromDoc : "N/A"}
      </li>
    </ul>
  );
};

const TimelineItem: React.FC<timelineProp> = ({ timeline, index }) => {

  const colorObj: Record<number, string> = {
    [patientStatus.inpatient]: "#FFA07A",
    [patientStatus.outpatient]: "#7EC1D6",
    [patientStatus.emergency]: "#98FB98",
    [patientStatus.operationTheatre]: "#A094D9",
    [patientStatus.discharged]: "#F59706"
  };
  //
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);

  function getTagText(operationData: any): string {
    const { scope, status, approvedTime, rejectedTime } = operationData;

    if (scope == null && approvedTime == null && rejectedTime == null) {
      return "SURGERY REQUESTED";
    }

    if (scope === "anesthetic" && status === "rejected") {
      return "SURGERY REJECTED";
    }

    if (
      scope === "anesthetic" &&
      (status === "approved" || status === "scheduled")
    ) {
      return "SURGERY APPROVED";
    }

    if (scope === "surgon" && status === "scheduled") {
      return "SURGERY SCHEDULED";
    }

    return "N/A";
  }

  function sortKeysByTimestamp(obj: any) {
    // Helper function to get the earliest timestamp for a given key
    const getEarliestTimestamp = (key: any) => {
      switch (key) {
        case "transferDetails":
          return obj[key]?.[0]?.transferDate;
        case "externalTransferDetails":
          return obj[key]?.[0]?.transferDate;
        case "handshakeDetails":
          return obj[key]?.[0]?.assignedDate;
        case "operationTheatreDetails":
          return obj[key]?.[0]?.addedOn;
        case "symptomsDetails":
          return obj[key]?.[0]?.symptomAddedOn;
        case "isFollowUp":
          return obj[key]?.[0]?.followUpDate;
        case "diagnosis":
          // If diagnosis exists, use its timestamp; otherwise, use symptomsDetails
          return obj.diagnosis !== null
            ? obj.endTime
            : obj.symptomsDetails?.[0]?.symptomAddedOn;
        case "discharge":
          // Include discharge only if patientEndStatus is 21
          return obj.patientEndStatus === 21 ? obj.endTime : null;
        case "revisit":
          // Include revisit only if isRevisit is 1
          return obj.isRevisit === 1 ? obj.startTime : null;
        default:
          return null;
      }
    };

    // List of keys to sort
    const keysToSort = [
      "transferDetails",
      "externalTransferDetails",
      "handshakeDetails",
      "operationTheatreDetails",
      "diagnosis", // Diagnosis and symptomsDetails are treated as one
      "revisit",
      "discharge",
      "isFollowUp",
    ];

    // Filter out keys that are null, undefined, or do not meet the condition
    const validKeys = keysToSort.filter((key) => {
      if (key === "discharge") {
        return obj.patientEndStatus === 21; // Include discharge only if patientEndStatus is 21
      }
      if (key === "revisit") {
        return obj.isRevisit === 1; // Include revisit only if isRevisit is 1
      }
      if (key === "diagnosis") {
        // Include diagnosis/symptomsDetails if either exists
        return obj.diagnosis !== null || obj.symptomsDetails !== null;
      }
      return obj[key] !== null && obj[key] !== undefined;
    });

    // Sort the keys based on the earliest timestamp
    validKeys.sort((a, b) => {
      const timestampA = new Date(getEarliestTimestamp(a)).getTime();
      const timestampB = new Date(getEarliestTimestamp(b)).getTime();
      return timestampA - timestampB;
    });

    // Replace 'diagnosis' with 'symptomsDetails' if diagnosis is null
    const finalKeys = validKeys.map((key) => {
      if (key === "diagnosis" && obj.diagnosis === null) {
        return "symptomsDetails";
      }
      return key;
    });

    return finalKeys;
  }

  const sortedKeys = sortKeysByTimestamp(timeline);

  // case "symptomsDetails":
  //   return (
  //     <TimelineEvent
  //       tagBackground={"#7EC1D6"}
  //       tagText={timeline?.patientStartStatus ? getDepartment(timeline.patientStartStatus) : "N/A"}
  //     >
  //       <ul className={styles.unorderedStyle}>
  //         <li className={styles.ulMainSubHeading}>Symptoms data is Available</li>
  //         <li className={styles.ultime}>
  //           {formatDate(timeline.symptomsDetails?.[0]?.symptomAddedOn)}
  //         </li>
  //       </ul>
  //     </TimelineEvent>
  //   );

  function onEventClick() {
    setOpenDialog(true);
  }

  const renderTimelineEvents = () => {
    return sortedKeys.map((key) => {
      switch (key) {
        case "transferDetails":
          return timeline?.transferDetails?.map((transfer, idx) => (
            <TimelineEvent
              key={idx}
              tagBackground={
                transfer?.transferFromDepartment ===
                transfer?.transferToDepartment
                  ? "#A7D670"
                  : colorObj[transfer?.transferToDepartment||1]
              }
              tagText={
                transfer?.transferFromDepartment ===
                transfer?.transferToDepartment
                  ? "Internal Transfer"
                  : getDepartment(transfer.transferToDepartment)
              }
            >
              <TransferDetails
                transferDetails={transfer}
                primaryDoc={
                  timeline?.doctorDetails?.doctorName
                    ? timeline.doctorDetails.doctorName
                    : "N/A"
                }
              />
            </TimelineEvent>
          ));

        case "handshakeDetails":
          return timeline.handshakeDetails?.map(
            (handshake, idx) =>
              handshake?.scope === "doctor" && (
                <TimelineEvent
                  key={idx}
                  tagBackground="#1977F3"
                  tagText="Handshake"
                >
                  <HandshakeDetails handshake={handshake} />
                </TimelineEvent>
              )
          );

        case "operationTheatreDetails":
          return timeline?.operationTheatreDetails?.map(
            (operationData, idx) => (
              <TimelineEvent
                key={idx}
                tagBackground={"#A094D9"}
                tagText={getTagText(operationData)}
              >
                <SurgeryDetails otData={operationData} />
              </TimelineEvent>
            )
          );

        case "diagnosis":
          return (
            <TimelineEvent
            tagBackground={colorObj[timeline?.patientStartStatus||1]}
              tagText={
                timeline?.patientStartStatus
                  ? getDepartment(timeline.patientStartStatus)
                  : "N/A"
              }
              onEventClick={onEventClick}
            >
              <ul
                onClick={() => onEventClick()}
                className={styles.unorderedStyle}
              >
                <li className={styles.ulMainSubHeading}>
                  Diagnosis data is Available
                </li>
                <li className={styles.ultime}>
                  {formatDate(timeline.endTime)}
                </li>
              </ul>
            </TimelineEvent>
          );

        case "revisit":
          return (
            <TimelineEvent
              tagBackground={colorObj[timeline?.patientStartStatus||1]}

              tagText={
                timeline?.patientStartStatus
                  ? getDepartment(timeline.patientStartStatus)
                  : "Revisit"
              }
            >
              <ul className={styles.unorderedStyle}>
                <li className={styles.ulMainSubHeading}>
                  Revisit to :{" "}
                  {timeline?.patientStartStatus &&
                    getDepartment(timeline.patientStartStatus)}
                </li>
                <li className={styles.ulMainSubHeading}>
                  Revisited by : {timeline?.addedBy}
                </li>
                <li className={styles.ultime}>
                  Revisited on : {formatDate(timeline.startTime)}
                </li>
              </ul>
            </TimelineEvent>
          );

        case "isFollowUp":
          return (
            <TimelineEvent
            tagBackground={colorObj[timeline?.patientStartStatus||1]}

              tagText={
                timeline?.isFollowUp
                  ? getDepartment(timeline.isFollowUp.patientStartStatus)
                  : "Follow Up"
              }
            >
              <ul className={styles.unorderedStyle}>
                <li className={styles.ulMainSubHeading}>
                  Follow Up by : {timeline?.addedBy}
                </li>
                <li className={styles.ultime}>
                  Follow Up Date :{" "}
                  {timeline?.isFollowUp?.followUpDate
                    ? dayjs(timeline.isFollowUp.followUpDate).format(
                        "MMMM D, YYYY"
                      )
                    : "N/A"}
                </li>
              </ul>
            </TimelineEvent>
          );

        case "discharge":
          return (
            <TimelineEvent
              tagBackground={colorObj[patientStatus.discharged]}
              tagText="Discharged"
            >
              <ul className={styles.unorderedStyle}>
                <li className={styles.ulMainSubHeading}>Patient Discharged</li>
                <li className={styles.ultime}>
                  Date : {formatDate(timeline.endTime)}
                </li>
                <li className={styles.ulMainSubHeading}>
                  Discharged by :{" "}
                  {timeline?.doctorDetails &&
                    timeline?.doctorDetails.doctorName}
                </li>
              </ul>
            </TimelineEvent>
          );

        case "externalTransferDetails":
          return (
            <>
              {timeline.externalTransferDetails &&
                timeline.externalTransferDetails.length > 0 && (
                  <TimelineEvent
                    tagBackground="#D792EE"
                    tagText="External Transfer"
                  >
                    <ExternalTransferDetails
                      externalTransferDetails={timeline.externalTransferDetails}
                    />
                  </TimelineEvent>
                )}
            </>
          );

        default:
          return null;
      }
    });
  };

  return (
    <>
      {/* ==patient admited===== */}
      {index === 0 && (
        <TimelineEvent
          tagBackground={
            (timeline?.patientStartStatus &&
              colorObj[timeline?.patientStartStatus]) ||
            "#ccc"
          }
          tagText={
            Object.keys(patientStatus)[
              Object.values(patientStatus).indexOf(
                timeline.patientStartStatus || 0
              )
            ] || "Unknown"
          }
        >
          <ul className={styles.unorderedStyle}>
            <li className={styles.ulMainSubHeading}>
              Patient added by : {timeline?.addedBy}
            </li>
            <li className={styles.ultime}>
              {formatDate(timeline.patientAddedOn)}
            </li>
          </ul>
        </TimelineEvent>
      )}

      {/* Render the rest of the timeline events */}
      {renderTimelineEvents()}

      {openDialog && (
        <TimeLineDailog
          setOpen={setOpenDialog}
          open={openDialog}
          timelineData={timeline}
        />
      )}
    </>
  );
};

export default TimelineItem;
