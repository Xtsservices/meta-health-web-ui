import { useSelector } from "react-redux";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Button,
} from "@mui/material";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useEffect, useState } from "react";
import { authFetch } from "../../../axios/useAuthFetch";
import { formatDate2 } from "../../../utility/global";
import styles from "../../hospital_pharmacy/OrderManagement/OuterTable.module.scss";
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";
import PrintIcon from "@mui/icons-material/Print";
import TaxInvoiceDocument from "../../hospital_pharmacy/TaxInvoice/TaxInvoiceDocument";

interface PatientOrderCompletedProps {
  id: number;
  hospitalID: number;
  patientTimeLineID: number | null;
  location: number | null;
  departmemtType: number;
  doctorID: number | null;
  medicinesList: [];
  status: string;
  notes: null;
  addedOn: string;
  discount: object;
  firstName: string;
  lastName: string;
  pName: string;
  patientID: number;
  userID?:number
  testsList?:[]
}


const DoctorNameCell = ({ userID }: { userID: number }) => {
  const [doctorName, setDoctorName] = useState<string>("Loading...");
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const response = await authFetch(`user/${userID}`, user.token);
        if (response.message === "success") {
          setDoctorName(response.user.firstName + " " + response.user.lastName);
        } else {
          setDoctorName("N/A");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setDoctorName("Error");
      }
    };

    fetchDoctorName();
  }, [userID]);

  return <TableCell style={{ fontWeight: "bold" }}>{doctorName}</TableCell>;
};

const LabsTaxInvoice = () => {
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const [patientOrderCompleted, setPatientOrderCompleted] = useState<
    PatientOrderCompletedProps[]
  >([]);

  useEffect(() => {
    const getMedicineInventoryPatientsOrderWithType = async () => {
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${
          user.hospitalID
        }/${"completed"}/getTestsTaxInvoice`,
        user.token
      );
      if (response.status === 200) {
        console.log(response.data);
        setPatientOrderCompleted(response.data);
      }
    };

    if (user.hospitalID && user.token) {
      getMedicineInventoryPatientsOrderWithType();
    }
  }, [user.hospitalID, user.token]);

  


  return (
    <div style={{ marginTop: "1rem" }}>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Patient ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Patient name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Doctor name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Invoice</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody sx={{ padding: "1rem" }}>
            {patientOrderCompleted.length === 0 && (
              <div style={{ textAlign: "center", textTransform: "uppercase" }}>
                <h4>No New Tax Invoice !!</h4>
              </div>
            )}
            {patientOrderCompleted.length > 0 &&
              patientOrderCompleted?.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow sx={{ backgroundColor: "#b2caea" }}>
                    <TableCell style={{ fontWeight: "bold" }}>
                      {order.id}
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      {order.pName}
                    </TableCell>
                    <DoctorNameCell userID={order.userID ?? 0} />


                    <TableCell style={{ fontWeight: "bold" }}>
                      Lab
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      {formatDate2(order.addedOn)}
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      <PDFDownloadLink
                        document={
                          <TaxInvoiceDocument
                            currentPatient={currentPatient}
                            medicineList={order.testsList}
                          />
                        }
                        fileName="TaxInvoice.pdf"
                      >
                        {({ loading }) =>
                          loading ? (
                            <Button disabled>Loading PDF...</Button>
                          ) : (
                            <button>
                              <PrintIcon />
                            </button>
                          )
                        }
                      </PDFDownloadLink>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LabsTaxInvoice;
