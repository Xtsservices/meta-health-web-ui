import { useNavigate } from 'react-router-dom';
import styles from './notification-card.module.scss';
import { Person } from '@mui/icons-material';

type NotificationCardProps = {
  patientId?: string | number;
  ward?: string | number;
  doctor?: string;
  date?: string;
  time?: string;
  patientName?: string;
  profileImage?: string;
  buttonUrl?: string;
};
// eslint-disable-next-line no-empty-pattern
const NotificationCard = ({
  patientId = 12,
  ward = 23,
  doctor = 'Kartik',
  date = '23/03/23',
  time = '12:33 PM',
  patientName = 'Dakota Johnsen',
  buttonUrl = './list/',
  profileImage = '',
}: NotificationCardProps) => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.container_row}>
        <div className={styles.container_row_item}>
          <div className={styles.container_column}>
            {profileImage ? (
              <img
                src={profileImage ? profileImage : '/profile.png'}
                alt={patientName}
                width={60}
                className={styles.container_profileImage}
              />
            ) : (
              <Person
                className={styles.container_profileImage}
                sx={{
                  width: 60,
                  height: 60,
                }}
              />
            )}
            <span className={styles.uppercase}>{patientName}</span>
          </div>
        </div>
        <div className={styles.container_row_item}>
          <p>
            PATIENT ID&nbsp;:&nbsp;
            <span>{patientId}</span>
          </p>
          <p>
            WARD&nbsp;:&nbsp;
            <span>{ward}</span>
          </p>
          <p>
            DOCTOR&nbsp;:&nbsp;
            <span>{doctor}</span>
          </p>
        </div>
        <div className={styles.container_row_item}>
          <p>
            DATE&nbsp;:&nbsp;
            <span>{date}</span>
          </p>
          <p>
            TIME&nbsp;:&nbsp;
            <span>{time}</span>
          </p>
        </div>
        <div className={styles.container_button}>
          <button
            className={styles.blueButton}
            onClick={() => navigate(buttonUrl + patientId)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
