import React, { useRef, useState } from "react";
import styles from "./dashboard.module.scss";

import { selectCurrentUser } from "../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { authFetch } from "../../axios/useAuthFetch";
import { patientStatus, zoneList, zoneType } from "../../utility/role";
import { setLoading } from "../../store/error/error.action";
import { createWeekYearMonthObjOpd } from "../../utility/global";
import { currentDateObj, dateObj } from "../../utility/calender";
import BasicTable from "./Table";
import BarGraph from "./Bargraph";

import DoughnutChart from "../../component/dashboard/charts/emergency-doughnut-chart";
import this_year_icon from "./../../../src/assets/dashboard/patients_this_year.png";
import this_month_icon from "./../../../src/assets/dashboard/patients_this_month.png";
import NoPatientVisitedByZone from "../dashboard_opd/NoPatientVisitedByZone";

interface DataItem {
  x: string;
  y: number;
}

type dataType = {
  x: string;
  y: number;
};

type resType = {
  zone: 1 | 2 | 3;
  patient_count: number;
};

function TriageDashboard() {
  const user = useSelector(selectCurrentUser);
  const [thisYearCount, setThisYearCount] = React.useState<null | number>(null);
  const [thisMonthCount, setThisMonthCount] = React.useState<null | number>(
    null
  );
  const [selectedZoneDataFilter, setselectedZoneDataFilter] =
    React.useState<string>("Day");

  const [dataTable, setDataTable] = React.useState<DataItem[]>([]);
  const [filterValue, setFilterValue] = React.useState<string | null>("");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterMonth, setFilterMonth] = useState(currentMonth.toString()); // Default to current month

  const isFetched = useRef(false);
  const dispatch = useDispatch();
  const getTotalCountApi = useRef(true);
  React.useEffect(() => {
    setFilterValue(currentDateObj[filterMonth as keyof dateObj]);
  }, [filterMonth]);
  const [data, setData] = React.useState<dataType[]>([]);

  const handleZoneFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setselectedZoneDataFilter(event.target.value);
  };
  const getData = async () => {
    console.log("selectyedZone", selectedZoneDataFilter);

    const response = await authFetch(
      `patient/${user.hospitalID}/patients/count/zone/${selectedZoneDataFilter}`,
      user.token
    );
    if (response.message === "success") {
      setData(
        response.count.map((res: resType) => ({
          x: zoneList[res.zone],
          y: res.patient_count
        }))
      );
    }
  };

  React.useEffect(() => {
    const getTotalCount = async () => {
      dispatch(setLoading(true));
      const zoneString = `${zoneType.red},${zoneType.green},${zoneType.yellow}`;
      const responseCombined = await authFetch(
        `patient/${user.hospitalID}/patients/count/visit/combined?ptype=${patientStatus.emergency}&zone=${zoneString}`,
        user.token
      );

      if (responseCombined.message == "success") {
        setThisMonthCount(responseCombined.count[0]?.patient_count_month);
        setThisYearCount(responseCombined.count[0]?.patient_count_year);
      }

      // const zoneString = `${zoneType.red},${zoneType.green},${zoneType.yellow}`;
      const queryParams = `filterMonth=${filterMonth}&filterYear=${filterYear}&zone=${zoneString}`;
      const barGraphResponse = await authFetch(
        `patient/${user.hospitalID}/patients/count/fullYearFilter/${patientStatus.emergency}?${queryParams}`,
        user.token
      );

      if (barGraphResponse.message == "success") {
        setDataTable(
          createWeekYearMonthObjOpd(filterMonth, barGraphResponse.counts) || []
        );
      }
      dispatch(setLoading(false));
    };

    if (user.token) {
      getTotalCountApi.current = false;
      getTotalCount();
      isFetched.current = true;
    }
  }, [user.hospitalID, user.token, filterMonth, filterValue, filterYear]);

  React.useEffect(() => {
    if (user.token && patientStatus.outpatient && user.hospitalID) {
      getData();
    }
  }, [user, selectedZoneDataFilter]);

  console.log("selectedZone", selectedZoneDataFilter);

  return (
    <div className={styles.container}>
      <div className={styles.container_row}>
        <div className={styles.container_graph}>
          <div className={styles.container_graph_box}>
            <div className={styles.container_graph_box_header}>
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
              colors="#ffced6"
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
      </div>
      <div className={styles.container_row}>
        <div className={styles.container_patient_data}>
          <div className={styles.container_patient_data_header}>
            Latest Patient Data
          </div>
          <BasicTable />
        </div>
        <div className={styles.container_patient_chart}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
            className={styles.container_patient_chart_header}
          >
            Patient visit by Zone
            <select
              name="filter"
              style={{ width: "6.2rem", marginLeft: "1rem", color:"#000" }}
              value={selectedZoneDataFilter}
              onChange={handleZoneFilterChange}
            >
              <option value="Day">Today</option>
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
            </select>
          </div>
          {data?.length > 0 ? (
            <DoughnutChart data={data} />
          ) : (
            <NoPatientVisitedByZone/>
          )}
        </div>
      </div>
    </div>
  );
}
export default TriageDashboard;
