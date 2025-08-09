import NoPatientsAddedBanner from "../../assets/dashboard/NoPatientsAddedBanner.png"
import styles from "./table.module.scss"
const NoLatestPatientDashboardData = ()=> (
    <div className={styles.no_data_container}>
        <img src = {NoPatientsAddedBanner} alt = "no latest patient data" style ={{width:"160px"}} />
        <p style ={{fontStyle:"italic", color:"#d8dadd",textAlign:"center",fontWeight:200}}>Looks like there are no patients here yet. Add one now!</p>
    </div>
)


export default NoLatestPatientDashboardData