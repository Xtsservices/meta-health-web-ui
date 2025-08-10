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
  Typography,
} from "@mui/material";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useEffect, useState } from "react";
import { authFetch } from "../../../axios/useAuthFetch";
import React from "react";
import styles from "../OrderManagement/OuterTable.module.scss";
import { formatDate2 } from "../../../utility/global";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import TaxInvoiceDocument from "./TaxInvoiceDocument";
import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";
import arrowupImage from "../../../assets/pharmacy/buttons/arrowup.png"
import arrowdownImage from "../../../assets/pharmacy/buttons/arrowdownImage.png"
import IpdInnerTable from "../../hospital_reception/TaxInvoice/IpdInnerTable";
import download from "../../../assets/pharmacy/buttons/download.png"
import { PharmacySaleTaxInvoice, LabsWalkinPatientTest } from "../../../types";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import TaxInvoiceTemplate from "../../../component/TaxInvoiceTemp/TaxInvoiceTemplate";

interface Test {
  gst: number;
  name: string;
  testPrice: number;
  loinc_num_: string;
}

interface TaxInvoiceInPatientProps {
  title: string;
  type: string | undefined;
  startDate:Date | null;
  endDate:Date | null;
}

const TaxInvoiceWalkIn = ({ type , startDate, endDate}: TaxInvoiceInPatientProps) => {
  const location = useLocation();
  const path = location.pathname;
  const department = path.includes("radiology")
    ? "Radiology"
    : path.includes("pathology")
    ? "Pathology"
    : "";
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const [walkinPatientsData, setWalkinPatientsData] = useState<
    PharmacySaleTaxInvoice[]
  >([]);
  const [LabswalkinPatientsData, setLabsWalkinPatientsData] = useState<
    LabsWalkinPatientTest[]
  >([]);
  const [, setSelectedPatientDetails] = useState<any>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [, setDoctorNames] = useState<Record<number, string>>({});
  const [printTaxInvoiceId, setPrintTaxInvoiceId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDoctorNames = async () => {
      const names: Record<number, string> = {};
      await Promise.all(
        walkinPatientsData.map(async (order) => {
          if (order.medGivenBy !== undefined) {
            const name = await doctorData(order.medGivenBy);
            if (name) names[order.medGivenBy] = name;
          }
        })
      );
      setDoctorNames(names);
    };

    if (walkinPatientsData.length > 0) {
      fetchDoctorNames();
    }
  }, [walkinPatientsData]);

  const handlePrintTaxInvoice = (id: number) => {
    setPrintTaxInvoiceId(id); 
  };

  const handlePdfGenerated = (pdfBlob: Blob) => {
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `TaxInvoice_${printTaxInvoiceId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setPrintTaxInvoiceId(null); 
  };

  const handleRowClick = (id: number, rowData: PharmacySaleTaxInvoice | LabsWalkinPatientTest) => {
    setExpandedRow(expandedRow === id ? null : id);
    setSelectedPatientDetails(rowData);
  };

  useEffect(() => {
    const getWalkinTaxinvoiceData = async () => {
      const formattedStartDate = startDate? startDate.toISOString() : "";
      const formattedEndDate = endDate ? endDate.toISOString(): "";
      const pharmacyapiPath = `/medicineInventoryPatientsOrder/${user.hospitalID}/getMedicineInventoryPatientsOrderCompletedWithoutReg?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const labsApiPath = `test/getWalkinTaxinvoiceData/${user.hospitalID}/${department}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const path = type === "medicine" ? pharmacyapiPath : labsApiPath;
      const response = await authFetch(path, user.token);
      if (response.status === 200) {
        if (type === "medicine") {
          setWalkinPatientsData(response.data);
        } else {
          setLabsWalkinPatientsData(response.data);
        }
      }
    };

    if (user.hospitalID && user.token) {
      getWalkinTaxinvoiceData();
    }
  }, [user.hospitalID, user.token,startDate, endDate]);

  const doctorData = async (userID: number) => {
    try {
      const response = await authFetch(`user/${userID}`, user.token);
      if (response.message === "success" && response.user) {
        const doctorName = `${response.user.firstName} ${response.user.lastName}`;
        return doctorName;
      }
    } catch (error) {
      console.error("Error fetching doctor name:", error);
    }
  };

  const renderMedicineBody = () => {
    return (
      <TableBody sx={{ padding: "1rem" }}>
        {walkinPatientsData.length === 0 && (
          <div style={{ textAlign: "center", textTransform: "uppercase" }}>
            <h4>No New Tax Invoice !!</h4>
          </div>
        )}
        {walkinPatientsData.length > 0 &&
          walkinPatientsData.map((order) => (
            <React.Fragment key={order.id}>
              <TableRow
                onClick={() => handleRowClick(order.id, order)}
                sx={{ backgroundColor: "#b2caea" }}
              >

                 <TableCell style = {{fontSize:"15px"}}> 
                 {dayjs(order.updatedOn).format("MMM DD, YYYY")}</TableCell>
                
                <TableCell style={{ fontSize:"15px" }}>
                  {order.pIdNew}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {order.pName}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {order.phoneNumber}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {formatDate2(order.addedOn)}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>

                  {order.prescriptionURL ? (
                    <a
                      href={order.prescriptionURL}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                      rel="noreferrer"
                    >
                      <div>
                      <button className="" style ={{width:"46px", height:"25px", border:"none",borderRadius:"4px",padding:"5px"}}>View </button>
                      </div>
                    </a>
                  ) : (
                    "No Prescription"
                  )}
                </TableCell>

                <TableCell style={{ fontSize: "15px" }}>
                  
                  {/* <button
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
                                    </button> */}
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
                      <IpdInnerTable data={order} type={type}    pharmacyTaxInvoice="pharmacyTaxInvoice" />
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
      </TableBody>
    );
  };

  function formatDate(dateString: string) {
    return dayjs(dateString).format("MMM DD, YYYY");
  }

  const renderTestBody = () => {
    return (
      <TableBody sx={{ padding: "1rem" }}>
        {LabswalkinPatientsData.length === 0 && (
          <div style={{ textAlign: "center", textTransform: "uppercase" }}>
            <h4>No New Tax Invoice !!</h4>
          </div>
        )}
        {LabswalkinPatientsData.length > 0 &&
          LabswalkinPatientsData.map((order) => (
            <React.Fragment key={order.id}>
              <TableRow
                onClick={() => handleRowClick(order.id, order)}
                sx={{ backgroundColor: "#b2caea" }}
              >

                <TableCell style={{ fontSize: "15px" }}>{formatDate(order.updatedOn)}</TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {order.pID}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {order.pName}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {order.phoneNumber}
                </TableCell>
                <TableCell style={{ fontSize:"15px" }}>
                  {formatDate2(order.addedOn)}
                </TableCell>
                <TableCell style={{fontSize:"15px" }}>

                  {order.prescriptionURL ? (
                    <a
                      href={order.prescriptionURL}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                      rel="noreferrer"
                    >
                      <div>
                      <button className="" style ={{width:"46px", height:"25px", border:"none",borderRadius:"4px",padding:"5px"}}>View </button>
                      </div>
                    </a>
                  ) : (
                    "No Prescription"
                  )}
                </TableCell>

                <TableCell style={{ fontSize: "15px" }}>
                
                {/* <button
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
                                  </button> */}
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
                    paddingBottom: "0px",
                    paddingTop: "0px",
                  }}
                  colSpan={8}
                >
                  <Collapse
                    in={expandedRow === order.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <>
                      <Box
                        sx={{
                          marginTop: 2,
                          border: "1px solid #ddd",
                          borderRadius: 1,
                          overflow: "hidden",
                          margin: "0 auto",
                          width: "100%",
                        }}
                      >
                       
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <b>SL.No</b>
                                </TableCell>
                                <TableCell>
                                  <b>Test ID</b>
                                </TableCell>
                                <TableCell>
                                  <b>Test Name</b>
                                </TableCell>
                                <TableCell>
                                  <b>Charges</b>
                                </TableCell>
                                <TableCell>
                                  <b>GST</b>
                                </TableCell>
                                <TableCell>
                                  <b>Amount</b>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order?.testsList?.map(
                                (item: Test, index: number) => {
                                  const gstAmount =
                                    (item.testPrice * item.gst) / 100;
                                  const totalAmount =
                                    item.testPrice + gstAmount;

                                  return (
                                    <TableRow key={index}>
                                      <TableCell>{index + 1}</TableCell>
                                      <TableCell>{item.loinc_num_}</TableCell>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>
                                        {item.testPrice.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        {gstAmount.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        {totalAmount.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                  
                     
                      {/* ========= Final Amount After Discount =========  */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          margin: "15px",
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "90%",
                          gap: 1,
                        }}
                      >
                        Total Amount:{" "}
                        <strong>
                          {(() => {
                            // Calculate total before discount
                            const subtotal =
                              order?.testsList?.reduce(
                                (acc, item) =>
                                  acc +
                                  item.testPrice +
                                  (item.testPrice * item.gst) / 100,
                                0
                              ) ?? 0;

                            // Get discount percentage (if exists)
                            const discountPercentage =
                              order?.discount?.discount ?? 0;

                            // Calculate final amount after discount
                            const finalTotal =
                              subtotal - (subtotal * discountPercentage) / 100;

                            return finalTotal.toFixed(2);
                          })()}
                        </strong>
                      </Typography>
                    </>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
      </TableBody>
    );
  };

  return (
    <div>
      <TableContainer component={Paper} className={styles.tableContainerTax} sx={{maxHeight:730,scrollbarWidth:"thin"}}>
        {/* <div className={styles.header}>{title}</div> */}
        <Table>
          <TableHead className={styles.header} sx={{position:"sticky",top:0,zIndex:1}}>
            <TableRow sx={{ color: "black" }}>
            <TableCell style={{ fontWeight: "bold",color:"#ffffff", fontSize:"16px" }}>Date</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff", fontSize:"16px" }}>Patient ID</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff", fontSize:"16px" }}>Patient name</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff", fontSize:"16px" }}>Mobile No.</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff", fontSize:"16px" }}>Admission Date</TableCell>
              <TableCell style={{ fontWeight: "bold",color:"#ffffff", fontSize:"16px" }}>Prescription</TableCell>
              {/* <TableCell style={{ fontWeight: "bold",color:"#ffffff", fontSize:"16px" }}>
                Invoice download
              </TableCell> */}

              <TableCell style ={{fontWeight: "bold",color:"#ffffff", fontSize:"16px" }}>Action</TableCell>

              <TableCell />
            </TableRow>
          </TableHead>
          {type === "medicine" ? renderMedicineBody() : renderTestBody()}
        </Table>
      </TableContainer>
      {/* Render TaxInvoiceTemplate when printTaxInvoiceId is set */}
      {printTaxInvoiceId && (
        <TaxInvoiceTemplate
        currentPatient={{
          ...currentPatient,
          pID: type === "medicine"
            ? walkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.pIdNew.toString() || "N/A"
            : LabswalkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.pID || "N/A",
          pName: type === "medicine"
            ? walkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.pName || "N/A"
            : LabswalkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.pName || "N/A",

          phoneNumber: type === "medicine"
            ? walkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.phoneNumber || "N/A"
            : LabswalkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.phoneNumber || "N/A",
          city: type === "medicine"
            ? walkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.city || "N/A"
            : LabswalkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.city || "N/A",
          addedOn: type === "medicine"
            ? walkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.addedOn || "N/A"
            : LabswalkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.addedOn || "N/A",
        }}
          medicineList={type === "medicine"
            ? walkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.medicinesList || []
            : LabswalkinPatientsData.find((order) => order.id === printTaxInvoiceId)?.testsList || []
          }
          order={type === "medicine"
            ? walkinPatientsData.find((order) => order.id === printTaxInvoiceId)
            : LabswalkinPatientsData.find((order) => order.id === printTaxInvoiceId)
          }
          onPdfGenerated={handlePdfGenerated}
        />
      )}
    </div>
  );
};

export default TaxInvoiceWalkIn;
