import React from 'react';
import styles from './labPatientCard.module.scss';
import PersonIcon from '@mui/icons-material/Person';
import cast_icon from '/src/assets/hospital_staff/cast_icon.png';
import notification_icon from '/src/assets/hospital_staff/notification_icon.png';
import warning_white_icon from '/src/assets/hospital_staff/warning_white_icon.png';
import { useNavigate } from 'react-router-dom';
import { PatientType } from '../../../../types';

interface Props {
  patient: PatientType;
  patientActive: boolean;
}

const dischargeTypes = {
  Success: 1,
  DOPR: 2,
  Abscond: 3,
  Left: 4,
  Death: 5,
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
  return 'Unknown';
}

const LabPatientCard = ({ patient, patientActive }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.card}
      style={{ border: 'none' }}
      onClick={() => {
        navigate(`${patient.id}`);
      }}
    >
      {!patientActive && (
        <div className={styles.card_warning} style={{ visibility: 'hidden' }}>
          <img src={warning_white_icon} alt="" />
          Temperature Raised
          <img src={notification_icon} alt="" className={styles.notification} />
        </div>
      )}

      <div
        className={styles.card_warning}
        style={{ background: 'transparent' }}
        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          event.stopPropagation();
        }}
      >
        <img
          src={notification_icon}
          alt=""
          className={styles.notification}
          style={{
            visibility: `${patient.notificationCount ? 'visible' : 'hidden'}`,
          }}
        />
      </div>
      <div className={styles.card_img}>
        {patient.imageURL && (
          <img src={patient.imageURL} alt="" className={styles.profile} />
        )}
        {!patient.imageURL && <PersonIcon className={styles.profile} />}

        <img
          src={cast_icon}
          alt=""
          className={styles.cast}
          style={{
            visibility: `${patient.deviceID ? 'visible' : 'hidden'}`,
          }}
        />
      </div>
      <h2>{patient.pName}</h2>
      {patientActive && (
        <>
          <p>
            Department:&nbsp;
            {patient.department
              ? patient?.department?.slice(0, 1)?.toUpperCase() +
                patient?.department?.slice(1)?.toLowerCase()
              : ''}
          </p>
          <p className={styles.lighterGray}>
            ID:&nbsp;{patient.pID ? patient?.pID : ''}
          </p>
          <p className={styles.lighterGray}>
            Ward:&nbsp;{patient.wardID ? patient?.wardID : ''}
          </p>
          {/* <div className={styles.highlight}>Ward: {patient.wardID}</div> */}
        </>
      )}

      {!patientActive && (
        <>
          <p>
            DischargeReason : {getDischargeType(patient.dischargeType || 0)}
          </p>
          <div className={styles.highlight}>
            Out:{' '}
            {new Date(patient.endTime).toLocaleDateString('en-GB', {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
            })}
          </div>
        </>
      )}
      <button>View Details</button>
    </div>
  );
};

export default LabPatientCard;
