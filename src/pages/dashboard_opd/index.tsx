import React, { useState } from "react";
import styles from "../../pages/dashboard_triage/dashboard.module.scss"
import this_year_icon from "./../../../src/assets/dashboard/patients_this_year.png";
import this_month_icon from "./../../../src/assets/dashboard/patients_this_month.png";
import BarGraph from "./Bargraph";
import BasicTable from "./Table";
import DoughnutChart from "./Piechart";
import { selectCurrentUser } from "../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { authFetch } from "../../axios/useAuthFetch";
import { patientStatus } from "../../utility/role";
import { setLoading } from "../../store/error/error.action";
import { createWeekYearMonthObjOpd } from "../../utility/global";
import { currentDateObj, dateObj } from "../../utility/calender";
import { departmentType } from "../../types";
import NoPatientVisitedByZone from "./NoPatientVisitedByZone"

interface DataItem {
  x: string;
  y: number;
}

type dataType = {
  x: string;
  y: number;
};
type resType = {
  name: string;
  percentage: number;
};

function Dashboard_Outpatient() {
  const user = useSelector(selectCurrentUser);
  const [thisYearCount, setThisYearCount] = React.useState<null | number>(null);
  const [thisMonthCount, setThisMonthCount] = React.useState<null | number>(
    null
  );
  const [selectedDepartmentDataFilter, setselectedDepartmentDataFilter] =
    React.useState<string>("Day");
  const [dataTable, setDataTable] = React.useState<DataItem[]>([]);
  const [filterValue, setFilterValue] = React.useState<string | null>("");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed
  
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterMonth, setFilterMonth] = useState(currentMonth.toString()); // Default to current month
  const [data, setData] = React.useState<dataType[]>([]);
  const [departmentList, setDepartmentList] = React.useState<departmentType[]>(
    []
  );

  const dispatch = useDispatch();
  React.useEffect(() => {
    setFilterValue(currentDateObj[filterMonth as keyof dateObj]);
  }, [filterMonth]);

  const getTotalCount = async () => {
    dispatch(setLoading(true));

    const responseCombined = await authFetch(
      `patient/${user.hospitalID}/patients/count/visit/combined?ptype=${patientStatus.outpatient}`,
      user.token
    );
    if (responseCombined.message == "success") {
      setThisMonthCount(responseCombined.count[0]?.patient_count_month);
      setThisYearCount(responseCombined.count[0]?.patient_count_year);
    }

    const endpoint = `patient/${user.hospitalID}/patients/count/fullYearFilter/${patientStatus.outpatient}`;
    const query = `?filter=month&filterYear=${filterYear}${
      filterMonth ? `&filterMonth=${filterMonth}` : ""
    }`;
   

    const barGraphResponse = await authFetch(endpoint + query, user.token);

    if (barGraphResponse.message == "success") {
      setDataTable(
        createWeekYearMonthObjOpd(filterMonth, barGraphResponse.counts) || []
      );
    }
    dispatch(setLoading(false));
  };
  //pie chart data

  const getDepartments = async () => {
    const response = await authFetch(
      `department/${user.hospitalID}`,
      user.token
    );
    if (response.message == "success") {
      setDepartmentList(() => {
        return [...response.departments];
      });
    }
  };

  const getData = async () => {
    // dispatch(setLoading(true));
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/count/departments/filter?ptype=${patientStatus.outpatient}&filter=${selectedDepartmentDataFilter}`,
      user.token
    );

    if (response.message == "success") {
      setData(
        response.percentages.map((res: resType) => ({
          x: res.name,
          y: res.percentage,
        }))
      );
    }
  };

  React.useEffect(() => {
    if (user.token && patientStatus.outpatient && user.hospitalID) {
      getData();
      getDepartments();
    }
  }, [user, selectedDepartmentDataFilter]);

  React.useEffect(() => {
    if (data.length) {
      const newData: dataType[] = data || [];
      departmentList.forEach((department) => {
        const isData = newData.find((el) => el.x == department.name);
        if (!isData) newData.push({ x: department.name, y: 0 });
      });
      setData(newData);
    }
  }, [data]);

  React.useEffect(() => {
    if (user.token && patientStatus.outpatient && user.hospitalID) {
      getTotalCount();
    }
  }, [user, filterMonth, filterValue, filterYear]);

  const handleDepartmentFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setselectedDepartmentDataFilter(event.target.value);
  };
  

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
                className={styles.margin_left_auto} style ={{color:"#000"}}
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
                style={{ width: "5rem", color:"#000" }}
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
            colors="#f9b995"
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
          {/* <input type="date" /> */}
        </div>
        <BasicTable />
      </div>
      <div className={styles.container_patient_chart}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className={styles.container_patient_chart_header}
        >
          Patients Visit by Department
          <select
            name="filter"
            style={{ width: "6.2rem", marginLeft: "1rem",color:"#000" }}
            value={selectedDepartmentDataFilter}
            onChange={handleDepartmentFilterChange}
            className="custom-select"
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
export default Dashboard_Outpatient;
