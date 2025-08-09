import React, { useRef } from "react";
import styles from "./DischargePatient.module.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { setAllPatient } from "../../../../store/patient/patient.action";
import { authFetch } from "../../../../axios/useAuthFetch";
import { PatientType } from "../../../../types";
import { patientStatus } from "../../../../utility/role";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { setLoading } from "../../../../store/error/error.action";
import PatientProfileCard from "../../../../component/PatientProfile/PatientProfileCard";
import No_Patient_Image from "../../../../assets/No_Patient_Found.jpg"

function DischargePatient() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [allPatient, setAllPatients] = React.useState<PatientType[]>([]);
  const [dataTable, setDataTable] = React.useState<PatientType[][]>([]);
  const [, setOpenNotification] = React.useState<boolean>(false);
  const [, setTimelineID] = React.useState<number | undefined>(0);
  const [, setName] = React.useState("");
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1
  });
  const getAllPatientApi = useRef(true);
  async function getAllPatient() {
    dispatch(setLoading(true));
    ////To get list of discharged patients you need to provide the startStatus of the patientStatus otherwise by default it takes....next line
    ////...the startstatus as inpatient
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/${patientStatus.discharged}?patientStartStatus=${patientStatus.emergency}&userID=${user.id}&role=${user.role}`,
      user.token
    );
    if (response.message == "success") {
      setAllPatients(response.patients);
      dispatch(setAllPatient(response.patients));
    }
    dispatch(setLoading(false));
  }
  React.useEffect(() => {
    setDataTable([]);
    const pages = Math.ceil(allPatient.length / page.limit);
    const newArray = Array(pages).fill([]);
    newArray.forEach((index) => {
      setDataTable((prev) => {
        return [
          ...prev,
          allPatient
            .sort(compareDates)
            .slice(index * page.limit, (index + 1) * page.limit)
        ];
      });
    });
  }, [page, allPatient]);
  React.useEffect(() => {
    if (getAllPatientApi.current) {
      getAllPatientApi.current = false;
      getAllPatient();
    }
  }, [user]);

  const handleNofiedUserDetails = (name: string, id: number | undefined) => {
    setTimelineID(id); //this is patientTimelineId
    setName(name);
    setOpenNotification(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_header}>
        <h3>Discharged Patients List</h3>
      </div>
      <div className={styles.container_card}>
  {dataTable[page?.page - 1]?.length > 0 ? (
    dataTable[page?.page - 1]?.map((patient) => (
      <PatientProfileCard
        key={patient.id} // Add a unique key if available
        patient={patient}
        patientActive={false}
        handleNofiedUserDetails={handleNofiedUserDetails}
      />
    ))
  ) : (
    <div className={styles.no_patient_found_container }>
            <img
              src={No_Patient_Image}
              alt="No Patients Found"
              width={150}
            />
            <h3 className={styles.noPatientsFound}>No Patients Found</h3>
        </div>
  )}
</div>

{allPatient.length >= 10 && (
  <div className={styles.page_navigation}>
    Results Per Page
    <select
      name="filter"
      id=""
      style={{ width: '20%' }}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
        setPage((prevValue) => {
          return {
            ...prevValue,
            limit: Number(event.target.value)
          };
        });
      }}
    >
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={allPatient.length}>All</option>
    </select>
    <IconButton
      aria-label="delete"
      disabled={page.page == 1}
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
      disabled={Math.ceil(allPatient.length / page.limit) == page.page}
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
}

export default DischargePatient;
function compareDates(a: PatientType, b: PatientType) {
  return new Date(b.endTime).valueOf() - new Date(a.endTime).valueOf();
}
