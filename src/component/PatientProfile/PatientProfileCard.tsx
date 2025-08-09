import React, { useState } from "react";
import styles from "./PatientProfileCard.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import cast_icon from "../../../src/assets/hospital_staff/cast_icon.png";
import notification_icon from "../../../src/assets/hospital_staff/notification_icon.png";
import warning_white_icon from "../../../src/assets/hospital_staff/warning_white_icon.png";
import { useNavigate } from "react-router-dom";
import { PatientType } from "../../types";
import { authFetch } from "../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { useLocation } from "react-router-dom";
interface Props {
  patient: PatientType;
  patientActive: boolean;
  isDoctor?: boolean;
  handleNofiedUserDetails: (name: string, id: number | undefined) => void;
}

// Define the interface for the full data
interface FullSurgeryData {
  id: number;
  patientTimeLineID: number;
  physicalExamination: any; // Define more specific types if needed
  preopRecord: any; // Define more specific types if needed
  consentForm: any; // Define more specific types if needed
  anesthesiaRecord: any; // Define more specific types if needed
  hospitalID: number;
  postopRecord: any; // Define more specific types if needed
  status: string;
  addedOn: string;
  approvedTime: string | null;
  scheduleTime: string | null;
  completedTime: string | null;
  patientType: string;
  surgeryType: string;
  rejectReason: string;
}

interface SurgeryData {
  status: string;
  addedOn: string;
  hospitalID: number;
  patientType: string;
  surgeryType: string;
  rejectReason: string;
}

const dischargeTypes = {
  Success: 1,
  DOPR: 2,
  Abscond: 3,
  Left: 4,
  Death: 5,
};

// hospital-dashboard/ot/
function getDischargeType(type: number) {
  const entry = Object.entries(dischargeTypes).find(
    ([, value]) => value === type
  );

  if (entry) {
    const reason = entry[0];
  
    return reason;
  }
  return "Unknown";
}

