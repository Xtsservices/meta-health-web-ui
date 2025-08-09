import { useDispatch, useSelector } from "react-redux";
import styles from "./LabsDashboard.module.scss";
import { useEffect, useState } from "react";
import this_year_icon from "./../../../../src/assets/dashboard/patients_this_year.png";
import this_month_icon from "./../../../../src/assets/dashboard/patients_this_month.png";
import dayjs from "dayjs";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { alertType } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
// import AlertCard from "../../dashboard_labs/alerts/AlertCard";
import BarGraph from "../../dashboard_triage/Bargraph";
import { setLoading } from "../../../store/error/error.action";
import { createWeekYearMonthObjOpd } from "../../../utility/global";
import MyTasks from "../MyTasks";

interface DataItem {
  x: string;
  y: number;
}

const LabsDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [dataTable, setDataTable] = useState<DataItem[]>([]);
  const dispatch = useDispatch();
  const [filterValue] = useState<string | null>("");
  const [thisYearCount, setThisYearCount] = useState<null | number>(null);
  const [thisMonthCount, setThisMonthCount] = useState<null | number>(null);
  const [value] = useState<dayjs.Dayjs | null>(dayjs(new Date()));

  const [, setAlerts] = useState<alertType[]>([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterMonth, setFilterMonth] = useState(currentMonth.toString()); // Default to current month


  useEffect(() => {
    const getTotalCount = async () => {
      dispatch(setLoading(true));

      const responseCombined = await authFetch(
        `test/${user.roleName}/${user.hospitalID}/getPatientCountMonthAndYear`,
        user.token
      );

      if (responseCombined.message === "success") {
        setThisMonthCount(responseCombined.count[0]?.patient_count_month);
        setThisYearCount(responseCombined.count[0]?.patient_count_year);
      }

      const query = `?filter=month&filterYear=${filterYear}${
        filterMonth ? `&filterMonth=${filterMonth}` : ""
      }`;
      const endpoint = `test/${user.roleName}/${user.hospitalID}/fullYear${query}`;
      const barGraphResponse = await authFetch(endpoint, user.token);

      dispatch(setLoading(false));
      if (barGraphResponse.message === "success") {
        setDataTable(
          createWeekYearMonthObjOpd(filterMonth, barGraphResponse.counts) || []
        );
      }
      dispatch(setLoading(false));
    };
    if (user.token && user.hospitalID) {
      getTotalCount();
    }
  }, [
    user.token,
    filterMonth,
    filterValue,
    user.hospitalID,
    dispatch,
    value,
    user.roleName,
    filterYear,
  ]);

  useEffect(() => {
    const getAlerts = async () => {
      const alertsData = await authFetch(
        `/test/${user.roleName}/${user.hospitalID}/getAlerts`,
        user.token
      );

      console.log(alertsData);
      if (alertsData.message === "success") {
        setAlerts(
          alertsData.alerts.filter(
            (value: { timeLineID: any }, index: any, self: any[]) =>
              self.findIndex((item) => item.timeLineID === value.timeLineID) ===
              index
          )
        );
      } else {
        setAlerts([]);
      }
    };
    getAlerts();
  }, [user.hospitalID, user.roleName, user.token]);

  return (
    <div className={styles.container}>
      <div className={styles.container_row}>
        <div className={styles.container_graph}>
          <div className={styles.container_graph_box}>
            <div className={styles.container_graph_box_header}
           
            >
              {`Average Patients Visit`}

              <div className={styles.filterContainer}
              
              >
                <select
                  name="yearFilter"
                  onChange={(e) => setFilterYear(e.target.value)}
                  value={filterYear}
                  className={styles.margin_left_auto}
                  style={{ color: user.roleName === 'radiology' ? '#1977f3' : '#1977f3', }}
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
                  style={{width:'5rem', color:'#1977f3'}}
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
            <div className={styles.container__bargraph}>
              <BarGraph
                data={dataTable}
                colors={user.roleName === 'radiology' ? '#ecdba7' : '#e7c2dd'}
                barWidth={filterMonth ? 20 : 30}
              />
            </div>
          </div>
        </div>

        <div className={styles.container_graph_box_side}>
          <div
            className={
              styles.container_graph_box_side_card + " " + styles.cardBlue
            }
          >
            <img src={this_month_icon} alt="Person Image" />
            <p className=""> This Month </p>
            <h2 className={styles.widz_num}>
              {thisMonthCount == null ? "..." : thisMonthCount}
            </h2>
            <h4 className="">Patients</h4>
          </div>
          <div
            className={
              styles.container_graph_box_side_card + " " + styles.cardGreen
            }
          >
            <img src={this_year_icon} alt="Group Image" />
            <p className=""> This Year </p>
            <h2 className={styles.widz_num}>
              {thisYearCount == null ? "..." : thisYearCount}
            </h2>
            <h4 className="">Patients</h4>
          </div>
        </div>
      </div>

      <div className={styles.labsDashboard__alertContainer}>
        {/* <h2>TEST NOTIFICATION</h2> */}
        {/* <div className={styles.labsDashboard__alerts}>
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div> */}
        <MyTasks />
      </div>
    </div>
  );
};

export default LabsDashboard;
