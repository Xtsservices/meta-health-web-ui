import React, { useRef } from "react";
import styles from "./patientList.module.scss";
// import add_icon from './../../../../src/assets/addstaff/add_icon.png';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setAllPatient } from "../../../store/patient/patient.action";
import { authFetch } from "../../../axios/useAuthFetch";
import { PatientType, wardType } from "../../../types";
import { patientStatus } from "../../../utility/role";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import NotificationDialog from "./NotificationDialog";
import { setLoading } from "../../../store/error/error.action";
import PatientProfileCard from "../../../component/PatientProfile/PatientProfileCard";
import No_Patient_Image from "../../../assets/No_Patient_Found.jpg";

function PatientList() {
  const user = useSelector(selectCurrentUser);
  const loading = useSelector((state: any) => state.error.loading);
  const getAllPatientApi = useRef(true);
  const getWardDataApi = useRef(true);
  const dispatch = useDispatch();
  const [filter, setFilter] = React.useState(0);
  const [allPatient, setAllPatients] = React.useState<PatientType[]>([]);
  const [dataTable, setDataTable] = React.useState<PatientType[][]>([]);
  const [, setWardList] = React.useState<wardType[]>([]);
  const [wardID] = React.useState<number>(0);
  const [openNotification, setOpenNotification] =
    React.useState<boolean>(false);
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1
  });

  const [timelineID, setTimelineID] = React.useState<number | undefined>(0);
  const [name, setName] = React.useState("");

  const handleNofiedUserDetails = (name: string, id: number | undefined) => {
    setTimelineID(id); //this is patientTimelineId
    setName(name);
    setOpenNotification(true);
  };

  const getAllPatient = React.useCallback(async () => {
    dispatch(setLoading(true));
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/triage/${patientStatus.emergency}`,
      user.token
    );
    if (response.message == "success") {
      setAllPatients(response.patients);
      dispatch(setAllPatient(response.patients));
    }
    dispatch(setLoading(false));
  }, [dispatch, user.hospitalID, user.token]);

  const getWardData = React.useCallback(async () => {
    const wardResonse = await authFetch(`ward/${user.hospitalID}`, user.token);
    if (wardResonse.message == "success") {
      setWardList(wardResonse.wards);
    }
  }, [user.hospitalID, user.token]);

  React.useEffect(() => {
    // getAllDepartment();
    if (user.token && getAllPatientApi.current) {
      getAllPatientApi.current = false;
      getAllPatient();
    }
    if (user.token && getWardDataApi.current) {
      getWardDataApi.current = false;
      getWardData();
    }
  }, [getAllPatient, getWardData, user]);

  React.useEffect(() => {
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
        .filter((el) => {
          // console.log("el", el, wardID);
          if (wardID == 0) return true;
          return wardID === el.wardID;
        })
        .sort(compareDates)
        .slice(index * page.limit, (index + 1) * page.limit);
      setDataTable((prev) => {
        return [...prev, patData];
      });
    });
  }, [page, allPatient, filter, wardID]);

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <div className={styles.containerLeft}>
          <h3>Patients List</h3>
        </div>

        <div className={styles.containerRight}>
          {/* <select
            name="ward"
            id=""
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setWardID(Number(event.target.value))
            }
            className={styles.margin_left_auto}
          >
            <option value={0}>All Ward</option>
            {wardList.map((ward: wardType) => (
              <option value={ward.id} key={ward.id}>
                {capitalizeFirstLetter(ward.name)}
              </option>
            ))}
          </select> */}
          <select
            name="filter"
            id=""
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setFilter(Number(event.target.value))
            }
            className="custom-select"
          >
            <option value={0}>All Patients</option>
            <option value={1}>Patients with Device</option>
            <option value={2}>Patients without Device</option>
          </select>
          {/* <button
            className={styles.header_button}
            onClick={() => navigate('/hospital-dashboard/inpatient/addpatient')}
          >
            <img src={add_icon} alt="" className="" />
            Add Patient
          </button> */}
        </div>
      </div>
      <div className={styles.container_card}>
        {loading ? (
          <div>Loading...</div>
        ) : dataTable[page?.page - 1]?.length > 0 ? (
          dataTable[page?.page - 1].map((patient) => (
            <PatientProfileCard
              key={patient.id}
              patient={patient}
              patientActive={true}
              handleNofiedUserDetails={handleNofiedUserDetails}
            />
          ))
        ) : (
          <div className={styles.no_patient_found_conatiner}>
            <img src={No_Patient_Image} alt="No Patients Found" width={150} />
            <h3 className={styles.noPatientsFound}>No Patients Found</h3>
          </div>
        )}
      </div>
      {allPatient?.length >= 10 && (
        <div className={styles.page_navigation}>
          Results Per Page
          <select
            name="filter"
            id=""
            style={{ width: "20%" }}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setPage((prevValue) => {
                return { ...prevValue, limit: Number(event.target.value) };
                // });
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
}

export default PatientList;

function compareDates(a: PatientType, b: PatientType) {
  return new Date(b.startTime).valueOf() - new Date(a.startTime).valueOf();
}
