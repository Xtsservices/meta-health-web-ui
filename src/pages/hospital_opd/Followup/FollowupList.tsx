import React, { useRef } from "react";
import styles from "./Followup.module.scss";
import PersonIcon from "@mui/icons-material/Person";
// import AddDepartmentDialog from "./AddDepartmentDialog";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { PatientType } from "../../../types";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setLoading } from "../../../store/error/error.action";
import { authFetch } from "../../../axios/useAuthFetch";
function FollowupList() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const getAllPatientApi = useRef(true);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1,
  });
  const [dataTable, setDataTable] = React.useState<PatientType[][]>([]);
  const [allPatient, setAllPatients] = React.useState<PatientType[]>([]);

  const getAllPatient = async () => {
    dispatch(setLoading(true));
    const response = await authFetch(
      `followup/${user.hospitalID}/active`,
      user.token
    );
    if (response.message == "success") {
      setAllPatients(response.followUps);
    }
    dispatch(setLoading(false));
  };
  React.useEffect(() => {
    // getAllDepartment();
    if (user.token && getAllPatientApi.current) {
      getAllPatientApi.current = false;
      getAllPatient();
    }
  }, [user]);
  React.useEffect(() => {
    setDataTable([]);
    const pages = Math.ceil(allPatient.length / page.limit);
    const newArray = Array(pages).fill([]);
    // setUniqueDepartments(); // function to set unique departments
    newArray.forEach((_, index) => {
      // console.log(el ? "" : el);
      const patData = allPatient.slice(
        index * page.limit,
        (index + 1) * page.limit
      );
      setDataTable((prev) => {
        return [...prev, patData];
      });
    });
  }, [page, allPatient]);
  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <div className={styles.containerLeft}>
          <h3>Follow Up Patient List</h3>
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
            onClick={() => navigate("/hospital-dashboard/inpatient/addpatient")}
          >
            <img src={add_icon} alt="" className="" />
            Add Patient
          </button> */}
        </div>
      </div>
      <div className={styles.container_card}>
        {dataTable[page?.page - 1]?.map((patient) => {
          return (
            <div
              className={styles.card}
              style={{ border: "none" }}
              onClick={() => {
                navigate(`../list/${patient.id}`);
              }}
            >
              {/* <div className={styles.card_main}> */}

              <div className={styles.card_img}>
                {patient.imageURL && (
                  <img
                    src={patient.imageURL}
                    alt=""
                    className={styles.profile}
                  />
                )}
                {/* <img src={profile_pic} alt="" className={styles.profile} /> */}
                {!patient.imageURL && <PersonIcon className={styles.profile} />}
              </div>
              <h2>{patient.pName}</h2>
              <p>
                <strong>
                  Date:{" "}
                  {patient.followUpDate
                    ? new Date(patient.followUpDate)
                        .toLocaleString("en-GB")
                        .split(",")[0]
                    : ""}
                </strong>
              </p>
              <p>{patient.doctorName}</p>
              {/* </div> */}
              <button>View Details</button>
            </div>
          );
        })}
      </div>
      {allPatient?.length >= 10 && (
        <div className={styles.page_navigation}>
          Results Per Page
          <select
            name="filter"
            id=""
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
    </div>
  );
}

export default FollowupList;
