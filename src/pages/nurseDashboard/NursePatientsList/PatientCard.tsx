import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PatientProfileCard.module.scss";
import PersonIcon from "@mui/icons-material/Person";

interface PatientCardProps {
  patient: {
    pName: string;
    photo?: string;
    department: string;
    id: string;
    doctorName: string;
  };
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => {
        navigate(`${patient.id}`);
      }}
    >
      <div className={styles.card_header}>
        <div className={styles.card_img}>
          {patient.photo ? (
            <img src={patient.photo} alt="Profile" className={styles.profile} />
          ) : (
            <PersonIcon className={styles.profile_icon} />
          )}
        </div>
      </div>
      <div className={styles.card_body}>
        <h2 className={styles.name}>{patient.pName}</h2>
        <p className={styles.department}>Department: {patient.department}</p>
        <p className={styles.doctor}>Doctor: {patient.doctorName}</p>
        <button className={styles.details_button}>View Details</button>
      </div>
    </div>
  );
};

export default PatientCard;
