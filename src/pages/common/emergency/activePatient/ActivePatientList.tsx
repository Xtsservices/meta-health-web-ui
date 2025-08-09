import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { setAllPatient } from "../../../../store/patient/patient.action";
import { authFetch } from "../../../../axios/useAuthFetch";
import { PatientType } from "../../../../types";
import { setLoading } from "../../../../store/error/error.action";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import PatientProfileCard from "../../../../component/PatientProfile/PatientProfileCard";
import styles from "./ActivePatientList.module.scss";
import NotificationDialog from "../notificationDialog/NotificationDialog";
import No_Patient_Image from "../../../../assets/No_Patient_Found.jpg"
interface ActivePatientListProps {
  zone: number;
  patientStatus: any;
}

const ActivePatientList: React.FC<ActivePatientListProps> = ({
  zone,
  patientStatus,
}) => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.error.loading);
  const [filter, setFilter] = useState(0);
  const [allPatient, setAllPatients] = useState<PatientType[]>([]);
  const [dataTable, setDataTable] = useState<PatientType[][]>([]);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [timelineID, setTimelineID] = useState<number | undefined>(0);
  const [name, setName] = useState("");
  const [page, setPage] = useState({
    limit: 10,
    page: 1,
  });
  const getAllPatientApi = useRef(true);

  const getAllPatient = useCallback(async () => {
    dispatch(setLoading(true));
    console.log("Patient status", patientStatus);
    let response;
    if (zone === 3) {
      response = await authFetch(
        `patient/${user.hospitalID}/patients/${patientStatus}?zone=${zone}`,
        user.token
      );
    } else {
      response = await authFetch(
        `patient/${user.hospitalID}/patients/${patientStatus}?zone=${zone}&userID=${user.id}`,
        user.token
      );
    }
    if (response.message == "success") {
      setAllPatients(response.patients);
      dispatch(setAllPatient(response.patients));
    }
    dispatch(setLoading(false));
  }, [dispatch, user.hospitalID, user.token]);

  console.log("allPatient", allPatient.length);

  useEffect(() => {
    if (user.token && getAllPatientApi.current) {
      getAllPatientApi.current = false;
      getAllPatient();
    }
  }, [getAllPatient, user]);

  useEffect(() => {
    setDataTable([]);
    const pages = Math.ceil(allPatient.length / page.limit);
    const newArray = Array(pages).fill([]);
    newArray.forEach((_, index) => {
      const patData = allPatient
        .filter((el) => {
          if (filter == 0) return true;
          if (filter == 1) return el.deviceID ? true : false;
          if (filter == 2) return el.deviceID ? false : true;
        })
        .sort(compareDates)
        .slice(index * page.limit, (index + 1) * page.limit);
      setDataTable((prev) => {
        return [...prev, patData];
      });
    });
  }, [page, allPatient, filter]);

  const handleNofiedUserDetails = (name: string, id: number | undefined) => {
    setTimelineID(id); //this is patientTimelineId
    setName(name);
    setOpenNotification(true);
  };
  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <div className={styles.containerLeft}>
          <h3>Patients List</h3>
        </div>

        <div className={styles.containerRight}>
          <select
            name="filter"
            id=""
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setFilter(Number(event.target.value))
            }
            className={`${styles.margin_left_auto} custom-select`}
          >
            <option value={0}>All Patients</option>
            <option value={1}>Patients with Device</option>
            <option value={2}>Patients without Device</option>
          </select>
        </div>
      </div>
      <div className={styles.container_card}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : dataTable[page?.page - 1]?.length > 0 ? (
          dataTable[page?.page - 1]?.map((patient) => (
            <PatientProfileCard
              key={patient.id}
              patient={patient}
              patientActive={true}
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

      {allPatient?.filter((el) => {
        if (filter === 0) return true;
        if (filter === 1) return el.deviceID ? true : false;
        if (filter === 2) return el.deviceID ? false : true;
      }).length >= 10 && (
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
      {openNotification ? (
        <NotificationDialog
          setOpen={setOpenNotification}
          open={openNotification}
          timelineID={timelineID}
          name={name}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ActivePatientList;

function compareDates(a: PatientType, b: PatientType) {
  return new Date(b.startTime).valueOf() - new Date(a.startTime).valueOf();
}