const PatientProfileCard = ({
  patient,
  patientActive,
  isDoctor,
  handleNofiedUserDetails,
}: Props) => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [surgeryData, setSurgeryData] = useState<SurgeryData[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<SurgeryData | null>(null);
  const location = useLocation();

  const handleImageClick = (data: SurgeryData) => {
    setPopupData(data); // Set the data for the popup
    setIsPopupOpen(true); // Open the popup
  };

  const closePopup = () => {
    setIsPopupOpen(false); // Close the popup
    setPopupData(null); // Clear popup data
  };

  const handleBellIcon = () => {
    if (
      patient.patientTimeLineID !== null ||
      patient.patientTimeLineID !== undefined
    )
      handleNofiedUserDetails(patient.pName, patient.patientTimeLineID);
  };

  const getSurgeryStatus = async (
    patientTimeLineID: number,
    hospitalID: number
  ): Promise<void> => {
    if (patientTimeLineID) {
      try {
        const response = await authFetch(
          `ot/${hospitalID}/${patientTimeLineID}/getOTData`,
          user.token
        );

        if (response.status === 200) {
          // Parse the JSON data from the response
          const data: FullSurgeryData[] = response.data;
         

          const formatDate = (dateString: string): string => {
            const date = new Date(dateString);
            return `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(
              -2
            )}/${("0" + date.getDate()).slice(-2)} ${(
              "0" + (date.getHours() % 12 || 12)
            ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)} ${
              date.getHours() >= 12 ? "PM" : "AM"
            }`;
          };

          const finaldata: SurgeryData[] = data.map((item: any) => ({
            status: item.status,
            addedOn: formatDate(item.addedOn),
            hospitalID: item.hospitalID,
            patientType: item.patientType,
            surgeryType: item.surgeryType,
            rejectReason: item.rejectReason,
          }));
          // Update the state with the extracted data
          setSurgeryData(finaldata);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  React.useEffect(() => {
    if (
      patient?.patientTimeLineID !== null &&
      patient.patientTimeLineID !== undefined &&
      patient?.hospitalID
    ) {
      getSurgeryStatus(patient.patientTimeLineID, patient.hospitalID);
    }
  }, [user, patient, patient?.patientTimeLineID]);

  
  const getColor = () => {
    switch (true) {
      case location.pathname.includes("/inpatient"):
        return "#c0e4ff";
      case location.pathname.includes("/triage"):
        return "#ffced6";
      case location.pathname.includes("/emergency-red"):
        return "#f99f99";
      case location.pathname.includes("/emergency-yellow"):
        return "#fff3c4";
      case location.pathname.includes("/emergency-green"):
        return "#c1ffc4";
      case location.pathname.includes("/ot"):
        return "#c0b8e9";
      case location.pathname.includes("/nurse"):
        return "#eab8da";
      default:
        return "#c0e4ff";
    }
  };

  const handleCardClick = () => {
    if (location.pathname.includes("nurse")) {
      navigate(`/nurse/patientsList/${patient.id}`,)
    } else {
      navigate(`${patient.id}`);
    }
  };

  return (
    <div
      className={styles.card}
      style={{ "--top-bg-color": getColor() } as React.CSSProperties}
      onClick={handleCardClick}
    >
      <div
        className={styles.card_warning}
        style={{ background: "transparent" }}
        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          event.stopPropagation();
        }}
       
      >
        {surgeryData.some((item) => item.status === "rejected") && (
          <img
            src={warning_white_icon}
            alt="Rejected Surgery"
            style={{
              filter:
                "invert(36%) sepia(94%) saturate(5000%) hue-rotate(358deg) brightness(98%) contrast(110%)",
              margin: "10px", // Add margin here
            }}
            onClick={() =>
              handleImageClick(
                surgeryData.find((item) => item.status === "rejected")!
              )
            } // Find the rejected surgery data
          />
        )}
       
      
        
        <img
          src={notification_icon}
          onClick={() => {
            handleBellIcon();
          }}
          alt=""
          className={styles.notification}
          style={{
            visibility: `${patient.notificationCount ? "visible" : "hidden"}`,
          }}
        />
      </div>
      <div className={styles.card_img}>
        {patient.imageURL && (
          <img src={patient.imageURL} alt="" className={styles.profile} />
        )}
        {/* <img src={profile_pic} alt="" className={styles.profile} /> */}
        {!patient.imageURL && <PersonIcon className={styles.profile} />}

        <img
          src={cast_icon}
          alt=""
          className={styles.cast}
          style={{
            visibility: `${patient.deviceID ? "visible" : "hidden"}`,
          }}
        />
      </div>
      <h2>{patient.pName}</h2>
      {patientActive && (
        <>
          <p>
            Department:{" "}
            {patient.department
              ? patient?.department?.slice(0, 1)?.toUpperCase() +
                patient?.department?.slice(1)?.toLowerCase()
              : ""}
          </p>
          {isDoctor == false ? (
            ""
          ) : (
            <p className={styles.highlight}>Doctor: {patient.doctorName}</p>
          )}
        </>
      )}

      {!patientActive && (
        <>
          <p>
            DischargeReason : {getDischargeType(patient.dischargeType || 0)}
          </p>
          <div className={styles.highlight}>
            Out:{" "}
            {new Date(patient.endTime).toLocaleDateString("en-GB", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        </>
      )}
      <button>View Details</button>
      {/* Popup surgery reject */}
      {isPopupOpen && popupData && (
        <div className={styles["popup-overlay"]}>
          <div className={styles["popup-box"]}>
            <h2 className={styles["popup-header"]}>Rejected Surgery Details</h2>
            <p className={styles["popup-text"]}>
              <strong>Added On:</strong> {popupData.addedOn}
            </p>
            <p className={styles["popup-text"]}>
              <strong>Hospital ID:</strong> {popupData.hospitalID}
            </p>
            <p className={styles["popup-text"]}>
              <strong>Patient Type:</strong> {popupData.patientType}
            </p>
            <p className={styles["popup-text"]}>
              <strong>Surgery Type:</strong> {popupData.surgeryType}
            </p>
            <p className={styles["popup-text"]}>
              <strong>Reject Reason:</strong> {popupData.rejectReason}
            </p>
            <p className={styles["popup-text"]}>
              <strong>Status:</strong> {popupData.status}
            </p>
            <button className={styles["popup-button"]} onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfileCard;
