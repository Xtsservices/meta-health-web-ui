import styles from "./patientList.module.scss";
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";

import PatientCard from "./PatientCard";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../store/error/error.action";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { wardType } from "../../../types";
import { capitalizeFirstLetter } from "../../../utility/global";
import No_Patient_Found from "../../../assets/No_Patient_Found.jpg"

interface Patient {
  pName: string;
  photo: string;
  department: string;
  id: string;
  ward?: string;
  date: string;
  image: string;
  type: string;
  endDate?: string;
  doctorName: string;
  dischargeType: number;
}

// const useStyles = makeStyles(() => ({
//   customCalendar: {
//     "& .MuiPickersCalendar-root": {
//       width: "400px",
//       height: "400px",
//       padding: "12px"
//     }
//   }
// }));

const HospitalReceptionPatientList = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [patients, setPatients] = useState<Patient[]>([]);
  // const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  // const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  // const classes = useStyles();
  const [wardID, setWardID] = React.useState<number>(0);
  const [wardList, setWardList] = React.useState<wardType[]>([]);
  const [filter, setFilter] = React.useState(0);

  const [page, setPage] = React.useState({
    limit: 10,
    page: 1
  });
  const [dataTable, setDataTable] = useState<Patient[][]>([]);

  // const handleDateChange = (date: Dayjs | null) => {
  //   setSelectedDate(date);
  //   if (date) {
  //     fetchPatients(date);
  //   }
  //   setOpenCalendar(false); // Close calendar after selecting date
  // };

  const fetchPatients = async () => {
    let patientType;

    switch (filter) {
      case 0:
        patientType = 0; //All patients
        break;
      case 1:
        patientType = 1; // Outpatient
        break;
      case 2:
        patientType = 2; // Inpatient
        break;
      case 3:
        patientType = 3; // Emergency
        break;
      case 4:
        patientType = 21; // Discharged
        break;
      default:
        patientType = 2; // Default to IPD
    }

    // const formattedDate = date.format("YYYY-MM-DD");
    // dispatch(setLoading(true));

    try {
      const response = await authFetch(
        `patient/${user.hospitalID}/receptionpatients/${patientType}/${wardID}`,
        user.token
      );
      if (response.message === "success") {
        console.log(response, "response")
        setPatients(response.patients);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  const getWardData = React.useCallback(async () => {
    const wardResonse = await authFetch(`ward/${user.hospitalID}`, user.token);
    if (wardResonse.message == "success") {
      setWardList(wardResonse.wards);
    }
  }, [user.hospitalID, user.token]);

  useEffect(() => {
    if (user?.token) {
      fetchPatients()
      getWardData();
    }
  }, [user, filter, wardID]); // Added selectedDate to dependencies

  // const handleOpenCalendar = () => {
  //   setOpenCalendar(true);
  // };

  // const handleCloseCalendar = () => {
  //   setOpenCalendar(false);
  // };

  useEffect(() => {
    const pages = Math.ceil(patients.length / page.limit);
    const newArray = Array.from({ length: pages }, (_, index) =>
      patients.slice(index * page.limit, (index + 1) * page.limit)
    );

    setDataTable(newArray); // Set all pages of data at once
  }, [page, patients]);

  const showText = () => {
    switch (filter) {
      case 0:
        return "All Patients";

      case 1:
        return "OPD Patients";

      case 2:
        return "IPD Patients";

      case 3:
        return "EMERGENCY Patients";

      case 4:
        return "Discharge Patients";
    }
  };

  const filterValue = showText();
  return (
    <div className={styles.container}>
      <div className={styles.subContainernain}>
        <h2 className={styles.ptype}>{filterValue}</h2>
        <div className={styles.subContainer}>
          <div className={styles.containerRight}>
            <select
              name="ward"
              id=""
              style ={{color:"#000"}}
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
              style ={{color:"#000"}}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setFilter(Number(event.target.value))
              }
            >
              <option value={0}>All Patients</option>
              <option value={1}>OPD</option>
              <option value={2}>IPD</option>
              <option value={3}>EMERGENCY</option>
              <option value={4}>Discharge</option>
              <option value={5}>Patient with Device</option>
            </select>
          </div>

        {/* <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          p={1}
          m={2}
          sx={{
            backgroundColor: "white",
            borderRadius: "35px",
            cursor: "pointer",
            border: "1px solid gray",
          }}
          onClick={handleOpenCalendar}
        >
          <CalendarTodayIcon />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            {selectedDate ? selectedDate.format("MMM YYYY") : "Select Date"}
          </Typography>
        </Box> */}
        </div>
      </div>

      {/* <Modal open={openCalendar} onClose={handleCloseCalendar}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            width: "100%" // Full width
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: 4,
              boxShadow: 3
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                className={classes.customCalendar}
                shouldDisableDate={(date) => date.isAfter(dayjs())}
                sx={{
                  fontSize: "1.2rem",
                  width: "100%",
                  height: "100%"
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Modal> */}

      {patients?.length > 0 ? (
        <div className={styles.patientContainer}>
          <Grid container spacing={2} padding={2}>
            {dataTable[page?.page - 1]?.map((patient, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <PatientCard patient={patient} />
                </Grid>
              );
            })}
          </Grid>
          {patients?.length >= 10 && (
            <div className={styles.page_navigation}>
              Results Per Page
              <select
                name="filter"
                id=""
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  setPage((prevValue) => {
                    return {
                      ...prevValue,
                      limit: Number(event.target.value)
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
                disabled={Math.ceil(patients.length / page.limit) == page.page}
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
        <div style ={{display:"flex", flexDirection:"column",justifyContent:"center", width:"100%", alignItems:"center", height:"60vh"}} >
          <img src = {No_Patient_Found} alt = "No Patients Found" width={150} />
        <h3 style={{ textAlign: "center", marginTop: "3rem" }}>
          No Patients to Show
        </h3>
        </div>
      )}
    </div>
  );
};

export default HospitalReceptionPatientList;
