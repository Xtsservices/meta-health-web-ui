import React, { useEffect, useState } from "react";
import styles from "./LabsPatientList.module.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { PatientCardData } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import PatientCard from "../../dashboard_labs/patientCard/PatientCard";
import { Tabs, Tab } from "@mui/material";
import No_Patient_Image from "../../../assets/No_Patient_Found.jpg"


const LabsPatientList = () => {
  const user = useSelector(selectCurrentUser);
  const [patientData, setPatientData] = useState<PatientCardData[]>([]);
  const [completedPatientData, setCompletedPatientData] = useState<PatientCardData[]>([]);
  const [page, setPage] = React.useState({
    limit: 8,
    page: 1,
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [patientType, setPatientType] = useState(0)
  useEffect(() => {
    const getPatientList = async () => {
      try {
        let patientList = [];
  
        if (patientType === 3) { // Walk-in
          const response = await authFetch(
            `test/getWalkinTaxinvoicePatientsData/${user.hospitalID}/${user.roleName}`,
            user.token
          );
  
          if (response.status === 200) {
            patientList = response.data;
          }
        } else {
          const response = await authFetch(
            `test/${user.roleName}/${user.hospitalID}/${user.id}/getAllPatient`,
            user.token
          );
  
          if (response.message === "success") {
            patientList = response.patientList;
  
            if (patientType === 1) { // IPD
              patientList = patientList.filter((each: any) => each.patientStartStatus !== 1);
            } else if (patientType === 2) { // OPD
              patientList = patientList.filter((each:any) => each.patientStartStatus === 1);
            }
          }
          // If patientType is 0, fetch Walk-in patients and merge all
        if (patientType === 0) {
          const walkinResponse = await authFetch(
            `test/getWalkinTaxinvoicePatientsData/${user.hospitalID}/${user.roleName}`,
            user.token
          );

          if (walkinResponse.status === 200) {
            patientList = [...patientList, ...walkinResponse.data]; // Merge all (IPD + OPD + Walk-in)
          }
        }
        }
  
        setPatientData(patientList);
      } catch (error) {
        console.error("Error fetching patient list:", error);
      }
    };
  
    getPatientList();
  }, [user.hospitalID, user.id, user.roleName, user.token, patientType]);


  useEffect(() => {
    const getReportsCompletedData = async () => {
      try {
        let patientList: any[] = [];
  
        // Fetch Walk-in Patients if needed
        if (patientType === 3 || patientType === 0) {
          const walkinResponse = await authFetch(
            `test/${user.roleName}/${user.hospitalID}/${user.id}/getAllWalkinReportsCompletedPatients`,
            user.token
          );
          if (walkinResponse.message === "success") {
            patientList = walkinResponse.patientList;
          }
        }
  
        // Fetch IPD & OPD Patients if needed
        if (patientType !== 3) {
          const response = await authFetch(
            `test/${user.roleName}/${user.hospitalID}/${user.id}/getAllReportsCompletedPatients`,
            user.token
          );
  
          if (response.message === "success") {
            let filteredList = response.patientList;
  
            if (patientType === 1) { // IPD
              filteredList = filteredList.filter((each: any) => each.patientStartStatus !== 1);
            } else if (patientType === 2) { // OPD
              filteredList = filteredList.filter((each: any) => each.patientStartStatus === 1);
            }
  
            // Merge with Walk-in Patients if patientType === 0
            patientList = patientType === 0 ? [...patientList, ...filteredList] : filteredList;
          }
        }
  
        setCompletedPatientData(patientList);
      } catch (error) {
        console.error("Error fetching completed reports:", error);
      }
    };
  
    getReportsCompletedData();
  }, [user.roleName, user.hospitalID, user.id, user.token, patientType]);
  
 

  // Calculate the indices for slicing the array
  const indexOfLastItem = page.page * page.limit;
  const indexOfFirstItem = indexOfLastItem - page.limit;

  // Slice the data array to get the items for the current page
  const currentItems =
  tabIndex === 0
    ? patientData.slice(indexOfFirstItem, indexOfLastItem)
    : completedPatientData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.patitentList__container}>
      <div style={{display:"flex",justifyContent:"space-between", borderBottom: "2px solid #cccccc"}}>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} sx={{ marginBottom: 0,"& .MuiTabs-indicator": { backgroundColor: "orange" },
              "& .MuiTab-root.Mui-selected": { fontWeight: "bold", color: "black" },"& .MuiTab-root": { textTransform: "none",fontSize:"16px" }, }}>
        <Tab label="Confirmed Patient Care Alerts" />
        <Tab label="Reports Completed" />
      </Tabs>
      <div className={styles.selectContainer} style={{marginRight:"20px"}}>
          <select
            name="patientType"
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setPatientType(Number(event.target.value))
            }
            className={styles.margin_left_auto}
          >
            <option value={0}>All</option>
            <option value={1}>IPD</option>
            <option value={2}>OPD</option>
            <option value={3}>Walk-In</option>
          </select>
        </div>
        </div>
      <div className={styles.patitentList__container__div}>Patients List</div>
      {currentItems.length === 0 ? (
        <div className={styles.no_patient_found_conatiner}>
          <img
              src={No_Patient_Image}
              alt="No Patients Found"
              width={150}
            />
            <h3 className={styles.noPatientsFound}>No Patients Found</h3>
        </div>
      ) : (
        <div className={styles.patientList}>
          {currentItems.map((patient) => (
            <PatientCard key={patient.patientID || patient.pID} patient={patient} tab={tabIndex === 0 ? "normal" : "completed"} />
          ))}
        </div>
      )}
      {tabIndex === 0 && patientData?.length >= 10 && (
        <div className={styles.page_navigation}>
          Results Per Page
          <select
            name="filter"
            id=""
            style={{ width: "20%" }}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setPage((prevValue) => {
                return { ...prevValue, limit: Number(event.target.value) };
              });
            }}
          >
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={patientData.length}>All</option>
          </select>
          <IconButton
            aria-label="delete"
            disabled={page.page === 1}
            onClick={() => {
              setPage((prevValue) => {
                return { ...prevValue, page: prevValue.page - 1 };
              });
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            disabled={Math.ceil(patientData.length / page.limit) === page.page}
            onClick={() => {
              setPage((prevValue) => {
                return { ...prevValue, page: prevValue.page + 1 };
              });
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default LabsPatientList;
