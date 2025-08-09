import * as React from "react";
import styles from "./table.module.scss";
import view_icon from "./../../../src/assets/dashboard/view_icon.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import { PatientType } from "../../types";
import { useNavigate } from "react-router-dom";
import { getAge } from "../../utility/global";
import { patientStatus } from "../../utility/role";
import NoLatestPatientDashboardData from "./NoLatestPatientDashboardData";

function createData(
  Patient: number | null,
  department: string | null,
  age: string | null,
  name: string | null,
  doctor: string | null,
  email: string | null,
  lastModified: string | null,
  action: string,
  id: number | null
) {
  return {
    Patient,
    department,
    age,
    name,
    doctor,
    email,
    lastModified,
    action,
    id,
  };
}

type rowsType = {
  Patient: number | null;
  department: string | null;
  age: string | null;
  name: string | null;
  doctor: string | null;
  email: string | null;
  lastModified: string | null;
  action: string;
  id: number | null;
};

export default function BasicTable() {
  const [recentPatient, setRecentPatient] = React.useState<PatientType[]>([]);
  const user = useSelector(selectCurrentUser);
  const getRecentDataApI = React.useRef(true);
  const navigate = useNavigate();

  const getRecentData = async () => {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/recent/${patientStatus.outpatient}?userID=${user.id}&role=${user.role}`,
      user.token
    );
    if (response.message == "success") {
      setRecentPatient(response.patients);
    }
  };
  React.useEffect(() => {
    if (user.token && getRecentDataApI.current) {
      getRecentDataApI.current = false;
      getRecentData();
    }
  }, [user]);
  const [rows, setRows] = React.useState<rowsType[]>([]);

  React.useEffect(() => {
    setRows(
      recentPatient.map((patient) => {
        return createData(
          patient.id,
          patient.department || "No Data",
          patient.dob,
          patient.pName,
          patient.doctorName || "",
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
      return navigate(`/hospital-dashboard/opd/list/${id}`);
    }
  }

  const getNurseAddedData = async () => {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/nurseRecent/${patientStatus.outpatient}?userID=${user.id}&role=${user.role}`,
      user.token
    );
    if (response.message == "success") {
      setRecentPatient(response.patients);
    }
  };

  React.useEffect(() => {
    if (user.role === 2003) {
      getNurseAddedData();
    } else {
      getRecentData();
    }
  }, [user, user?.id]);

  return (
      <div className={styles.table}>
        <table>
          <thead
            style={{
              position: "sticky",
              top: -16,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <tr>
              <th>Department</th>
              <th>Name</th>
              <th>Age</th>
              <th>Doctor</th>
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
                  <td>
                    {row.department &&
                      row.department?.slice(0, 1).toUpperCase() +
                        row.department?.slice(1).toLowerCase()}
                  </td>
                  <td>{row.name}</td>
                  <td>{getAge(row.age || String(new Date()))}</td>
                  <td>{row.doctor}</td>
                  <td>{row.email || "--------"}</td>
                  <td>
                    {row.lastModified
                      ? (() => {
                          const utcDate = new Date(row.lastModified);
                          const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
                          const istDate = new Date(
                            utcDate.getTime() + istOffset
                          );

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
                      <img src={view_icon} alt="" className="" />
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
