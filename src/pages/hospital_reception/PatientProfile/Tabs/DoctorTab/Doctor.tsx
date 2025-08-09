import React from "react";
import styles from "./symptompsTable.module.scss";
import { capitalizeFirstLetter } from "../../../../../utility/global";
import { PatientDoctor } from "../../../../../types";

type rowType = {
  name: string;
  department: string | null;
  addedOn: string | null;
  active: boolean;
  purpose: string | null;
  category: "primary" | "secondary";
};
function createData(
  name: string,
  department: string | null,
  addedOn: string | null,
  active: boolean,
  purpose: string | null,
  category: "primary" | "secondary"
) {
  return { name, department, addedOn, active, purpose, category };
}

type TestTableType = {
  selectedList: PatientDoctor[];
};
export default function DoctorTable({ selectedList }: TestTableType) {
  const [rows, setRows] = React.useState<rowType[]>([]);
  React.useEffect(() => {
    setRows(
      selectedList.map((doctor) => {
        return createData(
          capitalizeFirstLetter(doctor.firstName + "_" + doctor.lastName),
          doctor.department,
          doctor.assignedDate,
          doctor.active,
          doctor.purpose,
          doctor.category
        );
      })
    );
  }, [selectedList]);

  return (
    <div className={styles.table}>
      {rows.length ? (
        <table>
          <thead>
            <tr>
              <th>S. No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Category</th>
              <th>Active</th>
              <th>Reason</th>
              <th>Assigned Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.sort(compareDates).map((row, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.department}</td>
                  <td>{capitalizeFirstLetter(row.category)}</td>
                  <td
                    style={{
                      backgroundColor: row.active ? "#44D627" : "#F73B0D",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  >
                    {capitalizeFirstLetter(
                      String(row.active ? "Active" : "Inactive")
                    )}
                  </td>
                  <td>{row.purpose}</td>

                  <td>
                    {new Date(row.addedOn || "").toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                      month: "short",
                      year: "2-digit",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        "No Doctor Added"
      )}
    </div>
  );
}

function compareDates(a: rowType, b: rowType) {
  return (
    new Date(b.addedOn || "").valueOf() - new Date(a.addedOn || "").valueOf()
  );
}
