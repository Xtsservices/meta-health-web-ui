import styles from "./homeWidzet.module.scss";
import ipdIcon from "../../assets/homeIcons/ipdIcon.png";
import opdIcon from "../../assets/homeIcons/opdIcon.png";
import triageIcon from "../../assets/homeIcons/triageIcon.png";
import emergencyRedIcon from "../../assets/homeIcons/emergencyRedI on.png";
import emergencyYellowIcon from "../../assets/homeIcons/emergencyYellowIcon.png";
import emergencyGreenIcon from "../../assets/homeIcons/emergencyGreenIcon.png";
import otIcon from "../../assets/homeIcons/otIcon.png";
import pathologyIcon from "../../assets/homeIcons/pathologyIcon.png";
import pharmacyIcon from "../../assets/homeIcons/pharmacyIcon.png";
import receptionIcon from "../../assets/homeIcons/receptionimg-preview.png";
import radiologyIcon from "../../assets/homeIcons/radiologyIcon.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../store/user/user.selector";
import { Role_NAME, SCOPE_LIST } from "../../utility/role";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/user/user.action";

import CryptoJS from "crypto-js";
const secretKey: string | undefined = import.meta.env.SECRET_KEY;
const key = secretKey || "a1f0d31b6e4c2a8f79eacb10d1453e3f";

// import { useEffect } from 'react';
type widzetProp = {
  heading: string;
  link?: string;
  paragraph: string;
  icon: string;
  color: string;
};
function Widzet({ heading, link, paragraph, icon, color }: widzetProp) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const clickNavigate = (heading: string) => {
    dispatch(setCurrentUser({ ...user, isLoggedIn: true, roleName: heading }));

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({ ...user, isLoggedIn: true, roleName: heading }),
      key
    ).toString();
    localStorage.setItem("user", encryptedData);

    if (user.role == Role_NAME.admin)
      navigate(`${heading.toLowerCase()}/admin`);
    if (
      user.role == Role_NAME.nurse ||
      user.role == Role_NAME.headNurse ||
      user.role == Role_NAME.doctor ||
      user.role == Role_NAME.hod ||
      user.role == Role_NAME.staff
    ) {
      navigate(`${heading.toLowerCase()}`);
    }
  };

  return (
    <div
      className={`${styles.widzet_box + " " + styles[color]}`}
      onClick={() => {
        clickNavigate(link ? link : heading);
      }}
    >
      <img style={{ marginBottom: "30px" }} src={icon} alt="" className="" />
      <div
        style={{
          marginBottom: "30px",
          textAlign: "center",
        }}
        className={styles.heading}
      >
        {heading}
      </div>
      <div className={styles.paragraph}>{paragraph}</div>
      <div className={styles.viewDashboard}>View Dashboard</div>
    </div>
  );
}

