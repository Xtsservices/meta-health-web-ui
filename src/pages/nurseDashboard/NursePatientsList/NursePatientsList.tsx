import styles from "./PatientsList.module.scss";
import React, { useEffect, useState } from "react";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../store/error/error.action";
import dayjs, { Dayjs } from "dayjs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { PatientType, wardType } from "../../../types";
import { capitalizeFirstLetter } from "../../../utility/global";
// import PatientCard from "./PatientCard";
import NurseCommonHeader from "../NurseCommonHeader";
import PatientProfileCard from "../../../component/PatientProfile/PatientProfileCard";
import No_Patient_Image from "../../../assets/No_Patient_Found.jpg";
import styles2 from "../../hospital_staff/InpatientList/InpatientList.module.scss"

const NursePatientsList = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [selectedDate,] = useState<Dayjs | null>(dayjs());
  // const classes = useStyles();
  const [wardID, setWardID] = React.useState<number>(0);
  const [wardList, setWardList] = React.useState<wardType[]>([]);
  const [filter, setFilter] = React.useState(0);
  const [, setOpenNotification] = React.useState<boolean>(false);
  const [, setTimelineID] = React.useState<number | undefined>(0);
  const [, setName] = React.useState("");
  const [filteredPatients, setFilteredPatients] = useState<PatientType[]>([]);

 

  const [page, setPage] = React.useState({
    limit: 10,
    page: 1,
  });
  const [dataTable, setDataTable] = useState<PatientType[][]>([]);


  useEffect(() => {
    if (!user?.hospitalID || !user?.role) return;
  
    const fetchPatients = async () => {
      try {
        const response = await authFetch(
          `nurse/getnursepatients/${user?.hospitalID}/${user?.role}`,
          user?.token
        );
        console.log("API Response:", response); // Log the response
        const data = await response?.data;
        console.log("Patients Data:", data); // Log the data
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err); // Log the error
        dispatch(setError("Failed to fetch patient data."));
      }
    };
  
    fetchPatients();
  }, [user?.hospitalID, user?.role]);

  useEffect(() => {
    let filtered = patients;

    if (filter !== 0) {
      // Apply filter based on ptype
      filtered = patients.filter((patient) => {
        switch (filter) {
          case 1: // OPD Patients
            return patient.ptype === 1;
          case 2: // IPD Patients
            return patient.ptype === 2;
          case 3: // Emergency Patients
            return patient.ptype === 3;
          case 4: // Discharged Patients
            return patient.ptype === 21;
          case 5: // FollowUp Patients
            return patient.followUp === 1; // Assuming followUp is a boolean
          default:
            return true; // Default to all patients
        }
      });
    }

    if (wardID !== 0) {
      filtered = filtered.filter((patient) => patient.wardID === wardID);
    }

    setFilteredPatients(filtered); // Update filtered patients
  }, [patients, filter,wardID]);

  // Paginate filtered patients
  useEffect(() => {
    const pages = Math.ceil(filteredPatients.length / page.limit);
    const newArray = Array.from({ length: pages }, (_, index) =>
      filteredPatients.slice(index * page.limit, (index + 1) * page.limit)
    );

    setDataTable(newArray); // Update paginated data
  }, [filteredPatients, page]);

  const getWardData = React.useCallback(async () => {
    const wardResonse = await authFetch(`ward/${user.hospitalID}`, user.token);
    if (wardResonse.message == "success") {
      setWardList(wardResonse.wards);
    }
  }, [user.hospitalID, user.token]);

  useEffect(() => {
    if (user?.token && selectedDate) {
      getWardData();
    }
  }, [user, filter, wardID, selectedDate]); 


  useEffect(() => {
    const pages = Math.ceil(patients.length / page.limit);
    const newArray = Array.from({ length: pages }, (_, index) =>
      patients.slice(index * page.limit, (index + 1) * page.limit)
    );

    setDataTable(newArray); // Set all pages of data at once
  }, [page, patients]);

  const handleNofiedUserDetails = (name: string, id: number | undefined) => {
    setTimelineID(id); 
    setName(name);
    setOpenNotification(true);
  };

  const showText = () => {
    switch (filter) {
      case 0:
        return "All Patients";

      case 1:
        return "OPD Patients";

      case 2:
        return "IPD Patients";

      case 3:
        return "Emergency Patients";

      case 4:
        return "Discharged Patients";

      case 5:
        return "FollowUp Patients";

      case 6:
        return "Patients With Device";
    }
  };

  const renderFilterOptions = () => {
    if (user?.role === 2003) {
      return (
        <>
          <option value={0}>All Patients</option>
          <option value={1}>OPD</option>
          <option value={2}>IPD</option>
        </>
      );
    } else {
      return (
        <>
          <option value={0}>All Patients</option>
          <option value={1}>OPD</option>
          <option value={2}>IPD</option>
          <option value={3}>Emergency</option>
          <option value={4}>Discharged</option>
          <option value={5}>FollowUp</option>
          <option value={6}>Patients with Device</option>
        </>
      );
    }
  };


  const filterValue = showText();
  return (
    <>
     <NurseCommonHeader/>
      

      <div className={styles.container}>
        <div className={styles.subContainernain}>
          <h2 className={styles.ptype}>{filterValue}</h2>
          <div className={styles.subContainer}>
            <div className={styles.containerRight}>
              {user?.role === 2002 && <select
                name="ward"
                id=""
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  setWardID(Number(event.target.value))
                }
                className={`{styles.margin_left_auto} custom-select`}
              >
                <option value={0}>All Ward</option>
                {wardList.map((ward: wardType) => (
                  <option value={ward.id}>
                    {capitalizeFirstLetter(ward.name)}
                  </option>
                ))}
              </select>}
              <select
                name="filter"
                id=""
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilter(Number(event.target.value))
                }
                className="custom-select"
              >
                {renderFilterOptions()}
              </select>
            </div>

          </div>
        </div>


        {patients?.length > 0 ? (
          <div className={styles.patientContainer}>
            <div className={styles2.container_card}>
                    {!dataTable[page?.page - 1] ||
                    dataTable[page?.page - 1]?.length === 0 ? (
                      <div className={styles2.no_patient_found_conatiner}>
                        <img src={No_Patient_Image} alt="No Patients Found" width={150} />
                        <h3 className={styles2.noPatientsFound}>No Patients Found</h3>
                      </div>
                    ) : (
                      dataTable[page?.page - 1]?.map((patient) => {
                        return (
                          <PatientProfileCard
                            patient={patient}
                            patientActive={true}
                            handleNofiedUserDetails={handleNofiedUserDetails}
                          />
                        );
                      })
                    )}
                  </div>
            {patients?.length > 10 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                Results per page
                <select
                  style={{ width: "5%", marginLeft: "1rem" }}
                  name="filter"
                  id=""
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    setPage((prevValue) => {
                      return {
                        ...prevValue,
                        limit: Number(event.target.value),
                      };
                      // });
                    });
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={patients.length}>All</option>

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
                  disabled={
                    Math.ceil(patients.length / page.limit) == page.page
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
          </div>
        ) : (
          <h3 style={{ textAlign: "center", marginTop: "3rem" }}>
            No Patients to show
          </h3>
        )}
      </div>
    </>
  );
};

export default NursePatientsList;
