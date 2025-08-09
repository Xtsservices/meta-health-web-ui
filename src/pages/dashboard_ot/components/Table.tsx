import * as React from "react";
import styles from "./table.module.scss";
import view_icon from "./../../../src/assets/dashboard/view_icon.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { PatientType } from "../../../types";
import { useNavigate } from "react-router-dom";
import { getAge } from "../../../utility/global";
import { patientStatus } from "../../../utility/role";
// import { setLoading } from "../../store/error/error.action";
function createData(
  Patient: number | null,
  department: string | null,
  age: string | null,
  name: string | null,
  doctor: string | null,
  email: string | null,
  action: string,
  id: number | null
) {
  return { Patient, department, age, name, doctor, email, action, id };
}

// const rows = [
//   createData(
//     449,
//     "10/05/2023",
//     20,
//     "First Name",
//     "Dr. First Name",
//     "Nephrology",
//     "View"
//   ),
//   createData(
//     449,
//     "10/05/2023",
//     20,
//     "First Name",
//     "Dr. First Name",
//     "Nephrology",
//     "View"
//   ),
//   createData(
//     449,
//     "10/05/2023",
//     20,
//     "First Name",
//     "Dr. First Name",
//     "Nephrology",
//     "View"
//   ),
// ];
type rowsType = {
  Patient: number | null;
  department: string | null;
  age: string | null;
  name: string | null;
  doctor: string | null;
  email: string | null;
  action: string;
  id: number | null;
};
export default function BasicTable() {
  const [recentPatient, setRecentPatient] = React.useState<PatientType[]>([]);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const getRecentData = async () => {
    // dispatch(setLoading(true));
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/recent/${patientStatus.outpatient}?userID=${user.id}&role=${user.role}`,
      user.token
    );
    // dispatch(setLoading(false));
    if (response.message == "success") {
      setRecentPatient(response.patients);
    }
  };
  React.useEffect(() => {
    if (user.token) {
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
          "View",
          patient.id
        );
      })
    );
  }, [recentPatient]);

  return (
    <div className={styles.table}>
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Name</th>
            <th>Age</th>
            <th>Doctor</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            return (
              <tr>
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
                  <button
                    className={styles.view_button}
                    onClick={() => {
                      navigate(`/hospital-dashboard/ot/list/${row.id}`);
                    }}
                  >
                    <img src={view_icon} alt="" className="" />
                    {row.action}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
