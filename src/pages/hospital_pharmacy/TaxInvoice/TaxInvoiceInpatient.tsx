import { useSelector } from "react-redux";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useEffect, useState } from "react";
import { authFetch } from "../../../axios/useAuthFetch";
import {getDepartmentName } from "../../../utility/global";
import styles from "../OrderManagement/OuterTable.module.scss";
import React from "react";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import TaxInvoiceDocument from "./TaxInvoiceDocument";
// import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";
import arrowupImage from "../../../assets/pharmacy/buttons/arrowup.png"
import arrowdownImage from "../../../assets/pharmacy/buttons/arrowdownImage.png"
import IpdInnerTable from "../../hospital_reception/TaxInvoice/IpdInnerTable";
import download from "../../../assets/pharmacy/buttons/download.png"
import IpdOpdInnerTable from "./IpdOpdInnerTable";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import TaxInvoiceTemplate from "../../../component/TaxInvoiceTemp/TaxInvoiceTemplate";
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
  updatedOn:string;
}

  interface TaxInvoiceInPatientProps {
    title: string;
    departmentType: number;
    type: string | undefined; 
    startDate: Date| null;
    endDate:Date | null;
  }

interface Test {
  testID: number;
  testName: string;
  testPrice: number;
  gst: number;
}

interface Discount {
  discount: number;
  discountReason: string;
  discountReasonID: string;
}

interface Patient {
  patientID: number;
  pName: string;
  firstName: string;
  lastName:string;
  addedOn: string;
  updatedOn: string;
  lastUpdatedOn:string;
  departmemtType: number;
  hospitalID: number;
  category: string;
  discount: Discount[] | null;
  testsList: Test[];
}