function HomeWidzet() {
  let hasInpatient,
    hasOutpatient,
    hasTriage,
    hasEmergencyRedZone,
    hasEmergencyYellowZone,
    hasEmergencyGreenZone,
    hasSurgeon,
    hasAnesthesia,
    hasPathology,
    hasRadiology,
    hasPharmacy,
    hasReception = false;

  // const SCOPE_LIST= {
  //     inpatient: 5001,
  //     outpatient: 5002,
  //     emergency_green_zone: 5003,
  //     emergency_yellow_zone: 5004,
  //     emergency_red_zone: 5005,
  //     triage: 5006,
  //     surgeon: 5007,
  //     anesthetist: 5008,
  //   };

  // Retrieve and decrypt data from localStorage
  const storedEncryptedData = localStorage.getItem("user");

  if (storedEncryptedData) {
    const bytes = CryptoJS.AES.decrypt(storedEncryptedData, key);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const userScopes = decryptedData?.scope?.split("#");

    if (userScopes) {
      const scopes = userScopes.map((n: string) => Number(n));
      if (scopes.includes(SCOPE_LIST.emergency_red_zone))
        hasEmergencyRedZone = true;
      if (scopes.includes(SCOPE_LIST.emergency_yellow_zone))
        hasEmergencyYellowZone = true;
      if (scopes.includes(SCOPE_LIST.emergency_green_zone))
        hasEmergencyGreenZone = true;
      if (scopes.includes(SCOPE_LIST.inpatient)) hasInpatient = true;
      if (scopes.includes(SCOPE_LIST.outpatient)) hasOutpatient = true;
      if (scopes.includes(SCOPE_LIST.triage)) hasTriage = true;
      if (scopes.includes(SCOPE_LIST.surgeon)) hasSurgeon = true;
      if (scopes.includes(SCOPE_LIST.anesthetist)) hasAnesthesia = true;
      if (scopes.includes(SCOPE_LIST.pathology)) hasPathology = true;
      if (scopes.includes(SCOPE_LIST.radiology)) hasRadiology = true;
      if (scopes.includes(SCOPE_LIST.pharmacy)) hasPharmacy = true;
      if (scopes.includes(SCOPE_LIST.reception)) hasReception = true;
    }
  }

  return (
    <div className={styles.widzet}>
      {hasOutpatient && (
        <Widzet
          heading={"OPD"}
          link={"opd"}
          paragraph={
            "Access patient records, track treatment progress and patient data"
          }
          icon={opdIcon}
          color={"opd"}
        />
      )}
      {hasInpatient && (
        <Widzet
          heading={"Inpatient"}
          link={"inpatient"}
          paragraph={
            "Easily manage bed allocation, patient care plans, and discharge processes"
          }
          icon={ipdIcon}
          color={"ipd"}
        />
      )}
      {hasTriage && (
        <Widzet
          heading={"Triage"}
          link={"triage"}
          paragraph={
            "Quickly assess and prioritize patient needs for efficient care delivery"
          }
          icon={triageIcon}
          color={"triage"}
        />
      )}
      {hasEmergencyRedZone && (
        <Widzet
          heading={"Emergency Red"}
          link="emergency-red"
          paragraph={
            "Immediate notifications for high-priority cases and resource allocation"
          }
          icon={emergencyRedIcon}
          color={"emergencyRed"}
        />
      )}
      {hasEmergencyYellowZone && (
        <Widzet
          heading={"Emergency Yellow"}
          link="emergency-yellow"
          paragraph={
            "Critical alerts and resource status for prioritized emergency care"
          }
          icon={emergencyYellowIcon}
          color={"emergencyYellow"}
        />
      )}
      {hasEmergencyGreenZone && (
        <Widzet
          heading={"Emergency Green"}
          link="emergency-green"
          paragraph={
            "Quick access to emergency department performance and patient status updates"
          }
          icon={emergencyGreenIcon}
          color={"emergencyGreen"}
        />
      )}
      {(hasSurgeon || hasAnesthesia) && (
        <Widzet
          heading={"OT"}
          link={"ot"}
          paragraph={
            "Real-time monitoring of surgical schedules and theatre utilization"
          }
          icon={otIcon}
          color={"ot"}
        />
      )}
      {hasPathology && (
        <Widzet
          heading={"Pathology"}
          link={"pathology"}
          paragraph={
            "Real-time insights into pathology metrics and case trends"
          }
          icon={pathologyIcon}
          color={"pathology"}
        />
      )}
      {hasRadiology && (
        <Widzet
          heading={"Radiology"}
          link={"radiology"}
          paragraph={
            "Comprehensive overview of radiology findings and imaging workflows"
          }
          icon={radiologyIcon}
          color={"radiology"}
        />
      )}

      {hasPharmacy && (
        <Widzet
          heading={"Pharmacy"}
          link={"pharmacy"}
          paragraph={
            "Streamlined management of medication inventory and patient prescriptions"
          }
          icon={pharmacyIcon}
          color={"pharmacy"}
        />
      )}

      {hasReception && (
        <Widzet
          heading={"Reception"}
          link={"reception"}
          paragraph={
            "Treamlined management of patient check-ins and appointment scheduling"
          }
          icon={receptionIcon}
          color={"reception"}
        />
      )}
    </div>
  );
}

export default HomeWidzet;
