import * as React from "react";
import styles from "./patient-list-table.module.scss";
import view_icon from "./../../../src/assets/dashboard/view_icon.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import { PatientType } from "../../types";
import { useNavigate } from "react-router-dom";
import { getAge } from "../../utility/global";
import NoLatestPatientDashboardData from "../../pages/dashboard_opd/NoLatestPatientDashboardData";

function createData(
  Patient: number | null,
  age: string | null,
  name: string | null,
  email: string | null,
  lastModified: string | null,
  action: string,
  id: number | null
) {
  return { Patient, age, name, email, lastModified, action, id };
}

type rowsType = {
  Patient: number | null;
  age: string | null;
  name: string | null;
  email: string | null;
  lastModified: string | null;
  action: string;
  id: number | null;
};

interface BasicTable {
  fetchUrl: string;
  // fetchUrl is to get the recent data for table
  // Eg. : `patient/${user.hospitalID}/patients/recent/${patientStatus.emergency}?userID=${user.id}&role=${user.role}`

  buttonNavUrl: string;
  // buttonNavUrl is url of the form such that buttonNavUrl/patientId leads to patient details
  // Eg : `/hospital-dashboard/emergency-red/list/${row.id}`
}

function BasicTable({ buttonNavUrl, fetchUrl }: BasicTable) {
  const [recentPatient, setRecentPatient] = React.useState<PatientType[]>([]);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const getRecentDataApi = React.useRef(true);

  const getRecentData = React.useCallback(async () => {
    const response = await authFetch(fetchUrl, user.token);
    if (response.message == "success") setRecentPatient(response.patients);
  }, [fetchUrl, user.token]);

  React.useEffect(() => {
    if (user.token && getRecentDataApi.current) {
      getRecentDataApi.current = false;
      getRecentData();
    }
  }, [getRecentData, user.token]);

  const [rows, setRows] = React.useState<rowsType[]>([]);

  React.useEffect(() => {
    setRows(
      recentPatient.map((patient) => {
        return createData(
          patient.id,
          patient.dob,
          patient.pName,
          patient.email,
          patient.lastModified || "",
          "View",
          patient.id
        );
      })
    );
  }, [recentPatient]);

  async function handlePatientView(id: number | null) {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/isviewchange/${id}`,
      user.token
    );
    if (response.message == "success") {
      // return navigate(`/hospital-dashboard/opd/list/${id}`);
      return navigate(`${buttonNavUrl}/${id}`);
    }
  }

  return (
    <div className={styles.table}>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Added Date and Time</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {rows.length < 1 ? (
        <tr>
          <td colSpan={7}>
            <NoLatestPatientDashboardData />
          </td>
        </tr>
      ) : (
        rows.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{getAge(row.age || String(new Date()))}</td>
            <td>{row.email || "--------"}</td>
            <td>
              {row.lastModified
                ? (() => {
                    const utcDate = new Date(row.lastModified);
                    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
                    const istDate = new Date(utcDate.getTime() + istOffset);

                    // Format the IST date
                    return istDate.toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    });
                  })()
                : "--------"}
            </td>
            <td>
              <button
                className={styles.view_button}
                onClick={() => handlePatientView(row.id)}
              >
                <img src={view_icon} alt="View Eye" className="" />
                {row.action}
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

  );
}

export default BasicTable;
