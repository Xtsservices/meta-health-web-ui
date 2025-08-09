import React, { useState } from "react";
import styles from "./dashboard.module.scss";
import total_patient_icon from "./../../../src/assets/dashboard/total_patient_icon.png";
import inpatient_icon from "./../../../src/assets/dashboard/inpatient_icon.png";
import discharge_patient_icon from "./../../../src/assets/dashboard/discharged_patient.png";
// import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";

import this_year_icon from "./../../../src/assets/dashboard/patients_this_year.png";
import this_month_icon from "./../../../src/assets/dashboard/patients_this_month.png";
import BarGraph from "./barGraph";
import BasicTable from "./table";
import DoughnutChart from "./piechart";
import { selectCurrentUser } from "../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { authFetch } from "../../axios/useAuthFetch";
import { patientStatus } from "../../utility/role";
import { setLoading } from "../../store/error/error.action";
import dayjs from "dayjs";
import { createWeekYearMonthObjOpd } from "../../utility/global";
interface DataItem {
  x: string;
  y: number;
}
// const labels = ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"];

function Staff_dashboard() {
  const user = useSelector(selectCurrentUser);
  const [totalInPatientCount, setTotalInPatientCount] = React.useState<
    null | number
  >(null);
  const [inPatientCount, setInPatientCount] = React.useState<null | number>(
    null
  );
  const [dischargedCount, setDischargedCount] = React.useState<null | number>(
    null
  );
  const [thisYearCount, setThisYearCount] = React.useState<null | number>(null);
  const [thisMonthCount, setThisMonthCount] = React.useState<null | number>(
    null
  );
  const [dataTable, setDataTable] = React.useState<DataItem[]>([]);
  const dispatch = useDispatch();
  const [value] = React.useState<dayjs.Dayjs | null>(dayjs(new Date()));
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterMonth, setFilterMonth] = useState(currentMonth.toString()); // Default to current month

  const apiCalledRef = React.useRef(false);

  const getTotalCount = async () => {
    dispatch(setLoading(true));
    // const inpatientResponse = await authFetch(
    //   `patient/${user.hospitalID}/patients/count/2`,
    //   user.token
    // );
    // if (inpatientResponse.message == "success") {
    //   setInPatientCount(inpatientResponse.count);
    // }
    // const dischargedResponse = await authFetch(
    //   `patient/${user.hospitalID}/patients/count/21`,
    //   user.token
    // );
    const patientCountData = await authFetch(
      `patient/${user.hospitalID}/patients/calendarCards?date=${
        value?.toISOString().split("T")[0]
      }`,
      user.token
    );
    if (patientCountData.message == "success") {
      setDischargedCount(patientCountData.Discharged_Patients);
      setInPatientCount(patientCountData.Total_InPatients);
      setTotalInPatientCount(patientCountData.Total_Patients);
    }
    // if (dischargedResponse.message == "success") {
    //   setDischargedCount(dischargedResponse.count);
    // }
    let selectedYear = dayjs().year();
    let selectedMonth = new Date().getMonth();
    if (value !== null) {
      selectedYear = value.year();
      selectedMonth = value.month(); // Dayjs months are 0-indexed, so add 1
    }
    const thisYearResponse = await authFetch(
      `patient/${user.hospitalID}/patients/count/visit/${selectedYear}/-1?ptype=${patientStatus.inpatient}`,
      user.token
    );

    if (thisYearResponse.message == "success") {
     // setThisYearCount(thisYearResponse.count);
    }

    const thisMonthResponse = await authFetch(
      `patient/${user.hospitalID}/patients/count/visit/${selectedYear}/${selectedMonth}?ptype=${patientStatus.inpatient}`,
      user.token
    );

    if (thisMonthResponse.message == "success") {
     // setThisMonthCount(thisMonthResponse.count);
    }

    const responseCombined = await authFetch(
      `patient/${user.hospitalID}/patients/count/visit/combined?ptype=${patientStatus.inpatient}`,
      user.token
    );
    if (responseCombined.message == "success") {
      setThisMonthCount(responseCombined.count[0]?.patient_count_month);
      setThisYearCount(responseCombined.count[0]?.patient_count_year);
    }

    const queryParams = new URLSearchParams();
    if (filterMonth) queryParams.append("filterMonth", filterMonth);

    const endpoint = `patient/${user.hospitalID}/patients/count/ipdfullYearFilter/${patientStatus.inpatient}`;
    const query = `?filter=month&filterYear=${filterYear}${
      filterMonth ? `&filterMonth=${filterMonth}` : ""
    }`;

    const barGraphResponse = await authFetch(endpoint + query, user.token);

    dispatch(setLoading(false));
    if (barGraphResponse.message == "success") {
      setDataTable(
        createWeekYearMonthObjOpd(filterMonth, barGraphResponse.counts) || []
      );
    }
  };

  const [selectedWardDataFilter, setSelectedWardDataFilter] =
    React.useState<string>("Day");
  React.useEffect(() => {
    if (user.token) {
      getTotalCount();
      apiCalledRef.current = true; // Set the ref to true after the first call
    }
  }, [user.token, value, filterYear, filterMonth]);
  // const value = dayjs(new Date());

  const handleWardFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedWardDataFilter(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardRow}>
        <div className={styles.container_widz + " " + styles.container_widz_1}>
          <img src={total_patient_icon} alt="" className="" />
          <h2 className={styles.widz_num}>
            {totalInPatientCount == null ? "......" : totalInPatientCount}
          </h2>
          <p className="">Total Patients</p>
        </div>
        <div className={styles.container_widz + " " + styles.container_widz_2}>
          <img src={inpatient_icon} alt="" className="" />
          <h2 className={styles.widz_num}>
            {inPatientCount == null ? "......" : inPatientCount}
          </h2>
          <p className="">Total Active Patients</p>
        </div>
        <div className={styles.container_widz + " " + styles.container_widz_3}>
          <img src={discharge_patient_icon} alt="" className="" />
          <h2 className={styles.widz_num}>
            {dischargedCount == null ? "......" : dischargedCount}
          </h2>
          <p className="">Total Discharged Patients</p>
        </div>
      </div>

      <div className={styles.container_graph}>
        <div className={styles.container_graph_box}>
          <div className={styles.container_graph_box_header}>
            Average Patients Visit
            <div className={styles.filterContainer}>
              <select
                name="yearFilter"
                onChange={(e) => setFilterYear(e.target.value)}
                value={filterYear}
                className={styles.margin_left_auto}
              >
                <option value="">Year</option>
                {Array.from(
                  { length: new Date().getFullYear() - 1950 + 1 },
                  (_, idx) => {
                    const year = new Date().getFullYear() - idx; // Start from the current year and decrement

                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  }
                )}
              </select>

              {/* Month Dropdown */}
              <select
                name="monthFilter"
                onChange={(e) => setFilterMonth(e.target.value)}
                value={filterMonth}
                style={{ width: "5rem" }}
              >
                <option value="">All</option>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec"
                ].map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <BarGraph
            data={dataTable}
            colors="#c0e4ff"
            barWidth={filterMonth ? 20 : 30}
          />
        </div>
        <div className={styles.container_graph_side}>
          <div
            className={
              styles.container_graph_side_box +
              " " +
              styles.container_graph_side_1
            }
          >
            <img src={this_month_icon} alt="" className="" />
            <p className=""> This Month </p>
            <h2 className={styles.widz_num}>
              {thisMonthCount == null ? "..." : thisMonthCount}
            </h2>
            <h4 className="">Patients</h4>
          </div>
          <div
            className={
              styles.container_graph_side_box +
              " " +
              styles.container_graph_side_2
            }
          >
            <img src={this_year_icon} alt="" className="" />
            <p className=""> This Year </p>
            <h2 className={styles.widz_num}>
              {thisYearCount == null ? "..." : thisYearCount}
            </h2>
            <h4 className="">Patients</h4>
          </div>
        </div>
      </div>

      <div className={styles.container_patient_data}>
        <div className={styles.container_patient_data_header}>
          Latest Patient Data
          {/* <input type="date" /> */}
        </div>
        <BasicTable />
      </div>
      <div className={styles.container_patient_chart}>
        <div className={styles.container_patient_chart_header}>
          Patients Visit by Ward
          <select
            name="filter"
            value={selectedWardDataFilter}
            onChange={handleWardFilterChange}
            className="custom-select"
          >
            <option value="Day">Daily</option>
            <option value="Week">Weekly</option>
            <option value="Month">Monthly</option>
          </select>
        </div>
        <DoughnutChart selectedWardDataFilter={selectedWardDataFilter} />
      </div>
    </div>
  );
}
export default Staff_dashboard;
