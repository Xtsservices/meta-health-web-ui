import React, { useCallback, useState } from "react";
import styles from "./dashboard-template.module.scss";
import this_year_icon from "/src/assets/dashboard/patients_this_year.png";
import this_month_icon from "/src/assets/dashboard/patients_this_month.png";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { currentDateObj, dateObj } from "../../../utility/calender";
import { authFetch } from "../../../axios/useAuthFetch";
import { setLoading } from "../../../store/error/error.action";
import { patientStatus } from "../../../utility/role";
import { createWeekYearMonthObjOpd } from "../../../utility/global";
import BarGraph from "../charts/bar-graph";
import BasicTable from "../patient-list-table";
import DoughnutChart from "./piechart";

interface DataItem {
  x: string;
  y: number;
}

type DashboardProps = {
  zoneName: string;
  zoneType: number;
};

function Dashboard({ zoneName, zoneType }: DashboardProps) {
  const user = useSelector(selectCurrentUser);
  const [thisYearCount, setThisYearCount] = React.useState<null | number>(null);
  const [thisMonthCount, setThisMonthCount] = React.useState<null | number>(
    null
  );
  const [dataTable, setDataTable] = React.useState<DataItem[]>([]);
  const [filterValue, setFilterValue] = React.useState<string | null>("");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterMonth, setFilterMonth] = useState(currentMonth.toString()); // Default to current month

  const [selectedWardDataFilter, setSelectedWardDataFilter] =
  React.useState<string>("Day");

  const dispatch = useDispatch();
  React.useEffect(() => {
    setFilterValue(currentDateObj[filterMonth as keyof dateObj]);
  }, [filterMonth]);

  const getTotalCount = useCallback(async () => {
    dispatch(setLoading(true));
    const responsePatientVisitCount = await authFetch(
      `patient/${user.hospitalID}/patients/count/visit/combined?ptype=${patientStatus.emergency}&zone=${zoneType}`,
      user.token
    );
    if (responsePatientVisitCount.message == "success") {
      setThisMonthCount(
        responsePatientVisitCount.count[0]?.patient_count_month
      );
      setThisYearCount(responsePatientVisitCount.count[0]?.patient_count_year);
    }
    const barGraphResponse = await authFetch(
      `patient/${user.hospitalID}/patients/count/fullYearFilter/${patientStatus.emergency}?filterYear=${filterYear}&filterMonth=${filterMonth}&zone=${zoneType}`,
      user.token
    );
    if (barGraphResponse.message == "success") {
      setDataTable(
        createWeekYearMonthObjOpd(filterMonth, barGraphResponse.counts) || []
      );
    }
    dispatch(setLoading(false));
  }, [
    dispatch,
    filterMonth,
    filterValue,
    zoneType,
    user.hospitalID,
    user.token,
    filterYear,
  ]);

  React.useEffect(() => {
    if (user.token) {
      getTotalCount();
    }
  }, [user, filterMonth, filterValue, filterYear]);

  const handleWardFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedWardDataFilter(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_row}>
        <div className={styles.container_graph}>
          <div className={styles.container_graph_box}>
           
              <div className={styles.container_graph_box_header}
           
              >
              Average Patients Visit
              {/* Year Dropdown */}
              <div className={styles.filterContainer}>
                <select
                  name="yearFilter"
                  onChange={(e) => setFilterYear(e.target.value)}
                  value={filterYear}
                  className={styles.margin_left_auto}
                  style={{ color: "black" }}
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
                  style={{ width: "5rem", color: "black" }}
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
                    "Dec",
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
              colors={
                zoneType === 1
                  ? '#ffd9d9' // Color for zoneType 1
                  : zoneType === 2
                  ? '#fff3c4' // Color for zoneType 2
                  : zoneType === 3
                  ? '#c1ffc4' // Color for zoneType 3
                  : '#defaultColor' // Default color if no condition matches
              }
              barWidth={filterMonth  ? 20 : 30}
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
      </div>
      <div className={styles.container_row}>
        <div className={styles.container_patient_data}>
          <div className={styles.container_patient_data_header}>
            Latest Patient Data
          </div>
          <BasicTable
            buttonNavUrl={`/hospital-dashboard/emergency-${zoneName}/list`}
            fetchUrl={`patient/${user.hospitalID}/patients/recent/${patientStatus.emergency}?zone=${zoneType}&role=${user.role}`}
          />
        </div>
        <div className={styles.container_patient_chart}>
        <div className={styles.container_patient_chart_header}>
            Patients Visit by Ward
            <select name="filter" value={selectedWardDataFilter} onChange={handleWardFilterChange} className="custom-select">
        <option value="Day">Daily</option>
          <option value="Week">Weekly</option>
          <option value="Month">Monthly</option>
         
        </select>
          </div>
          <DoughnutChart selectedWardDataFilter={selectedWardDataFilter} />
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
