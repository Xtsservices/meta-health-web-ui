import { useRef, useState, useEffect } from "react";
import styles from "./PreviousPrescriptions.module.scss";
import search_gif from "./../../../../../src/assets/PatientProfile/search_gif.gif";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import Button from "@mui/material/Button";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { prescriptionDataType } from "../../../../types";
import DataTable from "../../../../pages/hospital_opd/PatientProfile/PrescriptionTab/TreatmentTable";

function PreviousPrescriptions() {
  const getAllMedicineApi = useRef(true);
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [render, ] = useState(false);
  const [prescriptionList, setPrescriptionList] = useState<
    prescriptionDataType[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const getAllMedicine = async () => {
      const response = await authFetch(
        `prescription/${user.hospitalID}/${timeline.id}/${timeline.patientID}`,
        user.token
      );
      if (response.message === "success") {
        setPrescriptionList(response.prescriptions);
      }
    };
    if (user.token && timeline.id && getAllMedicineApi.current) {
      getAllMedicineApi.current = false;
      getAllMedicine();
    }
  }, [user, timeline, render]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = prescriptionList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(prescriptionList.length / itemsPerPage);

  return (
    <>
      {!prescriptionList.length ? (
        <div className={styles.container_empty}>
          <img src={search_gif} alt="" />
          <p>No Previous Prescriptions!</p>
        </div>
      ) : null}
      {prescriptionList.length ? (
        <div className={styles.container}>
          <div className={styles.prescription}>
            {currentItems.map((prescription: prescriptionDataType) => (
              <div className={styles.box} key={prescription.id}>
                <table>
                  <tbody>
                    <tr>
                      <th>Date</th>
                      <td>
                        <p>
                          {prescription.addedOn
                            ? new Date(prescription.addedOn || "")
                                .toLocaleString("en-GB")
                                .split(",")[0]
                            : new Date().toLocaleString("en-GB").split(",")[0]}
                        </p>
                      </td>
                    </tr>
                    {prescription.advice && ( // Check if prescription.advice exists
                      <tr>
                        <th>Advice</th>
                        <td>
                          <p>{prescription.advice}</p>
                        </td>
                      </tr>
                    )}

                    <tr>
                      <th>Follow Up</th>
                      <td>
                        <p>
                          {prescription.followUpDate
                            ? new Date(
                                prescription.followUpDate
                              ).toLocaleString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit"
                              })
                            : "No follow up"}
                        </p>
                      </td>
                    </tr>
                    {prescription.test && ( // Check if prescription.test exists
                      <tr>
                        <th>Test</th>
                        <td>
                          <p>{prescription.test}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <DataTable prescriptionData={[prescription]} />
                <div className={styles.line_top}></div>
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          <div className={styles.pagination}>
            <Button
              variant="contained"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span style={{ marginLeft: "5px", marginRight: "5px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="contained"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default PreviousPrescriptions;
