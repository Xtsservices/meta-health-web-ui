import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import noalerts_banner from "../../../assets/radiology/noalerts_banner.png"
import styles from "./OuterTable.module.scss";
import InnerTable from "./InnerTables";
import {
  AlertTestList,
  DischargeOrder,
  LabTestOrder,
  MedicineList,
  OpdIpdData,
  PharmacyOrder,
 
} from "../../../utility/medicine";
import { formatDate2 } from "../../../utility/global";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useLocation } from "react-router-dom";
import arrowdownImage from "../../../assets/pharmacy/buttons/arrowdownImage.png"
import arrowupImage from "../../../assets/pharmacy/buttons/arrowup.png"

interface PatientTableProps {
  title: string;
  // data: PharmacyOrder[];
  data: (OpdIpdData | DischargeOrder | PharmacyOrder | LabTestOrder)[];
  isButton: boolean;
  alertFrom?: string;
  reception?: string;
  patientOrder?: string;
  sale?: string;
  isRejectReason?: string;
  patientOrderPay?: string;
  patientOrderOpd?: string;
}

const PatientOuterTable: React.FC<PatientTableProps> = ({
  title,
  data,
  isButton,
  alertFrom,
  reception,
  patientOrder,
  sale,
  isRejectReason,
  patientOrderPay,
  patientOrderOpd,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [actionValues, setActionValues] = useState<{ [key: number]: string }>(
    {}
  );
  const user = useSelector(selectCurrentUser);
  const [departments, setDepartments] = React.useState<{
    [key: number]: string;
  }>({});

  const isOpdIpdData = (
    row: OpdIpdData | DischargeOrder | PharmacyOrder | LabTestOrder
  ): row is OpdIpdData => {
    return (row as OpdIpdData).category !== undefined;
  };
  const hasMedicinesList = (
    row: any
    
  ): row is {
    
    medicinesList: MedicineList[];
    patientTimeLineID: number;
    departmemtType: number;
    location: string;
    paidAmount: string;
  } => {
    console.log(row, "row_data")
    return (
      "medicinesList" in row &&
      "patientTimeLineID" in row &&
      "departmemtType" in row &&
      "location" in row &&
      "paidAmount" in row
    );
  };

  const isPharmacySaleOrder = (
    row: OpdIpdData | DischargeOrder | PharmacyOrder | LabTestOrder
  ): row is PharmacyOrder => {
    return (
      (row as PharmacyOrder).pIdNew !== undefined &&
      (row as PharmacyOrder).phoneNumber !== undefined
    );
  };


  // Divyansh - For Lab Orders there is a field from Api which is datetime in testsList which differentiate Laborders
  const isLabOrder = (
    row: OpdIpdData | DischargeOrder | PharmacyOrder | LabTestOrder
  ): row is LabTestOrder => {
    console.log(row, "labprder")
    return (
      (row as LabTestOrder).doctor_firstName !== undefined &&
      (row as LabTestOrder).doctor_lastName !== undefined &&
      Array.isArray((row as LabTestOrder).testsList) &&
      (row as LabTestOrder).testsList.length > 0 &&
      (row as LabTestOrder).testsList[0].id !== undefined &&
      (row as LabTestOrder).testsList[0].test !== undefined &&
      (row as LabTestOrder).testsList[0].testPrice !== undefined &&
      (row as LabTestOrder).rejectedReason === null
    );
  };

  const isLabAlert = (
    row: OpdIpdData | DischargeOrder | PharmacyOrder | LabTestOrder
  ): row is LabTestOrder => {
    return (
      (row as LabTestOrder).doctor_firstName !== undefined &&
      (row as LabTestOrder).doctor_lastName !== undefined &&
      Array.isArray((row as LabTestOrder).testsList) &&
      (row as LabTestOrder).testsList.length > 0 &&
      (row as LabTestOrder).testsList[0].testPrice === undefined
    );
  };


  const isLabRejectedAlert = (
    row: OpdIpdData | DischargeOrder | PharmacyOrder | LabTestOrder
  ): row is LabTestOrder => {
    return (
      (row as LabTestOrder).doctor_firstName !== undefined &&
      (row as LabTestOrder).doctor_lastName !== undefined &&
      Array.isArray((row as LabTestOrder).testsList) &&
      (row as LabTestOrder).testsList.length > 0 &&
      (row as LabTestOrder).testsList[0].alertStatus == "rejected" &&
      (row as LabTestOrder).rejectedReason !== undefined
);
};

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleActionChange = (id: number, value: string) => {
    setActionValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  

  useEffect(() => {
    const fetchDepartments = async () => {
      const departmentMap: { [key: number]: string } = {};
      for (const row of data) {
        if (
          "departmentID" in row &&
          row.departmentID &&
          !(row.departmentID in departmentMap)
        ) {
          const departmentName = await getDepartment(row.departmentID);
          departmentMap[row.departmentID] = departmentName;
        }
      }
      setDepartments(departmentMap);
    };

    fetchDepartments();
  }, [data]);

  const getDepartment = async (id: number) => {
    try {
      const departmentData = await authFetch(
        `department/singledpt/${id}`,
        user.token
      );
      return departmentData.department[0]?.name || "Unknown";
    } catch (error) {
      console.error("Error fetching department:", error);
      return "Unknown";
    }
  };
  //checking for pharmacy & Radiology path path
  const location = useLocation();
  const isPharmacy = location.pathname.includes("pharmacy")
  const isRadiology = location.pathname.includes("radiology")
  const isPathology = location.pathname.includes("pathology")
  const isReception = location.pathname.includes("reception")
  const isOrderManagement = location.pathname.includes("orderManagement");
console.log(departments, "departmentData")

  return (
    <div style= {{marginTop:"1rem"}}>
      <div className={styles.header}>{title}</div>
      <TableContainer component={Paper} className={styles.tableContainer} sx={{ maxHeight: isOrderManagement ? 780 : 300 }}>
        <Table stickyHeader>
          <TableHead>

            
            <TableRow sx = {{ top:0, background:"#ffffff", zIndex:5}}>    
              {/* {alertFrom && <TableCell style={{ fontWeight: "bold" }}>Sr No.</TableCell>} */}

              { title=="Alerts From OPD" && alertFrom || isRadiology || isPathology ?  (<TableCell style={{ fontWeight: "bold", color:"#252525", fontSize:"16px",width:"210px" }} >S.NO</TableCell>)
            :(<TableCell style={{ fontWeight: "bold", color:"#252525", fontSize:"16px" }}>Patient ID</TableCell>)  
            
            }
              <TableCell style={{ fontWeight: "bold", color:"#252525",fontSize:"16px", width:"250px" }}>Patient name</TableCell>

              {sale && (
                <TableCell style={{ fontWeight: "bold"}}>Mobile No</TableCell>
              )}
              {!sale && (
                <TableCell style={{ fontWeight: "bold",color:"#252525",fontSize:"16px" }} >Department</TableCell>
              )}
              {/* <TableCell style={{ fontWeight: "bold" }}>Nurse ID</TableCell> */}
              {!sale && (
                <TableCell style={{ fontWeight: "bold",color:"#252525",fontSize:"16px" }}>
                  {isReception ? "Doctor Name" : "Doctor" }
                </TableCell>
              )}
              {data.length > 0 && reception && (
                <TableCell style={{ fontWeight: "bold",color:"#252525",fontSize:"16px" }}>Category</TableCell>
              )}
              <TableCell style={{ fontWeight: "bold",color:"#252525",fontSize:"16px" }}>
                {patientOrder && patientOrderPay && isPharmacy  ? "Admission Date" : (patientOrderOpd && isPharmacy)  || (isRejectReason &&  isPharmacy) || sale && isPharmacy ? "Visit Date" : "Date" }
               </TableCell>
              <TableCell></TableCell>
              <TableCell style={{ fontWeight: "bold" ,fontSize:"16px"}} >Action</TableCell>
               

              
            </TableRow>
          </TableHead>
          <TableBody >
            {data.length == 0 && (
              <TableRow>
              <TableCell colSpan={8} style={{ height: "200px", textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <img
                    src={noalerts_banner}
                    alt="No alerts banner"
                    style={{ width: "180px" }}
                  />
                  <p style ={{marginTop:"-15px", color:"#9B9B9B", fontStyle:"italic", fontWeight:"500"}}>You're all caught up! No new alerts at the moment</p>
                </div>
              </TableCell>
            </TableRow>
            )}
            {data.length > 0 &&
            
              data.map((row,index) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    onClick={() => handleRowClick(row.id)}
                    style={{ backgroundColor: "#D8E8FA" }}
                  >
                   {/* {alertFrom &&  <TableCell>{index + 1}</TableCell>} */}
                   
                   {title =="Alerts From OPD" && alertFrom || isRadiology || isPathology  ? ( <TableCell  style = {{fontSize:"16px"}}>{index + 1}</TableCell>) : (
                      <TableCell style = {{fontSize:"16px"}}>

                      {row.patientID ||
                        (isPharmacySaleOrder(row) ? row.pIdNew : null)}
                    </TableCell>)}    
                    <TableCell style = {{fontSize:"16px"}}>{row.pName}</TableCell>
                    {sale && isPharmacySaleOrder(row) && (
                      <TableCell>{row.phoneNumber}</TableCell>
                    )}

                    {"dept" in row && <TableCell style = {{fontSize:"16px"}}>{row.dept}</TableCell>}
                    {"location" in row && <TableCell style = {{fontSize:"16px"}}>{row.location}</TableCell>}
                    {/* <TableCell key={row.id}>
                      {"departmentID" in row && departments[row.departmentID]
                        ? departments[row.departmentID]
                        : ""}
                    </TableCell> */}

       
                    {"departmentID" in row && <TableCell key={row.id} style ={{fontSize:"16px"}}>
                      {departments[row.departmentID]
                        ? departments[row.departmentID]
                        : ""} 
                    </TableCell>}

                    {!sale && (
                      <TableCell style = {{fontSize:"16px"}}>
                        {"firstName" in row && "lastName" in row
                          ? `${row.firstName} ${row.lastName}`
                          : "doctor_firstName" in row &&
                            "doctor_lastName" in row
                          ? `${row.doctor_firstName} ${row.doctor_lastName}`
                          : ""}
                      </TableCell>
                    )}

                    {(isOpdIpdData(row) || reception) && (
                      <TableCell style = {{fontSize:"16px"}}>
                        {"category" in row
                          ? row.category
                          : hasMedicinesList(row)
                          ? "Medication"
                          : null}
                      </TableCell>
                    )}

                    <TableCell style = {{fontSize:"16px"}}>{formatDate2(row.addedOn)}</TableCell>

                    {!isOpdIpdData(row) &&
                      !alertFrom &&
                      !reception &&
                      !patientOrder && (
                        <>
                        <TableCell></TableCell>
                        <TableCell>
                          <Select
                            value={actionValues[row.id] || "Pending"}
                            onChange={(event) =>
                              handleActionChange(row.id, event.target.value)
                            }
                            
                            displayEmpty
                            disabled={actionValues[row.id] === "Accepted"}
                            style={{
                              minWidth: 120,
                              height:"30px",
                              borderRadius:"18px",
                              backgroundColor:
                                actionValues[row.id] === "Accepted"
                                  ? "#3E8B22"
                                  : "#FF7E7E",
                              color: "white",
                            }}
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Accepted">Accepted</MenuItem>
                          </Select>
                        </TableCell>
                        </>
                      )}
                      <TableCell></TableCell>
                    {/* {!isOpdIpdData(row) && <TableCell></TableCell>} */}
                    {(isOpdIpdData(row) ||
                      alertFrom ||
                      reception ||
                      patientOrder) && (
                      <TableCell >
                        <IconButton size="small">
                          {expandedRow === row.id ? (
                            <img src= {arrowupImage} style ={{width:"20px"}}  alt = "arrow_up_image"/>
                          ) : (
                            <img src = {arrowdownImage} style ={{width:"20px"}} alt = "arrow_down_image" />
                           
                          )}
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                  {/* TODO: This is for reference */}
                  {/* {  (isOpdIpdData(row)  )&& (
                    <TableRow>
                    <TableCell
                      style={{
                        paddingBottom: "2px",
                        paddingTop: "2px",
                      }}
                      colSpan={7}
                    >
                      <Collapse
                        in={expandedRow === row.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          {row.category && row.category.includes("Lab") ? (
                            // If it's a lab category, render testList
                            <InnerTable
                              data={row.testList || []} 
                              patientTimeLineID={row.patientTimeLineID}
                              isButton={isButton}
                              department={row.category}
                              pType={row.pType}
                            />
                          ) : (
                            // If it's not a lab category, render medicinesList
                            <InnerTable
                              data={row.medicinesList} 
                              patientTimeLineID={row.patientTimeLineID}
                              isButton={isButton}
                              department={row.category}
                              pType={row.pType}
                            />
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  )} */}

                  {hasMedicinesList(row) && reception && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ padding: 0 }}>
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={0}>
                            <InnerTable
                              data={row.medicinesList}
                              patientTimeLineID={row.patientTimeLineID}
                              isButton={isButton}
                              department="Medication" // Fixed department assignment
                              pType={row.departmemtType}
                              reception="reception"
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                  {/* patient order ipd */}
                  {hasMedicinesList(row) && patientOrder && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ padding: 0 }}>
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={0}>
                            <InnerTable
                              data={row.medicinesList}
                              patientTimeLineID={row.patientTimeLineID}
                              isButton={isButton}
                              department="Medication" // Fixed department assignment
                              pType={row.departmemtType}
                              // isRejectReason={isRejectReason}
                              patientOrderPay={patientOrderPay}
                              paidAmount={row.paidAmount}
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                  {/* patient order opd */}
                  {hasMedicinesList(row) && patientOrder && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ padding: 0 }}>
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={0}>
                            <InnerTable
                              data={row.medicinesList}
                              patientTimeLineID={row.patientTimeLineID}
                              isButton={isButton}
                              department="Medication" // Fixed department assignment
                              pType={row.departmemtType}
                              isRejectReason={isRejectReason}
                              paidAmount={row.paidAmount}
                              patientOrderOpd={patientOrderOpd}
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}

                  {isPharmacySaleOrder(row) && patientOrder && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ padding: 0 }}>
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={0}>
                            <InnerTable
                              data={row.medicinesList}
                              patientTimeLineID={row.patientTimeLineID}
                              isButton={isButton}
                              department="Medication" // Fixed department assignment
                              pType={row.departmemtType}
                              sale="sale"
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}

                  {alertFrom && hasMedicinesList(row) && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ padding: 0 }}>
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={0}>
                            <InnerTable
                              data={row.medicinesList}
                              patientTimeLineID={row.patientTimeLineID}
                              isButton={isButton}
                              department={row.location} // Fixed department assignment
                              pType={row.departmemtType}
                              alertFrom="Pharmacy"
                              patientData={row as PharmacyOrder}
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                  { /* lab alerts */}
                {isLabAlert(row) &&  (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ padding: 0 }}>
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={0}>              
                              <InnerTable
                              data={row.testsList as AlertTestList[]} 
                              patientTimeLineID={row.patientID}
                              isButton={isButton}
                              // department={row.category}
                              pType={row.ptype}
                              labAlert="labAlert"
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* lab rejected alerts */}
                  {isLabRejectedAlert(row) &&  (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ padding: 0 }}>
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={0}>              
                              <InnerTable
                              data={row.testsList as AlertTestList[]} 
                              patientTimeLineID={row.patientID}
                              isButton={isButton}
                              // department={row.category}
                              // pType={row.ptype}
                              alertRejectedTab = "alertRejectedTab"
                              rejectedReason = {row.rejectedReason}
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}


                  {/* Lab Billing */}
                  {isLabOrder(row) && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ padding: 0 }}>
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={0}>                         
                              <InnerTable
                              data={row.testsList as AlertTestList[]} 
                              patientTimeLineID={row.patientID}
                              isButton={isButton}
                              pType={row.ptype}
                              labBilling={true}
                              patientOrderPay={patientOrderPay}
                              paidAmount={row.paidAmount}
                              dueAmount={row.dueAmount}
                              patientOrderOpd={patientOrderOpd}
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}



                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PatientOuterTable;
