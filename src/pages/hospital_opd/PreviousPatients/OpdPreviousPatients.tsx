import React, { useEffect } from "react";
import styles from "./OpdPrevious.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { PatientType } from "../../../types";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setLoading } from "../../../store/error/error.action";
import { authFetch } from "../../../axios/useAuthFetch";
import { patientStatus } from "../../../utility/role";
import FollowupList from "../../hospital_ot/Followup/FollowupList";
import No_Patient_Image from "../../../assets/No_Patient_Found.jpg"

function OpdPreviousPatients() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1,
  });
  const [dataTable, setDataTable] = React.useState<PatientType[][]>([]);
  const [allPatient, setAllPatients] = React.useState<PatientType[]>([]);
  const [filteredPatients, setFilteredPatients] = React.useState<PatientType[]>(
    []
  );
  const [filtervalue, setFilterValue] = React.useState<number | undefined>(0);

  const getNurseData = async () => {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/nurseopdprevious/${patientStatus.outpatient}?userID=${user.id}&role=${user.role}`,
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

      if (filtervalue === 2) {
        // Filter for ptype = 21 (discharge) and remove duplicates
        const filteredPatients = removeDuplicates(
          response.patients.filter((patient: any) => patient.ptype === 21)
        );
        setFilteredPatients(filteredPatients);
      } else if (filtervalue === 0) {
        // Filter for ptype = 1 (previous patients) and remove duplicates
        const filteredPatients = removeDuplicates(
          response.patients.filter((patient: any) => patient.ptype === 1)
        );
        setFilteredPatients(filteredPatients);
      }

      // Remove duplicates for all patients
      const uniqueAllPatients = removeDuplicates(response.patients);
      setAllPatients(uniqueAllPatients);
    }
  };

  const getAllPatient = async () => {
    dispatch(setLoading(true));
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/opdprevious/${patientStatus.outpatient}?userID=${user.id}&role=${user.role}`,
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

      if (filtervalue === 2) {
        // Filter for ptype = 21 (discharge) and remove duplicates
        const filteredPatients = removeDuplicates(
          response.patients.filter((patient: any) => patient.ptype === 21)
        );
        setFilteredPatients(filteredPatients);
      } else if (filtervalue === 0) {
        // Filter for ptype = 1 (previous patients) and remove duplicates
        const filteredPatients = removeDuplicates(
          response.patients.filter((patient: any) => patient.ptype === 1)
        );
        setFilteredPatients(filteredPatients);
      }

      // Remove duplicates for all patients
      const uniqueAllPatients = removeDuplicates(response.patients);
      setAllPatients(uniqueAllPatients);
    }

    dispatch(setLoading(false));
  };

  React.useEffect(() => {
    setDataTable([]);
    const pages = Math.ceil(filteredPatients.length / page.limit);
    const newArray = Array(pages).fill([]);
    newArray.forEach((_, index) => {
      const patData = filteredPatients.slice(
        index * page.limit,
        (index + 1) * page.limit
      );
      setDataTable((prev) => {
        return [...prev, patData];
      });
    });
  }, [page, filteredPatients]);

  React.useEffect(() => {
    if (user?.role === 2003) {
      getNurseData();
    } else {
      getAllPatient();
    }
  }, [user, user?.id]);

  useEffect(() => {
    if (filtervalue === 2) {
      const uniquePatients = allPatient.filter(
        (patient) => patient.ptype === 21
      ); // Add filter for ptype = 21 for discharge
      setFilteredPatients(uniquePatients);
    } else if (filtervalue === 0) {
      const uniquePatients = allPatient.filter(
        (patient) => patient.ptype === 1
      ); // Add filter for ptype = 1 previous patients
      setFilteredPatients(uniquePatients);
    }
  }, [filtervalue]);


  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <div className={styles.containerLeft}>
          {filtervalue === 0 ? (
            <h3>Active Patient List</h3>
          ) : filtervalue === 1 ? (
            <h3>Follow Up Patient List</h3>
          ) : filtervalue === 2 ? (
            <h3>Previous Patient List</h3>
          ) : null}
        </div>

        <div style={{ marginBottom: "1rem" }} className={styles.containerRight}>
          <select
            name="filter"
            id=""
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setFilterValue(Number(event.target.value))
            }
            className="custom-select"
          >
            <option value={0}>Active Patients</option>
            <option value={1}>Follow Up Patients</option>
            <option value={2}>Previous Patients</option>
          </select>
        </div>
      </div>

      {filtervalue === 2 || filtervalue === 0 ? (
        dataTable?.length===0 ? (
          <div className={styles.no_patient_found_conatiner}>
            <img
              src={No_Patient_Image}
              alt="No Patients Found"
              width={150}
            />
            <h3 className={styles.noPatientsFound}>No Patients Found</h3>
        </div>
        ) : (
          <>
            <div className={styles.container_card}
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
                      <p className={styles.doctor}>
                        Doctor: {patient.doctorName}
                      </p>
                      <button className={styles.details_button}>
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {dataTable?.[0]?.length >= 10 && (
              <div className={styles.page_navigation}>
                Results Per Page
                <select
                  name="filter"
                  id=""
                  style={{ width: "20%" }}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    setPage((prevValue) => {
                      return {
                        ...prevValue,
                        limit: Number(event.target.value),
                      };
                    });
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={allPatient.length}>All</option>
                </select>
                <IconButton
                  aria-label="previous"
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
                  aria-label="next"
                  disabled={
                    Math.ceil(allPatient.length / page.limit) === page.page
                  }
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
          </>
        )
      ) : (
        <FollowupList />
      )}
    </div>
  );
}

export default OpdPreviousPatients;
