import React, { useCallback, useEffect, useState } from "react";
import styles from "./dashboard.module.scss";

import { selectCurrentUser } from "../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { authFetch } from "../../axios/useAuthFetch";
import { patientStatus } from "../../utility/role";
import { setLoading } from "../../store/error/error.action";
import { createWeekYearMonthObj } from "../../utility/global";
import { currentDateObj, dateObj } from "../../utility/calender";

import PatientTypeChart from "./components/charts/patientsType";
import SurgeryChart from "./components/charts/surgery";

import {
  AlertCardContainer,
  OTAlertCardProps,
} from "./components/cards/alert-card";
import useOTConfig, { OTUserTypes } from "../../store/formStore/ot/useOTConfig";
import Calendar from "./components/calendar";

interface DataItem {
  x: string;
  y: number;
}

// interface User {
//   id: number;
//   departmentID: number;
//   firstName: string;
//   lastName: string;
//   photo: string | null;
//   imageURL?: string;
// }

function OTDashboard() {
  const user = useSelector(selectCurrentUser);
  const { userType } = useOTConfig();
  const [, setThisYearCount] = React.useState<null | number>(null);
  const [, setThisMonthCount] = React.useState<null | number>(null);
  const [, setDataTable] = React.useState<DataItem[]>([]);
  const [alertsData, setAlertsData] = React.useState<OTAlertCardProps[]>([]);
  // const [attendeesList, setAttendeesList] = React.useState<OTAttendee[]>([]);
  const [filterValue, setFilterValue] = React.useState<string | null>("");
  const [electiveCount, setElectiveCount] = React.useState(0);
  const [emergencyCount, setEmergencyCount] = React.useState(0);
  const dispatch = useDispatch();
  // const [filterYear, setFilterYear] = React.useState(
  //   new Date().getFullYear().toString()
  // );
  const [filterMonth, setFilterMonth] = React.useState("");
  React.useEffect(() => {
    setFilterValue(currentDateObj[filterMonth as keyof dateObj]);
  }, [filterMonth]);

  const [surgeryChartDemoData, setSurgeryChartDemoData] = React.useState([]);
  const [approvedChartDemoData, setApprovedChartDemoData] = React.useState<
    DataItem[]
  >([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

  const [filterYearSurgeryType, setFilterYearSurgeryType] = useState(
    currentYear.toString()
  );
  const [filterMonthSurgeryType, setFilterMonthSurgeryType] = useState(
    currentMonth.toString()
  ); // Default to current month

  const [filterYearApproved, setFilterYearApproved] = useState(
    currentYear.toString()
  );
  const [filterMonthApproved, setFilterMonthApproved] = useState(
    currentMonth.toString()
  );

  const [filterYearPatients, setFilterYearPatients] = useState(
    currentYear.toString()
  );
  const [filterMonthPatients, setFilterMonthPatients] = useState(
    currentMonth.toString()
  );

  useEffect(() => {
    if (!user?.token) return;
    setFilterMonth("") // dummy
    const status =
      userType === OTUserTypes.ANESTHETIST ? "pending" : "approved";

    const getAlertsData = async () => {
      try {
        const res = await authFetch(
          `ot/${user.hospitalID}/${status}/getAlerts`,
          user.token
        );
        if (res.status === 200) {
          setAlertsData(res.data);
        } else {
          console.error("Failed to fetch alerts data:", res.statusText);
        }
      } catch (err) {
        console.error("Error fetching alerts data:", err);
      }
    };

    getAlertsData();
  }, [user.hospitalID, user.token, userType]);

  const getTotalCount = useCallback(async () => {
    if (user.token) {
      dispatch(setLoading(true));
      const responseCombined = await authFetch(
        `patient/${user.hospitalID}/patients/count/visit/combined?ptype=${patientStatus.emergency}&zone=""`,
        user.token
      );

      if (responseCombined.message == "success") {
        setThisMonthCount(responseCombined.count[0]?.patient_count_month);
        setThisYearCount(responseCombined.count[0]?.patient_count_year);
      }
      const barGraphResponse = await authFetch(
        `patient/${user.hospitalID}/patients/count/fullYearFilter/${patientStatus.emergency}?filter=${filterMonth}&filterValue=${filterValue}&zone="" `,
        user.token
      );

      if (barGraphResponse.message == "success") {
        setDataTable(
          createWeekYearMonthObj(filterMonth, barGraphResponse.counts) || []
        );
      }
      dispatch(setLoading(false));
    }
  }, [dispatch, filterMonth, filterValue, user.hospitalID, user.token]);

  React.useEffect(() => {
    if (user.token) {
      getTotalCount();
    }
  }, [user, filterMonth, filterValue, getTotalCount]);

  React.useEffect(() => {
    if (user.token) {
      const getOTPatientTypeCount = async () => {
        const result = await authFetch(
          `ot/${user.hospitalID}/getOTPatientTypeCount?year=${filterYearPatients}&month=${filterMonthPatients}`,
          user.token
        );
        if (result.status == 200) {
          setElectiveCount(result.data.elective);
          setEmergencyCount(result.data.emergency);
        }
      };
      getOTPatientTypeCount();
    }
  }, [user.hospitalID, user.token, filterYearPatients, filterMonthPatients]);

  const percentageChartDemoData = [
    {
      x: "emergency",
      y: emergencyCount,
    },
    { x: "elective", y: electiveCount },
  ];

  const getSurgeryTypes = async () => {
    try {
      let res;
      if (userType === OTUserTypes.SURGEON) {
        res = await authFetch(
          `ot/${user.hospitalID}/surgeonSurgeryTypes?year=${filterYearSurgeryType}&month=${filterMonthSurgeryType}`,
          user.token
        );
      } else {
        res = await authFetch(
          `ot/${user.hospitalID}/surgeryTypes?year=${filterYearSurgeryType}&month=${filterMonthSurgeryType}`,
          user.token
        );
      }

      if (res.status === 200) {
        const transformedData = res.data.map(
          (item: { SurgeryType: string; PatientCount: number }) => ({
            x: item.SurgeryType,
            y: item.PatientCount,
          })
        );
        setSurgeryChartDemoData(transformedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user.token) {
      getSurgeryTypes();
    }
  }, [user, filterMonthSurgeryType, filterYearSurgeryType]);

  const getApprovedRejected = async () => {
    try {
      const res = await authFetch(
        `ot/${user.hospitalID}/approvedRejected?year=${filterYearApproved}&month=${filterMonthApproved}`,
        user.token
      );

      if (res.status === 200) {
        const { RejectedCount, ApprovedCount } = res.data[0];
        const ApprovedCountVal = ApprovedCount ? ApprovedCount : 0;
        const RejectedCountVal = RejectedCount ? RejectedCount : 0;
        const transformedData = [
          { x: "approved", y: parseInt(ApprovedCountVal) }, // convert to integer for correct chart display
          { x: "rejected", y: parseInt(RejectedCountVal) }, // convert to integer for correct chart display
        ];
        if (ApprovedCountVal > 0 || RejectedCountVal > 0) {
          setApprovedChartDemoData(transformedData);
        } else {
          setApprovedChartDemoData([]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user.token) {
      getApprovedRejected();
    }
  }, [user, filterMonthApproved, filterYearApproved]);

  const colorsForPercentageChart = {
    emergency: "#a357f4",
    elective: "#3ce7b3",
  };

  const colorsForApprovedChart = {
    approved: "#7ae584",
    rejected: "#ff686b",
  };
  return (
    <div className={styles.container}>
      <div className={styles.container_row}>
        <div className={styles.container_row_item}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 className={styles.heading}>Patients Percentage</h4>
            <div className={styles.filterContainer}>
              <select
                name="yearFilter"
                onChange={(e) => setFilterYearPatients(e.target.value)}
                value={filterYearPatients}
                style={{ width: "5rem" }}
                className={styles.margin_left_auto}
              >
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
                onChange={(e) => setFilterMonthPatients(e.target.value)}
                value={filterMonthPatients}
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
                  "Dec",
                ].map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {emergencyCount > 0 || electiveCount > 0 ? (
            <div className={styles.container_chart}>
              <PatientTypeChart
                data={percentageChartDemoData}
                colors={colorsForPercentageChart}
              />
            </div>
          ) : (
            <p style={{ textAlign: "center", paddingTop: "4rem" }}>
              No Data Available for the selected year and month.
            </p>
          )}
        </div>
        {/* ============ for Only ANESTHETIST */}
        {userType === OTUserTypes.ANESTHETIST && (
          <div className={styles.container_row_item}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 className={styles.heading}>Approved And Rejected</h4>

              <div className={styles.filterContainer}>
                <select
                  name="yearFilter"
                  onChange={(e) => setFilterYearApproved(e.target.value)}
                  value={filterYearApproved}
                  style={{ width: "5rem" }}
                  className={styles.margin_left_auto}
                >
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
                  onChange={(e) => setFilterMonthApproved(e.target.value)}
                  value={filterMonthApproved}
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
                    "Dec",
                  ].map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className={styles.container_calendar}>
                <div className={styles.container_chart}>
                  {approvedChartDemoData?.length > 0 ? (
                    <PatientTypeChart
                      data={approvedChartDemoData}
                      colors={colorsForApprovedChart}
                    />
                  ) : (
                    <p style={{ textAlign: "center", paddingTop: "4rem" }}>
                      No Data Available for the selected year and month.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {userType === OTUserTypes.SURGEON && (
          <div className={styles.container_row_item}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 className={styles.heading}>Surgery Types</h4>
              <div className={styles.filterContainer}>
                <select
                  name="yearFilter"
                  onChange={(e) => setFilterYearSurgeryType(e.target.value)}
                  value={filterYearSurgeryType}
                  style={{ width: "5rem" }}
                  className={styles.margin_left_auto}
                >
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
                  onChange={(e) => setFilterMonthSurgeryType(e.target.value)}
                  value={filterMonthSurgeryType}
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
                    "Dec",
                  ].map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.container_chart}>
              {surgeryChartDemoData.length > 0 ? (
                <SurgeryChart data={surgeryChartDemoData} />
              ) : (
                <p style={{ textAlign: "center", paddingTop: "4rem" }}>
                  No Data Available for the selected year and month.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {userType === OTUserTypes.ANESTHETIST && (
        <div className={styles.container_row}>
          <div className={styles.container_row_item}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 className={styles.heading}>Surgery Types</h4>
              <div className={styles.filterContainer}>
                <select
                  name="yearFilter"
                  onChange={(e) => setFilterYearSurgeryType(e.target.value)}
                  value={filterYearSurgeryType}
                  style={{ width: "5rem" }}
                  className={styles.margin_left_auto}
                >
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
                  onChange={(e) => setFilterMonthSurgeryType(e.target.value)}
                  value={filterMonthSurgeryType}
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
                    "Dec",
                  ].map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.container_chart}>
              {surgeryChartDemoData.length > 0 ? (
                <SurgeryChart data={surgeryChartDemoData} />
              ) : (
                <p style={{ textAlign: "center", paddingTop: "4rem" }}>
                  No Data Available for the selected year and month.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className={styles.container_column}>
        <div
          className={styles.container_column_item}
          style={{ paddingBottom: "2rem" }}
        >
          <h4 className={styles.heading}>Proposed Surgery Alerts</h4>
          <AlertCardContainer data={alertsData} />
        </div>
      </div>
      {userType === OTUserTypes.SURGEON && (
        <div className={styles.container_row}>
          <div className={styles.container_row_item}>
            <h4 className={styles.heading}>Scheduled Surgeries</h4>
            <div className={styles.container_chart}>
              <Calendar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default OTDashboard;
