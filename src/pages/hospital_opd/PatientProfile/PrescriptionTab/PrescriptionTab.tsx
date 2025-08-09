import { useRef, useState, useEffect } from "react";
import styles from "./TreatmentTab.module.scss";
import search_gif from "./../../../../../src/assets/PatientProfile/search_gif.gif";
import add_icon from "./../../../../../src/assets/addstaff/add_icon.png";
import { useSelector } from "react-redux";
import { selectCurrPatient, selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import AddMedicine from "./AddMedicine";
import Button from "@mui/material/Button";
import { prescriptionDataType } from "../../../../types";
import DataTable from "./TreatmentTable";

function PrescriptionTab() {
  const getAllMedicineApi = useRef(true);
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const [addMedicine, setAddMedicine] = useState(false);
  const [render, setRender] = useState(false);
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

  function updateLatestData(_text: string) {
    getAllMedicineApi.current = true;
    setRender(!render);
  }

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = prescriptionList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(prescriptionList.length / itemsPerPage);

  const handleAddPrescription = () => {
    setAddMedicine(true);
  };

  return (
    <>
      {!prescriptionList.length ? (
        <div className={styles.container_empty}>
          <img src={search_gif} alt="" />
          <p>No prescription yet!</p>
          {currentPatient.ptype !== 21 && (
 <button
 onClick={() => {
   setAddMedicine(true);
 }}
>
 <img src={add_icon} alt="" />
 Add Prescription
</button>
          )}
         
        </div>
      ) : null}
      {prescriptionList.length ? (
        <div className={styles.container}>
          <div className={styles.container_header}>
            <h4></h4>
{currentPatient.ptype !== 21 && (
 <Button
 variant="contained"
 onClick={handleAddPrescription}
 sx={{ ml: "auto" }}
>
 Add Prescription
</Button>
)}
           
          </div>
          <div className={styles.prescription}>
            {currentItems.map((prescription: prescriptionDataType) => (
              <div className={styles.box} key={prescription.id}>
                <table>
                  <tbody>
                    <tr>
                      <th>Date</th>
                      <td>
                        <p style ={{paddingTop:"1rem"}}>
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
                        <p style ={{paddingTop:"1rem"}}>
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
                          <p style = {{paddingTop:"1rem"}}>{prescription.test}</p>
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
