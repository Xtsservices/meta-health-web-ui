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
  Box
} from "@mui/material";
import arrowdownImage from "../../../assets/pharmacy/buttons/arrowdownImage.png"
import arrowupImage from "../../../assets/pharmacy/buttons/arrowup.png"
import styles from "../../hospital_pharmacy/OrderManagement/OuterTable.module.scss";
import { formatDate2 } from "../../../utility/global";
import InsuranceInnerTable from "./InsuranceInnerTable";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

interface insuranceData {
  id: number;
  patientID: string;
  pName: string;
  department: string;
  insuranceType:string;
  insuranceProvider: string;
  addedOn: string;
  action: string;
}

interface PatientTableProps {
  insuranceData: insuranceData[];
  showInnerTable?: boolean;
  value?:string;
}

const InsuranceTable: React.FC<PatientTableProps> = ({ insuranceData , showInnerTable, value}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [data, setData] = useState<insuranceData[]>(insuranceData); 

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  useEffect(() => {
    if (showInnerTable) {
      const newClaim: insuranceData = {
        id: Date.now(),
        addedOn: new Date().toISOString(), // Convert Date to string
        patientID: "",
        pName: "",
        department: "",
        insuranceType: "",
        insuranceProvider: "",
        action: "",
      };
  
      setData((prevData) => [newClaim, ...prevData]); // Add new row at the top
      setExpandedRow(newClaim.id); // Expand newly added row
    }
  }, [showInnerTable])

  return (
    <div>
      <TableContainer component={Paper} className={styles.tableContainer} sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow className={styles.header} >
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Date
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Patient ID
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Patient Name
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff", display:"flex", alignItems:"center", borderBottom:"none" }}>
                Department
                <div style = {{display:"flex",flexDirection:"column", justifyContent:"flex-start"}}>
                <ArrowDropUpIcon  style ={{ color:"#ffffff"}}/>  
                <ArrowDropDownIcon  style ={{marginTop:"-15px", color:"#ffffff"}} />
              </div>
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Insurance Type        
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Insurance Provider
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Status
              </TableCell>

              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Action
              </TableCell>

              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length == 0 && (
              <div style={{ textAlign: "center", textTransform: "uppercase" }}>
                <h4>No New Insurance !!</h4>
              </div>
            )}
            {data.length > 0 &&
              data.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    onClick={() => handleRowClick(row.id)}
                    style={{ backgroundColor: "#b2caea" }}
                  >
                    <TableCell>{formatDate2(row.addedOn)}</TableCell>
                    <TableCell>{row.patientID}</TableCell>
                    <TableCell>{row.pName}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.insuranceType}</TableCell>
                    <TableCell>{row.insuranceProvider}</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>{row.action}</TableCell>

                    <TableCell>
                      <IconButton size="small">
                      {expandedRow === row.id ? (
                            <img src= {arrowupImage} style ={{width:"20px"}}  alt = "arrow_up_image"/>
                          ) : (
                            <img src = {arrowdownImage} style ={{width:"20px"}} alt = "arrow_down_image" />
                           
                          )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        paddingBottom: "0px",
                        paddingTop: "0px"
                      }}
                      colSpan={7}
                    >
                      <Collapse
                        in={expandedRow === row.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <InsuranceInnerTable value={value}  showInnerTable={showInnerTable}/>
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

export default InsuranceTable;
