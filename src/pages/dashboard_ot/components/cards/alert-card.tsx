import { useNavigate } from 'react-router-dom';
import styles from './alert-card.module.scss';
import alertPng from  "../../../../../src/assets/ot/alert.png"

export type OTAlertCardProps = {
  addedOn: string;
  status: string;
  patientID: number;
  patientType: string;
  surgeryType: string;
  pName: string;
};
const AlertCard = ({ data }: { data: OTAlertCardProps }) => {
  const { addedOn, pName, patientID, patientType, surgeryType } = data;

  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`./${patientType}/${patientID}`);
  };

  const dateObject = new Date(addedOn);

  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();

  const date = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;

  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();

  const time = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className={styles.flex}>
      <div className={styles.column}>
        <div className={styles.columnImageContainer}>
          <img
            src={alertPng}
            alt="alert"
            height={20}
            style={{ height: '4rem', aspectRatio: 1 }}
          />
        </div>
      </div>
      <div className={styles.column}>
        <p>
          Date & Time:&nbsp;
          <span>
            {date}&nbsp;|&nbsp;{time}&nbsp;
          </span>
        </p>
        <p>
          Type of Surgery:&nbsp;<span>{surgeryType}</span>
        </p>
        <p>
          Patient:&nbsp;<span>{pName}</span>
        </p>
      </div>
      <div className={styles.column_btn_container}>
        <button onClick={handleViewDetails}>View Details</button>
      </div>
    </div>
  );
};

const AlertCardContainer = ({ data }: { data: OTAlertCardProps[] }) => {
  return (
    <div className={styles.container}>
      {data.length === 0 ? (
        <span style={{ color: 'gray' }}>No Alerts</span>
      ) : (
        data.map((d) => <AlertCard data={d} />)
      )}
    </div>
  );
};

export { AlertCard, AlertCardContainer };
