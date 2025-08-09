import * as React from "react";
import styles from "./SymptompsTable.module.scss";
import { symptompstype } from "../../../../types";

type rowType = {
  symptom: string;
  code: number | null;
  addedOn: string | null;
};
function createData(
  symptom: string,
  code: number | null,
  addedOn: string | null
) {
  return { symptom, code, addedOn };
}

type SymptompsTableType = {
  selectedList: symptompstype[];
  setSelectedList: React.Dispatch<React.SetStateAction<symptompstype[]>>;
};
export default function SymptompsTable({ selectedList }: SymptompsTableType) {
  const [rows, setRows] = React.useState<rowType[]>([]);
  React.useEffect(() => {
    setRows(
      selectedList.map((symptom) => {
        return createData(symptom.symptom, symptom.id, symptom.addedOn);
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
              <th>Symptoms</th>
              <th>Time and Date of Symptom</th>
            </tr>
          </thead>
          <tbody>
            {rows.sort(compareDates).map((row, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    {row.symptom.slice(0, 1).toUpperCase() +
                      row.symptom.slice(1).toLowerCase()}
                  </td>
                  <td>
                    {new Date(row.addedOn || "").toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                      month: "short",
                      year: "2-digit",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        "No Symptom Added"
      )}
    </div>
  );
}

function compareDates(a: rowType, b: rowType) {
  return (
    new Date(b.addedOn || "").valueOf() - new Date(a.addedOn || "").valueOf()
  );
}
