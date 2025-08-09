import styles from "../../common/AddPatient/AddPatient.module.scss";
import { Link } from "react-router-dom";
import Emergency from "../../../assets/addPatient/PaitientUnderCondition/Emergency.png"
import Inpatient from "../../../assets/addPatient/PaitientUnderCondition/Inpatient.png"
import opdImage from "../../../assets/addPatient/PaitientUnderCondition/opdImage.png"
import reciptionbottomBanner_image from "../../../assets/addPatient/PaitientUnderCondition/reciptionbottomBanner_image.png"

function AddPatientInReception() {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>
        Choose a patient type to proceed with details entry
      </h3>
      <div className={styles.container_options}>
     

        
          <Link to="/hospital-dashboard/reception/addPatient/emergency"  className={styles.card} style ={{background:"#C6C6C8"}}>
          <div className={styles.reception_style_add_patient}>
            <img
              src={Emergency}
              alt="Emergency Plus"
              className={styles.logo__img}
            />
            <h2 style ={{fontWeight:"bold", fontSize:"35px", color:"#000000",textAlign:"center"}}>Emergency</h2>
             </div>
          </Link>
       

       
          <Link to="/hospital-dashboard/reception/addPatient/ipd" className={styles.card} style ={{background:"#C0E3FF"}}>
          <div className={styles.reception_style_add_patient}>
            <img src={Inpatient} alt="Inpatient" className={styles.logo__img} />
            <h2 style ={{fontWeight:"bold", fontSize:"35px", color:"#000000",textAlign:"center"}}>In Patient</h2>
            </div>
          </Link>
       

       
          <Link to="/hospital-dashboard/reception/addPatient/opd" className={styles.card} style ={{background:"#FCB893"}}>
          <div className={styles.reception_style_add_patient}>
            <img src={opdImage} alt="OPD" className={styles.logo__img} />
            <h2 style ={{fontWeight:"bold", fontSize:"35px", color:"#000000",textAlign:"center"}}>OPD</h2>
            </div>
          </Link>
       
      </div>

      <div style = {{marginTop:"50px"}}>
      <p>"Each option will guide you to the right details entry form"</p> 
      <img src = {reciptionbottomBanner_image} className={styles.reception_banner_image} alt = "reception banner"/>
        </div>
      
    </div>
  
  );
}

export default AddPatientInReception;