const TaxInvoiceInPatient = ({
  departmentType,
  type,
  startDate,
  endDate
}: TaxInvoiceInPatientProps) => {
  const location = useLocation();
  const path = location.pathname;
  const department = path.includes("radiology")
    ? "Radiology"
    : path.includes("pathology")
    ? "Pathology"
    : "";
  
  const user = useSelector(selectCurrentUser);
  // const currentPatient = useSelector(selectCurrPatient);
  const [patientOrderCompleted, setPatientOrderCompleted] = useState<
    PatientOrderCompletedProps[]
  >([]);
  const [labsPatientsData, setLabsPatientsData] = useState<Patient[]>([]);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<any>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [printTaxInvoice, setPrintTaxInvoice] = useState<number | null>(null);
  const [isLoadingPatientDetails, setIsLoadingPatientDetails] = useState(false);

  const handleRowClick = async (id: number, patientId: number | null) => {
    try {
      setIsLoadingPatientDetails(true);
      const patientDetailsResponse = await authFetch(
        `/patient/${user.hospitalID}/patients/single/${patientId}`,
        user.token
      );
      if (patientDetailsResponse.message === "success") {
        setSelectedPatientDetails(patientDetailsResponse.patient);
      }
      setExpandedRow(expandedRow === id ? null : id);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    } finally {
      setIsLoadingPatientDetails(false);
    }
  };

  useEffect(() => {
    const getMedicineInventoryPatientsOrderWithType = async () => {
      const formattedStartDate = startDate? startDate.toISOString() : "";
      const formattedEndDate = endDate ? endDate.toISOString(): "";

      const pharmacyPath = `/medicineInventoryPatientsOrder/${user.hospitalID}/${departmentType}/getMedicineInventoryPatientsOrderCompletedWithRegPatient?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const labsApiPath = `test/getOpdIpdTaxInvoiceData/${user.hospitalID}/${department}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;



      const apiPath = type === "medicine" ? pharmacyPath : labsApiPath;
      const response = await authFetch(apiPath, user.token);
      if (response.status === 200) {
        console.log(response.data, "data response")
        if (type === "medicine") {

          setPatientOrderCompleted(response.data);
        } else {
          const filteredData = response.data.filter((each:any)=> each.departmemtType === departmentType)
        
          setLabsPatientsData(filteredData);
        }
      }
    };

    if (user.hospitalID && user.token) {
      getMedicineInventoryPatientsOrderWithType();
    }
  }, [user.hospitalID, user.token, departmentType,startDate, endDate]);

  const handlePrintTaxInvoice = (id: number) => {
    setPrintTaxInvoice(id); 
    setTimeout(() => {
      setPrintTaxInvoice(null); 
    }, 100);
  };

  const handleDownloadPdf = (pdfBlob: Blob) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "Tax_Invoice.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPharmacyIPDOPDUI = () => {
    return (
      <TableBody sx={{ padding: "1rem" }}>
        {patientOrderCompleted.length === 0 && (
          <div style={{ textAlign: "center", textTransform: "uppercase" }}>
            <h4>No New Tax Invoice !!</h4>
          </div>
        )}
        {patientOrderCompleted.length > 0 &&
          patientOrderCompleted.map((order) => (
            <React.Fragment key={order.id}>
              <TableRow
                onClick={() => handleRowClick(order.id,order.patientID)}
                sx={{ backgroundColor: "#b2caea" }}
              >

                
                 <TableCell style={{ fontSize: "15px" }}>  {/*change this date to when they paid the bill */}
                 {dayjs(order.updatedOn).format("MMM DD, YYYY")}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {order.patientTimeLineID}
                </TableCell>
                <TableCell style={{ fontSize:"15px"}}>
                  {order.pName}
                </TableCell>

                <TableCell style={{fontSize:"15px" }}>
                  {getDepartmentName(order.departmemtType)}
                </TableCell>
                <TableCell style={{fontSize:"15px" }}>
                  {order.firstName + " " + order.lastName}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                {dayjs(order.addedOn).format("MMM DD, YYYY")}
                </TableCell>
                <TableCell style={{fontSize:"15px" }}>
                      
                        <button
                    style={{
                      display: "flex",
                      alignContent: "center",
                      cursor: "pointer",
                      background: "transparent",
                      border: "none",
                      justifyContent: "center",
                      marginLeft: "30px",
                    }}
                    onClick={() => handlePrintTaxInvoice(order.id)} 
                  >
                    <img src={download} alt="download button" />
                  </button>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                  {expandedRow === order.id ? (
                            <img src= {arrowupImage} style ={{width:"20px"}}  alt = "arrow_up_image"/>
                          ) : (
                            <img src = {arrowdownImage} style ={{width:"20px"}} alt = "arrow_down_image" />
                           
                          )}
                  </IconButton>
                </TableCell>
                <TableCell />
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    paddingBottom: "1px",
                    paddingTop: "0px",
                  }}
                  colSpan={8}
                >
                  <Collapse 
                    in={expandedRow === order.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box margin={1}>
                      <IpdInnerTable
                        pharmacyTaxInvoice="pharmacyTaxInvoice"
                        data={order}
                        type={type}
                      />
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
              {printTaxInvoice === order.id && !isLoadingPatientDetails && selectedPatientDetails && (
                <TaxInvoiceTemplate
                  currentPatient={selectedPatientDetails}
                  medicineList={order.medicinesList}
                  order={order}
                  onPdfGenerated={handleDownloadPdf}
                />
              )}
            </React.Fragment>
          ))}
      </TableBody>
    );
  };

  const renderLabsIPDOPDUI = () => {
    console.log("labsPatientsData",labsPatientsData)
    return (
      <TableBody>
        {labsPatientsData.length === 0 && (
          <div style={{ textAlign: "center", textTransform: "uppercase" }}>
            <h4>No New Tax Invoice !!</h4>
          </div>
        )}

        {labsPatientsData.length > 0 &&
          labsPatientsData.map((order,index) => (
            <React.Fragment key={index}>
              <TableRow 
                onClick={() => handleRowClick(index+1,order?.patientID)}
                sx={{ backgroundColor: "#b2caea",position:"sticky" }}
              >

                <TableCell style={{ fontSize:"15px" }}>
                 {dayjs(order.lastUpdatedOn).format("MMM DD, YYYY")}

                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {order.patientID}
                </TableCell>
                <TableCell style={{ fontSize:"15px"}}>
                  {order.pName}
                </TableCell>

                <TableCell style={{ fontSize:"15px"}}>
                  {getDepartmentName(order.departmemtType)}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {order.firstName + " " + order.lastName}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                {dayjs(order.addedOn).format("MMM DD, YYYY")}
                </TableCell>
                <TableCell style={{ fontSize: "15px" }}>
                  <button
                    style={{
                      background: "transparent",
                      border: "none",
                      marginLeft: "30px",
                      cursor: "pointer",
                    }}
                    onClick={() => handlePrintTaxInvoice(index + 1)} 
                  >
                    <img src={download} alt="download button" />
                  </button>
                </TableCell>

                <TableCell>
                  <IconButton size="small">
                  {expandedRow === index+1 ? (
                            <img src= {arrowupImage} style ={{width:"20px"}}  alt = "arrow_up_image"/>
                          ) : (
                            <img src = {arrowdownImage} style ={{width:"20px"}} alt = "arrow_down_image" />
                           
                    )}
                  </IconButton>
                </TableCell>
                <TableCell />
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    paddingBottom: "0px",
                    paddingTop: "0px",
                  }}
                  colSpan={8}
                >
                  <Collapse
                    in={expandedRow === index+1}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box margin={1}>
                      <IpdOpdInnerTable
                        taxInvoice="LabTaxInvoice"
                        data={order}
                        type={type}
                      />
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
              {/* Pass the specific patient data from labsPatientsData */}
              {printTaxInvoice === index + 1 && !isLoadingPatientDetails && selectedPatientDetails && (
                <TaxInvoiceTemplate
                currentPatient={selectedPatientDetails}
                  medicineList={order.testsList}
                  order={order}
                  onPdfGenerated={handleDownloadPdf}
                />
              )}
            </React.Fragment>
          ))}
      </TableBody>
    );
  };

 

  return (
    <div>
      <TableContainer component={Paper} className={styles.tableContainerTax} sx={{maxHeight:680,scrollbarWidth:"thin"}}>
        {/* <div className={styles.header}>{title}</div> */}
        <Table >
          <TableHead className={styles.header} sx={{position:"sticky",top:0,zIndex:1}}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color:"#ffffff", fontSize:"16px" }}>Date</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff",fontSize:"16px" }}>Patient ID</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff",fontSize:"16px" }}>Patient Name</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff",fontSize:"16px" }}>Department</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff",fontSize:"16px" }}>Doctor Name</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff",fontSize:"16px" }}> Admission Date</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff",fontSize:"16px" }}>
                Invoice Download
              </TableCell>

            <TableCell style={{ fontWeight: "bold",color:"#ffffff" }}>Action</TableCell>

              <TableCell />
            </TableRow>
          </TableHead>
          {type === "medicine" ? renderPharmacyIPDOPDUI() : renderLabsIPDOPDUI()}
        </Table>
      </TableContainer>
    </div>
  );
};

export default TaxInvoiceInPatient;
