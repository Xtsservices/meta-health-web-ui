import React from "react";
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
import No_Patient_Image from "../../../assets/No_Patient_Found.jpg";
function FollowupList() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1
  });

  const [dataTable, setDataTable] = React.useState<PatientType[][]>([]);
  const [allPatient, setAllPatients] = React.useState<PatientType[]>([]);

  const getAllPatient = async () => {
    dispatch(setLoading(true));
    const response = await authFetch(
      `followup/${user.hospitalID}/active`,
      user.token
    );
    if (response.message === "success") {
      // Function to remove duplicates based on `id`
      const removeDuplicates = (patients: any[]) => {
        const seen = new Set();
        return patients.filter((patient: any) => {
          if (seen.has(patient.id)) {
            return false; // Duplicate, exclude from result
          }
          seen.add(patient.id);
          return true; // Unique, include in result
        });
      };

      // Remove duplicates from response.followUps before setting the state
      const uniqueFollowUps = removeDuplicates(response.followUps);
      setAllPatients(uniqueFollowUps);
    }

    dispatch(setLoading(false));
  };
  React.useEffect(() => {
    // getAllDepartment();
    if (user.token) {
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
      {allPatient?.length===0?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginTop:"70px"}}>
          <img
            src={No_Patient_Image}
            alt="No Patients Found"
            width={150}
          />
          <h3 className={styles.noPatientsFound}>No Patients Found</h3>
      </div>
      ):(

      <div className={styles.container_card}
        // style={{
        //   display: "grid",
        //   gridTemplateColumns: "repeat(5, 1fr)", // 5 cards per row
        //   gap: "20px",
        //   marginTop: "10px"
        // }}
      >
        {dataTable[page?.page - 1]?.map((patient) => {
          return (
            <div
              className={styles.card}
              onClick={() => {
                navigate(`../list/${patient.id}`);
              }}
            >
              <div className={styles.card_header}>
                <div className={styles.card_img}>
                  {patient.imageURL ? (
                    <img
                      src={patient.imageURL}
                      alt="Profile"
                      className={styles.profile}
                    />
                  ) : (
                    <PersonIcon className={styles.profile_icon} />
                  )}
                </div>
              </div>
              <div className={styles.card_body}>
                <h2 className={styles.name}>{patient.pName}</h2>
                <p className={styles.doctor}>Doctor: {user.firstName} {user.lastName}</p>
                <button className={styles.details_button}>View Details</button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {dataTable?.[0]?.length >= 10 && (
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
    </div>
  );
}

export default FollowupList;
