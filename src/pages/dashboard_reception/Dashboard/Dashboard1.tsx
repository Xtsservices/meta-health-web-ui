import { useRef, useState } from "react";
import styles from "./dashboard.module.scss";

import LineBarGraph from "./LineBarGraph";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import thisYearIcon from "../../../assets/reception/patients_this_year.png";
import thisMonthIcon from "../../../assets/reception/patients_this_month.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";

// import PieChart from "./PieChart";

const Dashboard1 = () => {
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const user = useSelector(selectCurrentUser);

  const monthOptions = [
    { value: "", name: "Month" },
    { value: "January", name: "January" },
    { value: "February", name: "February" },
    { value: "March", name: "March" },
    { value: "April", name: "April" },
    { value: "May", name: "May" },
    { value: "June", name: "June" },
    { value: "July", name: "July" },
    { value: "August", name: "August" },
    { value: "September", name: "September" },
    { value: "October", name: "October" },
    { value: "November", name: "November" },
    { value: "December", name: "December" },
  ];

  // Example calendar options for years
  const yearOptions = [
    { value: "", name: "Year" },

    { value: "2023", name: "2023" },
    { value: "2024", name: "2024" },
  ];

  //emergncy data
  const data = [
    { x: "ICU", y: 15, fullForm: "Intensive Care Unit", total: 30 },
    { x: "MW", y: 20, fullForm: "Maternity Ward", total: 30 },
    { x: "MSW", y: 10, fullForm: "Medical Specialty Ward", total: 30 },
    { x: "SW", y: 10, fullForm: "Surgical Ward", total: 30 },
    { x: "PW", y: 15, fullForm: "Pediatric Ward", total: 30 },
    { x: "OGW", y: 15, fullForm: "Obstetric Gynecological Ward", total: 30 },
    { x: "GW", y: 25, fullForm: "General Ward", total: 30 },
    { x: "DPS", y: 5, fullForm: "Day Care Inpatient Service", total: 30 },
  ];

  const colors = ["#84D090","#DCDCDC"];

  // out patient data
  const outPatientData = [
    { x: "GM", y: 15, fullForm: "General Medicine", total: 30 },
    { x: "NEP", y: 20, fullForm: "Nephrology", total: 30 },
    { x: "NEU", y: 7, fullForm: "Neurology", total: 30 },
    { x: "OP", y: 10, fullForm: "Orthopedics", total: 30 },
    { x: "CRD", y: 15, fullForm: "Cardiology", total: 30 },
    { x: "DEN", y: 13, fullForm: "Dentistry", total: 30 },
    { x: "END", y: 25, fullForm: "Endocrinology", total: 30 },
    { x: "ENT", y: 23, fullForm: "Ear, Nose, and Throat", total: 30 },
    { x: "OPT", y: 5, fullForm: "Ophthalmology", total: 30 },
    { x: "PET", y: 19, fullForm: "Pediatrics", total: 30 },
    { x: "DER", y: 11, fullForm: "Dermatology", total: 30 },
    { x: "MO", y: 21, fullForm: "Maternal and Obstetrics", total: 30 },
  ];

  const outPatientColors = ["#8584D0", "#DCDCDC"];

  //in patient data
  const inPatientData = [
    { x: "NE", y: 15, fullForm: "Neurology", total: 30 },
    { x: "PT", y: 20, fullForm: "Pulmonology", total: 30 },
    { x: "CIU", y: 10, fullForm: "Cardiac Intensive Unit", total: 30 },
    { x: "SIU", y: 10, fullForm: "Surgical Intensive Unit", total: 30 },
    { x: "ICM", y: 15, fullForm: "Intensive Care Medicine", total: 30 },
    {
      x: "ARDS",
      y: 15,
      fullForm: "Acute Respiratory Distress Syndrome",
      total: 30,
    },
    { x: "NG", y: 25, fullForm: "Nephrology and Gastroenterology", total: 30 },
    { x: "TR", y: 8, fullForm: "Transplantation", total: 30 },
    { x: "ON", y: 12, fullForm: "Oncology", total: 30 },
    { x: "AN", y: 3, fullForm: "Anesthesiology", total: 30 },
    { x: "CD", y: 22, fullForm: "Cardiology Department", total: 30 },
    { x: "NO", y: 17, fullForm: "Neurology and Orthopedics", total: 30 },
  ];

  const inPatientColors = ["#B76D6D", "#C4C4C4"];

  const datePickerRef = useRef<any>(null);

  return (
    <div className={styles.statBox}>
      <div className={styles.statisticsContainer}>
        {/* <h1 className={styles.heading}>Emergency Statistics</h1> */}
        <h1>Welcome {" "} {user.firstName + " " + user.lastName}</h1>
        <div className={styles.iconsContainer}>
          <div className={styles.calendar}>
            <CalendarTodayIcon />
            <div className={styles.timeFrameContainer}>

              <div className={styles.datePickerContainer}>
                <DatePicker
                  ref={datePickerRef}
                  selected={startDate}
                  onChange={(dates: [Date | null, Date | null]) => {
                    const [start, end] = dates;
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  selectsRange
                  isClearable
                  placeholderText="Select a date range"
                  className={styles.datePicker}
                  calendarClassName={styles.calendar}
                />
              </div>
            </div>
          </div>

          <div className={styles.notifications}>
            <NotificationsIcon />
          </div>
        </div>
      </div>
      <div className={styles.graphContainer}>
        <LineBarGraph
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          filterYear={filterYear}
          setFilterYear={setFilterYear}
          yearOptions={yearOptions}
          monthOptions={monthOptions}
          data={data}
          colors={colors}
          yParaText="Amount Of Persons"
          mainHeading="Emergency Statistics"
        />
        <div className={styles.container_graph_side}>
          <div className={styles.graph_side_1}>
            <img src={thisMonthIcon} alt="this month icon" className="" />
            <div>
            <p className=""> This Month </p>
            <h2 className={styles.widz_num}>10</h2>
            <h4 className="">Patients</h4>
            </div>
          </div>
          <div className={styles.graph_side_2}>
            <img src={thisYearIcon} alt="this year icon" className="" />
            <div>
            <p className=""> This Year </p>
            <h2 className={styles.widz_num}>50</h2>
            <h4 className="">Patients</h4>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* <h1 className={styles.heading}>Out Patient Statistics</h1> */}
        <div>
          <LineBarGraph
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
            filterYear={filterYear}
            setFilterYear={setFilterYear}
            yearOptions={yearOptions}
            monthOptions={monthOptions}
            data={outPatientData}
            colors={outPatientColors}
            yParaText="Amount Of Persons"
            mainHeading="Out Patient Statistics"
          />
        </div>
      </div>
      <div>
        {/* <h1 className={styles.heading}>In Patients Statistics</h1> */}
        <LineBarGraph
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          filterYear={filterYear}
          setFilterYear={setFilterYear}
          yearOptions={yearOptions}
          monthOptions={monthOptions}
          data={inPatientData}
          colors={inPatientColors}
          yParaText="Amount Of Persons"
          mainHeading="In Patients Statistics"
        />
      </div>
    </div>
  );
};

export default Dashboard1;
