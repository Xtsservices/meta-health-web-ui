import styles from "./PatientCard.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation, useNavigate } from "react-router";
import { PatientCardData } from "../../../types";

interface PatientCardProps {
  patient: PatientCardData;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  tab?: string;
}

const PatientCard = ({ patient, setSearch, tab }: PatientCardProps) => {
  const navigate = useNavigate();
  const path = useLocation();

  const pathSplit = path.pathname.split("/");

  const navigateHandler = () => {
    if (setSearch) {
      setSearch("");
    }
    const idToPass =
      patient.prescriptionURL || patient?.fileName
        ? patient.id
        : patient.timeLineID;
    const newState: {
      timeLineID: number | undefined;
      prescriptionURL?: string;
      tab?: string;
    } = {
      timeLineID: idToPass,
      tab: tab || "normal",
    };
    // Include prescriptionURL only if it exists
    if (patient.prescriptionURL || patient?.fileName) {
      newState.prescriptionURL = patient.prescriptionURL || patient?.fileName;
    }

    if (pathSplit.includes("list")) {
      navigate(`./${idToPass}`, { state: newState });
    } else {
      navigate(`./list/${idToPass}`, { state: newState });
    }
  };

  console.log("patient====", patient);
  const getColor = () => {
    switch (true) {
      case location.pathname.includes("/pathology"):
        return "#e7c2dd";
      default:
        return "#ecdba7";
    }
  };

  console.log("patient===", patient);

  return (
    <div
      className={styles.card}
      style={{ "--top-bg-color": getColor() } as React.CSSProperties}
      onClick={navigateHandler}
    >
      <div className={styles.card_img}>
        {patient.photo && (
          <img src={patient.photo} alt="" className={styles.profile} />
        )}
        {!patient.photo && <PersonIcon className={styles.profile} />}
      </div>
      <div className={styles.patientCard__details}>
        <h2>
          {patient.pName.charAt(0).toUpperCase() + patient.pName.slice(1)}
        </h2>
        <h4>Department: {patient.department_name}</h4>
        <p>Doctor: </p>
        <p>Ward No.: {patient.ward_name}</p>
      </div>
      <div className={styles.patientCard__line} />
      <button className={styles.patientCard__button} onClick={navigateHandler}>
        View Details
      </button>
    </div>
  );
};

export default PatientCard;
