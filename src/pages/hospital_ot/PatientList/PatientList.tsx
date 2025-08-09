import React, { useEffect } from "react";
import styles from "./PatientList.module.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { PatientType, wardType } from "../../../types";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import NotificationDialog from "./NotificationDialog";
import { setLoading } from "../../../store/error/error.action";
import PatientProfileCard from "../../../component/PatientProfile/PatientProfileCard";
import { capitalizeFirstLetter } from "../../../utility/global";
import useOTConfig from "../../../store/formStore/ot/useOTConfig";
import No_Patient_Image from "../../../assets/No_Patient_Found.jpg"

function PatientList() {
  // const currenturlpath = window.location.pathname;
  // const segments = currenturlpath.split("/");
  // const lastSegment = segments[segments.length - 1];

  const user = useSelector(selectCurrentUser);
  const { screenType, userType } = useOTConfig();
  const dispatch = useDispatch();
  const [filter] = React.useState(0);
  const [allPatient, setAllPatients] = React.useState<PatientType[]>([]);
  const [dataTable, setDataTable] = React.useState<PatientType[][]>([]);
  const [, setWardList] = React.useState<wardType[]>([]);
  const [wardID] = React.useState<number>(0);

  const [openNotification, setOpenNotification] =
    React.useState<boolean>(false);
  const [timelineID, setTimelineID] = React.useState<number | undefined>(0);
  const [name, setName] = React.useState("");
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    if (userType) {
      setAllPatients([]);
      const getAllPatient = async () => {
        dispatch(setLoading(true));
        try {
          const response = await authFetch(
            `ot/${user.hospitalID}/${
              user.id
            }/getPatient/${userType.toLowerCase()}/${screenType.toLowerCase()}`,
            user.token
          );
          if (response.status == 200) {
            setAllPatients(response.patients);
          } else {
            setAllPatients([]);
          }
        } catch (error) {
          setAllPatients([]);
        }

        dispatch(setLoading(false));
      };
      getAllPatient();
    }
  }, [dispatch, screenType, user.hospitalID, user.id, user.token, userType]);

  const getWardData = React.useCallback(async () => {
    const wardResponse = await authFetch(`ward/${user.hospitalID}`, user.token);
    if (wardResponse.message == "success") {
      setWardList(wardResponse.wards);
    }
  }, [user.hospitalID, user.token]);

  React.useEffect(() => {
    if (user.token) {
      getWardData();
    }
  }, [getWardData, user]);

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
  // const navigate = useNavigate();
  const handleNofiedUserDetails = (name: string, id: number | undefined) => {
    setTimelineID(id); //this is patientTimelineId
    setName(name);
    setOpenNotification(true);
  };
  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <div className={styles.containerLeft}>
          <h3>{capitalizeFirstLetter(screenType)} List</h3>
        </div>

        {/* <div className={styles.containerRight}>
          <select
            name="ward"
            id=""
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setWardID(Number(event.target.value))
            }
            className={styles.margin_left_auto}
          >
            <option value={0}>All Ward</option>
            {wardList.map((ward: wardType) => (
              <option value={ward.id}>
                {capitalizeFirstLetter(ward.name)}
              </option>
            ))}
          </select>
          <select
            name="filter"
            id=""
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setFilter(Number(event.target.value))
            }
          >
            <option value={0}>All Patients</option>
            <option value={1}>Patient with Device</option>
            <option value={2}>Patient without Device</option>
          </select>

          <button
            className={styles.header_button}
            onClick={() => navigate('/hospital-dashboard/inpatient/addpatient')}
          >
            <img src={add_icon} alt="" className="" />
            Add Patient
          </button>
        </div> */}
      </div>
      <div className={styles.container_card} key={screenType}>
        {!dataTable[page?.page - 1] ||
        dataTable[page?.page - 1]?.length === 0 ? (
          <div className={styles.no_patient_found_conatiner}>
          <img
            src={No_Patient_Image}
            alt="No Patients Found"
            width={150}
          />
          <h3 className={styles.noPatientsFound}>No Patients Found</h3>
      </div>
        ) : (
          dataTable[page?.page - 1]?.map((patient) => {
            return (
              <PatientProfileCard
                key={patient.addedOn}
                patient={patient}
                patientActive={true}
                isDoctor={true}
                handleNofiedUserDetails={handleNofiedUserDetails}
              />
            );
          })
        )}
      </div>
      {dataTable[page?.page - 1]?.length > 0 && (
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

            {/* <option value="Year">Year</option> */}
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
