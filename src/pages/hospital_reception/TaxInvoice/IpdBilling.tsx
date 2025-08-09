import React, { useState } from "react";
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
import styles from "../../hospital_pharmacy/OrderManagement/OuterTable.module.scss";
import arrowdownImage from "../../../assets/pharmacy/buttons/arrowdownImage.png"
import arrowup from "../../../assets/pharmacy/buttons/arrowup.png"
import IpdInnerTable from "./IpdInnerTable";
import { PatientData } from "../../../types";

const data: PatientData[] = [
  {
    id: 1,
    patientID: "P12345",
    pName: "John Doe",
    dept: "IPD",
    firstName: "Dr. Smith",
    lastName: "",
    date: "2024-12-24",
    admissionDate: "2024-12-22",
    category: "Lab",
    testList: [
      {
        testID: 11,
        testName: "CT Scan",
        charge: 2000,
        qty: 1,
        price: 2000,
        gst: 18, // GST in percentage
        amount: 2360, // Price + GST
      },
      {
        testID: 12,
        testName: "Brain Scan",
        charge: 1500,
        qty: 1,
        price: 1500,
        gst: 18,
        amount: 1770,
      },
    ],
    medicinesList: [
      {
        id: 5,
        name: "Aspirin",
        category: "Tablet",
        qty: 10,
        hsn: "30049011",
        price: 50,
        gst: 18,
        amount: 590, // Price * qty + GST
      },
    ],
    procedures: [
      {
        code: 6,
        particulars: "Ventilator use fee",
        rate: 1000,
        units: 1,
        price: 1000,
        gst: 18,
        amount: 1180,
      },
      {
        code: 7,
        particulars: "Doctor visit fee",
        rate: 500,
        units: 1,
        price: 500,
        gst: 18,
        amount: 590,
      },
    ],
    patientTimeLineID: "T123",
    pType: "Inpatient",
  },
  {
    id: 2,
    patientID: "P67890",
    pName: "Jane Roe",
    dept: "IPD",
    firstName: "Dr. Taylor",
    lastName: "Johnson",
    date: "2024-12-23",
    admissionDate: "2024-12-20",
    category: "Medicine",
    testList: [], // No tests for this patient
    medicinesList: [
      {
        id: 2,
        name: "Paracetamol",
        category: "Tablet",
        qty: 20,
        hsn: "30049010",
        price: 10,
        gst: 12,
        amount: 224, // Price * qty + GST
      },
    ],
    procedures: [
      {
        code: 3,
        particulars: "Procedure fee",
        rate: 1500,
        units: 1,
        price: 1500,
        gst: 18,
        amount: 1770,
      },
    ],
    patientTimeLineID: "T456",
    pType: "Inpatient",
  },
];

const IpdBilling = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <TableContainer component={Paper} className={styles.tableContainer} style = {{boxShadow:"none",}}>
        <Table>
          <TableHead style={{ backgroundColor: "#1977F3", borderRadius:"16px" }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "white", borderTopLeftRadius:"16px" , fontSize:"16px"}}>
                DATE
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "white", fontSize:"16px" }}>
                Patient ID
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "white", fontSize:"16px" }}>
                Patient name
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "white", fontSize:"16px" }}>
                Department
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "white", fontSize:"16px" }}>
                Doctor name
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "white", fontSize:"16px" }}>
                Admission date
              </TableCell>

               <TableCell style = {{borderTopRightRadius:"16px", fontWeight:"bold", color:"white", fontSize:"16px"}} >Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length == 0 && (
              <div style={{ textAlign: "center", textTransform: "uppercase" }}>
                <h4>No New Alerts !!</h4>
              </div>
            )}
            {data.length > 0 &&
              data.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    onClick={() => handleRowClick(row.id)}
                    style={{ backgroundColor:"#B2CAEA", borderBottom:"0.8px solid #BCBCBC" }}
                  >
                    <TableCell>{formatDate(row.date)}</TableCell>

                    <TableCell>{row.patientID}</TableCell>
                    <TableCell>{row.pName}</TableCell>
                    <TableCell>{row.dept}</TableCell>

                    <TableCell>{row.firstName + " " + row.lastName}</TableCell>

                    <TableCell>{formatDate(row.admissionDate)}</TableCell>

                    <TableCell>
                      <IconButton size="small">
                        {expandedRow === row.id ? (
                          <img  src= {arrowup} alt = "arrow_up_image" style = {{width:"20px"}}  />
                        ) : (
                          <img  src= {arrowdownImage} alt = "arrow_down_image" style = {{width:"20px"}}  />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      style={{
                        paddingBottom: "0px",
                        paddingTop: "0px",
                      }}
                      colSpan={7}
                    >
                      <Collapse
                        in={expandedRow === row.id}
                        timeout="auto"
                        unmountOnExit 
                        
                      >
                        <Box margin={1}>
                          <IpdInnerTable data={row} type="medicine"/>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default IpdBilling;
