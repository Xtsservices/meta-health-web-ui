import React from "react";
import styles from "./lab-patient-list.module.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { PatientType } from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setLoading } from "../../../store/error/error.action";
import { patientStatus } from "../../../utility/role";
import { authFetch } from "../../../axios/useAuthFetch";
import { setAllPatient } from "../../../store/patient/patient.action";
import LabPatientCard from "./labPatientCard/labPatientCard";

const patients: PatientType[] = [
  {
    id: 1,
    hospitalID: 101,
    deviceID: null,
    pID: "PID123456",
    pUHID: 1001,
    category: 2,
    ptype: 1,
    dob: "1985-05-20",
    gender: 1,
    weight: 75,
    height: 175,
    pName: "John Doe",
    phoneNumber: 1234567890,
    email: "john.doe@example.com",
    address: "123 Elm Street",
    city: "Springfield",
    state: "IL",
    pinCode: "62704",
    referredBy: "Dr. Smith",
    addedOn: "2023-01-15T08:30:00Z",
    lastModified: "2023-01-20T12:45:00Z",
    department: "Cardiology",
    // imageURL: 'https://example.com/images/johndoe.jpg',
    startTime: "2023-01-15T09:00:00Z",
    endTime: "2023-01-15T11:00:00Z",
    doctorName: "Dr. Sarah Lee",
    firstName: "John",
    lastName: "Doe",
    dischargeType: 1,
    followUpDate: "2023-02-15",
    followUpStatus: "Pending",
    advice: "Take medication regularly",
    diet: "Low sodium diet",
    notificationCount: 0,
    patientTimeLineID: 301,
    wardID: 401,
    wardName: "Cardio Ward",
    insurance: 1,
    insuranceNumber: "INS123456789",
    insuranceCompany: "HealthCare Inc.",
    patientStartStatus: 1,
    patientEndStatus: 2,
    followUpAddedOn: "2023-01-16T09:00:00Z",
    status: null,
  },
  {
    id: 2,
    hospitalID: 102,
    deviceID: 202,
    pID: "PID654321",
    pUHID: 1002,
    category: 1,
    ptype: 2,
    dob: "1990-07-10",
    gender: 2,
    weight: 65,
    height: 165,
    pName: "Jane Smith",
    phoneNumber: 9876543210,
    email: "jane.smith@example.com",
    address: "456 Oak Avenue",
    city: "Madison",
    state: "WI",
    pinCode: "53703",
    referredBy: "Dr. Johnson",
    addedOn: "2023-02-05T10:00:00Z",
    lastModified: "2023-02-10T15:30:00Z",
    department: "Neurology",
    // imageURL: 'https://example.com/images/janesmith.jpg',
    startTime: "2023-02-05T10:30:00Z",
    endTime: "2023-02-05T12:30:00Z",
    doctorName: "Dr. Emily Davis",
    firstName: "Jane",
    lastName: "Smith",
    dischargeType: 2,
    followUpDate: "2023-03-05",
    followUpStatus: "Completed",
    advice: "Regular exercise",
    diet: "High protein diet",
    notificationCount: 0,
    patientTimeLineID: 302,
    wardID: 402,
    wardName: "Neuro Ward",
    insurance: 0,
    insuranceNumber: "N/A",
    insuranceCompany: "N/A",
    patientStartStatus: 1,
    patientEndStatus: 1,
    followUpAddedOn: "2023-02-06T10:00:00Z",
    status: null,
  },
];

function LabPatientListTemplate() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1,
  });
  const [allPatients, setAllPatients] = React.useState<PatientType[]>([]);
  const [dataTable, setDataTable] = React.useState<PatientType[][]>([]);

  const getAllPatient = React.useCallback(async () => {
    dispatch(setLoading(true));
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/${patientStatus.inpatient}?role=${user.role}&userID=${user.id}`,
      user.token
    );
    if (response.message == "success") {
      setAllPatients(response.patients);
      dispatch(setAllPatient(response.patients));
    }
    dispatch(setLoading(false));
    setAllPatients(patients);
    dispatch(setAllPatient(patients));
  }, [dispatch, user.hospitalID, user.id, user.role, user.token]);

  React.useEffect(() => {
    if (user.token) {
      getAllPatient();
    }
  }, [getAllPatient, user]);

  React.useEffect(() => {
    setDataTable([]);
    const pages = Math.ceil(allPatients.length / page.limit);
    const newArray = Array(pages).fill([]);
    newArray.forEach((_, index) => {
      const patientData = allPatients
        .sort(compareDates)
        .slice(index * page.limit, (index + 1) * page.limit);
      setDataTable((prev) => {
        return [...prev, patientData];
      });
    });
  }, [page, allPatients]);

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <div className={styles.containerLeft}>
          <h3>Patient List</h3>
        </div>
      </div>
      <div className={styles.container_card}>
        {dataTable[page?.page - 1]?.map((patient) => {
          return <LabPatientCard patient={patient} patientActive={true} />;
        })}
      </div>
      {allPatients?.length >= 10 && (
        <div className={styles.page_navigation}>
          Results Per Page
          <select
            name="filter"
            id=""
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setPage((prevValue) => {
                return { ...prevValue, limit: Number(event.target.value) };
              });
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={allPatients.length}>All</option>
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
            disabled={Math.ceil(allPatients.length / page.limit) == page.page}
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

export default LabPatientListTemplate;

function compareDates(a: PatientType, b: PatientType) {
  return new Date(b.startTime).valueOf() - new Date(a.startTime).valueOf();
}
