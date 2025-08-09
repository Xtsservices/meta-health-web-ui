import React from "react";

import { useNavigate } from "react-router-dom";

import styles from "./PatientProfileCard.module.scss";
import PersonIcon from "@mui/icons-material/Person";
interface PatientCardProps {
  patient: {
    pName: string;
    photo: string;
    department: string;
    id: string;
    ward?: string;
    date: string;
    image: string;
    type: string;
    endDate?: string;
    dischargeType: number;
    doctorName: string;
  };
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      style={{ border: "none", "--top-bg-color": "#D4C3C2" } as any }
      onClick={() => {
        navigate(`${patient.id}`);
      }}
    >
      <div className={styles.card_img}>
        {patient.photo && (
          <img src={patient.photo} alt="" className={styles.profile} />
        )}
        {/* <img src={profile_pic} alt="" className={styles.profile} /> */}
        {!patient.photo && <PersonIcon className={styles.profile} />}
      </div>

      <>
        <h2>{patient.pName}</h2>
        <p>
          Department:{" "}
          {patient.department
            ? patient?.department?.slice(0, 1)?.toUpperCase() +
              patient?.department?.slice(1)?.toLowerCase()
            : ""}
        </p>
        {patient?.doctorName && (
          <div className={styles.highlight}>
            Doctor:{" "}
            {patient?.doctorName?.length > 12
              ? `${patient.doctorName.slice(0, 14)}...`
              : patient.doctorName}
          </div>
        )}
      </>

      <button>View Details</button>
    </div>
  );
};

export default PatientCard;
