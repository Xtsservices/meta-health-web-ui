import React from "react";
import styles from "./TreatmentTab.module.scss";
import search_gif from "./../../../../../src/assets/PatientProfile/search_gif.gif";
import add_icon from "./../../../../../src/assets/addstaff/add_icon.png";
import { useSelector } from "react-redux";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import AddMedicine from "./AddMedicine";
import Button from "@mui/material/Button";
import { prescriptionDataType } from "../../../../types";
import DataTable from "./TreatmentTable";

function PrescriptionTab() {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [addMedicine, setAddMedicine] = React.useState(false);
  // const [medicineList, setMedicineList] = React.useState<MedicineType[]>([]);
  // const { medicineList, setMedicineList } = useMedicineListStore();
  const [prescriptionList, setPrescriptionList] = React.useState<
    prescriptionDataType[]
  >([]);

  // const { medicineReminder } = useMedicineStore();
  const getAllMedicine = async () => {
    const response = await authFetch(
      `prescription/${user.hospitalID}/${timeline.id}/${timeline.patientID}`,
      user.token
    );
    if (response.message == "success") {
      setPrescriptionList(response.prescriptions);
      // setMedicineList(response.medicines);
    }
  };
  React.useEffect(() => {
    if (user.token && timeline.id) {
      getAllMedicine();
    }
  }, [user, timeline]);

  return (
    <>
      {!prescriptionList.length ? (
        <div className={styles.container_empty}>
          <img src={search_gif} alt="" />
          <p>No prescription yet!</p>

          <button
            onClick={() => {
              // setIsTreament(true);
              setAddMedicine(true);
            }}
          >
            <img src={add_icon} alt="" />
            Add Prescription
          </button>
        </div>
      ) : (
        ""
      )}
      {prescriptionList.length ? (
        <div className={styles.container}>
          <div className={styles.container_header}>
            <h4></h4>

            <Button
              variant="contained"
              onClick={() => setAddMedicine(true)}
              sx={{ ml: "auto" }}
            >
              Add Prescription
            </Button>
          </div>
          <div className={styles.prescription}>
            {prescriptionList.map((prescription) => {
              return (
                <>
                  <div className={styles.box}>
                    <table>
                      <tbody>
                        <tr>
                          <th>Date</th>
                          <td>
                            <p>
                              {" "}
                              {prescription.addedOn
                                ? new Date(prescription.addedOn || "")
                                    .toLocaleString("en-GB")
                                    .split(",")[0]
                                : new Date()
                                    .toLocaleString("en-GB")
                                    .split(",")[0]}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <th>Diagnosis</th>
                          <td>
                            <p>{prescription.diagnosis}</p>
                          </td>
                        </tr>
                        <tr>
                          <th>Notes</th>
                          <td>
                            <p>{prescription.notes}</p>
                          </td>
                        </tr>
                        <tr>
                          <th>Advice</th>
                          <td>
                            <p>{prescription.advice}</p>
                          </td>
                        </tr>
                        <tr>
                          <th>Follow Up</th>
                          <td>
                            <p>
                              {" "}
                              {prescription.followUpDate
                                ? new Date(
                                    prescription.followUpDate
                                  ).toLocaleString("en-US", {
                                    day: "2-digit",
                                    // hour: "numeric",
                                    // minute: "numeric",
                                    // hour12: false,
                                    month: "short",
                                    year: "2-digit",
                                  })
                                : "No follow up"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <th>Test</th>
                          <td>
                            <p>{prescription.test}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <DataTable prescriptionData={prescription} />
                    <div className={styles.line_top}></div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
      {addMedicine ? (
        <AddMedicine
          setOpen={setAddMedicine}
          open={addMedicine}
          setPrescriptionLit={setPrescriptionList}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default PrescriptionTab;
