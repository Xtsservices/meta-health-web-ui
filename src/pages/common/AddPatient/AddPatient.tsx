import styles from "./AddPatient.module.scss";
import neonate_icon from "./../../../../src/assets/addPatient/neonate_icon.png";
import adult_icon from "./../../../../src/assets/addPatient/adult_icon.png";
import child_icon from "./../../../../src/assets/addPatient/child_icon.png";
import { useNavigate } from "react-router-dom";
import reciptionbottomBanner_image from "./../../../assets/addPatient/PaitientUnderCondition/bannerForAddingPatient.png"

function AddPatient({ status }: { status: string }) {
  const navigate = useNavigate();
  const handleClick = (endpoint: string): void => {
    navigate(`${endpoint}`);
  };
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Select a Category to Add Patients Details</h3>
      <div className={styles.container_options}>
        <div
          className={styles.card + " " + styles.card_neonate}
          onClick={() => {
            handleClick(`neonate/${status}`);
          }}
        >
          <img src={neonate_icon} alt="" />
          <h2>Neonate</h2>
        </div>
        <div
          className={styles.card + " " + styles.card_child}
          onClick={() => {
            handleClick(`child/${status}`);
          }}
        >
          <img src={child_icon} alt="" />
          <h2>Child</h2>
        </div>
        <div
          className={styles.card + " " + styles.card_adult}
          onClick={() => {
            handleClick(`adult/${status}`);
          }}
        >
          <img src={adult_icon} alt="" />
          <h2>Adult</h2>
        </div>
      </div>
      <div style = {{marginTop:"50px"}}>
      <p>"Each option will guide you to the right details entry form"</p> 
      <img src = {reciptionbottomBanner_image} className={styles.reception_banner_image} alt = "reception banner"/>
        </div>
    </div>
  );
}

export default AddPatient;
