import { useLocation, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import {PatientDetails } from "../../../types";
import IconButton from "@mui/material/IconButton";
import styles from "../../hospital_emergency_red/PatientProfile/PatientProfile.module.scss"; 
import DownloadIcon from "../../../assets/Vector.png"
import { useState } from "react";
import PrintDialog from "../../hospital_staff/PatientProfile/PrintDialog";

interface Props {
  patientDetails: PatientDetails;
  completedDetails?: PatientDetails[];
  tab?: string;
}

// Dummy function to calculate age from date of birth
const getAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  
  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  const days = today.getDate() - birthDate.getDate();

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""}`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    return `${Math.abs(days)} day${days > 1 ? "s" : ""}`;
  }
};



const PatientProfileCard = ({ patientDetails,tab,completedDetails }: Props) => {
  const navigate = useNavigate();
console.log("patientDetails===",patientDetails)
const [openDialog, setOpenDialog] = useState(false);

// Extract all reports from completedDetails
const allReports = Array.isArray(completedDetails)
  ? completedDetails.flatMap((patient) => patient.attachments || [])
  : [];



const handleOpenDialog = () => {
  setOpenDialog(true);
};


//For navigation based on path
  const location = useLocation();
  const path = location.pathname;
  const department = path.includes("radiology")
    ? "radiology"
    : path.includes("pathology")
    ? "pathology"
    : "";
  console.log(patientDetails,"patientDetails")
  
  const convertToIST = (utcDate: string | undefined, showTime: boolean = false) => {
    if (!utcDate) return ""; // Return empty if date is not available
  
    let date = new Date(utcDate);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
  
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...(showTime && {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }), // Show time only if required
    });
  };
  ;


  return (
    <div className={styles.profile_container}>
      <div className={styles.profile_img} >
        {patientDetails?.imageURL ? (
          <img src={patientDetails?.imageURL} alt="" className={styles.profile} />
        ) : (
          <PersonIcon className={styles.profile} />
        )}
      </div>
      <div className={styles.profile_info}>
        <h3>
          {patientDetails?.pName?.slice(0, 1).toUpperCase() +
            patientDetails?.pName?.slice(1).toUpperCase()}{" "}
          <span>|</span>
          <span style={{ fontSize: "14px" }}>ALERT ID: {patientDetails?.id}</span>
        </h3>
        <div className={styles.profile_info_main}>
          <div className={styles.profile_info_left}>
            {patientDetails?.gender &&   <p>Gender: {patientDetails?.gender === 1 ? "Male" : "Female"}</p>}
           {patientDetails?.dob &&  <p>Age: {patientDetails?.dob ? getAge(patientDetails?.dob) : ""}</p>}
           {!patientDetails?.patientID && (
              <p>Patient ID : {patientDetails?.pID}</p>
            )}
            <p>From: {" "} {patientDetails?.city} {patientDetails?.state}{" "}
            
            </p>
          </div>
          <div className={styles.profile_info_right}>
            
            <p style={{ marginTop: "0" }}>
              {patientDetails?.patientID ? "Date of Admission:" : "Date : "}
             
              {patientDetails?.patientID ?
                convertToIST(patientDetails.addedOn, false) // No time for admission date
                : convertToIST(patientDetails?.addedOn, true)}
            </p>
            {!patientDetails?.patientID && (
              <p>Phone Number : {patientDetails?.phoneNumber}</p>
            )}
            {patientDetails?.patientID && (
              <p>
              Treating Doctor:{" "}
              {
                (patientDetails?.doctor_firstName &&
                  patientDetails?.doctor_firstName?.slice(0, 1).toUpperCase() +
                  patientDetails?.doctor_firstName?.slice(1).toLowerCase() +
                    " " +
                    patientDetails?.doctor_lastName)}
            </p>

            )}
            
            {patientDetails?.ward_name &&  <p>
              Ward:{" "}
              {patientDetails?.ward_name
                ? patientDetails.ward_name
                : ""}
            </p>}
           
          </div>
        </div>
      </div>
      <div className={styles.profile_options}>
        {!patientDetails?.patientID && (<div className={styles.profile_options_inpatient}>Walk-In </div>)}
        {/* <div className={styles.profile_options_inpatient}>Emergency</div> */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"20px"}}>
          {/* <button
            className={styles.discharge_button}
            onClick={() => setOpenDischargeDialog((el) => !el)}
          >
            Discharge
          </button> */}
          {patientDetails?.patientID && (
            <IconButton aria-label="edit"    onClick={() =>  {
              navigate(`/hospital-dashboard/${department}/list/${patientDetails.patientID}/edit`);
            }}>
            <EditIcon />
          </IconButton>

          )}
          
          {/* <IconButton aria-label="delete" onClick={loadPrintData}>
            <PrintIcon onClick={() => setPrintDialogBox(true)} />
          </IconButton> */}
          {tab === "completed" && (
          <div
              style={{
                backgroundColor: "#1977f3",
                borderRadius: "35px",
                color: "white",
                display: "flex",
                alignItems: "center"
              }}
              onClick={handleOpenDialog}
            >
              <IconButton
                // disabled={printSelectOptions.length === 0}
                style={{ color: "#1976d2", paddingLeft: "10px", margin: 0 }}
              >
                <img src={DownloadIcon} alt="" />
              </IconButton>            
              <PrintDialog 
                open={openDialog} 
                setOpen={setOpenDialog} 
                id="123" 
                type="report" 
                reportsData={allReports}
                updateTheSelectedPrintOptions={(selected) => console.log(selected)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfileCard;