import { useState } from "react";
import styles from "./TreatmentTab.module.scss";
import Button from "@mui/material/Button";
import AddMedicine from "./AddMedicine";
import { prescriptionDataType } from "../../../../../types";
import add_icon from "../../../../../assets/reception/add_icon.png";

function PrescriptionTab() {
  const [addMedicine, setAddMedicine] = useState(false);
  const [prescriptionList] = useState<prescriptionDataType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = prescriptionList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(prescriptionList.length / itemsPerPage);
  function updateLatestData(_text: string) {
    console.log();
  }
  return (
    <>
      {!prescriptionList.length ? (
        <div className={styles.container_empty}>
          <p>No prescription yet!</p>
          <button
            onClick={() => {
              setAddMedicine(true);
            }}
          >
            <img src={add_icon} alt="" />
            Add Prescription
          </button>
        </div>
      ) : null}
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
                                year: "2-digit",
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
                {/* <DataTable prescriptionData={[prescription]} /> */}
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
      {addMedicine ? (
        <AddMedicine
          setOpen={setAddMedicine}
          open={addMedicine}
          updateLatestData={updateLatestData}
        />
      ) : null}
    </>
  );
}

export default PrescriptionTab;
