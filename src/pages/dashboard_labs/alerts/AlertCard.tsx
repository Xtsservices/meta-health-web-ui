import { useSelector } from "react-redux";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { alertType } from "../../../types";
import styles from "./AlertCard.module.scss";
import { useNavigate } from "react-router";

interface AlertCardProps {
  alert: alertType;
}

const AlertCard = ({ alert }: AlertCardProps) => {
  const navigate = useNavigate();
  const dateObject = new Date(alert.addedOn);
  const date = dateObject.toISOString().split("T")[0];
  const time = dateObject.toISOString().split("T")[1].split(".")[0];
  const user = useSelector(selectCurrentUser);

  async function handlePatientView(id: number | null) {
    const response = await authFetch(
      `test/${user.hospitalID}/${alert.category}/isviewchange/${id}`,
      user.token
    );
    console.log("res", response)
    if (response.message == "success") {
     return navigate(`./list/${id}`, {
        state: { timeLineID: id},
      })
     
    }
  }

  console.log("alert", alert)
  
  return (
    <div className={styles.card}>
      <div className={styles.profile}>
        <div>
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            className={styles.profileImage}
          />
        </div>
        <div className={styles.name}>{alert.pName}</div>
      </div>
      <div className={styles.details}>
        <p>
          <strong>ALERT ID:</strong> {alert.id}
        </p>
        <p>
          <strong>Ward:</strong> {alert.ward_name}
        </p>
        <p>
          <strong>Doctor:</strong>{" "}
          {alert.doctor_firstName + alert.doctor_lastName}
        </p>
      </div>
      <div className={styles.datetime}>
        <p>
          <strong>DATE:</strong> {date}
        </p>
        <p>
          <strong>TIME:</strong> {time}
        </p>
      </div>
      <button
        className={styles.button}
        onClick={() =>
          handlePatientView(alert.timeLineID)
          // navigate(`./list/${alert.timeLineID}`, {
          //   state: { timeLineID: alert.timeLineID },
          // })
        }
      >
        View Details
      </button>
    </div>
  );
};

export default AlertCard;
