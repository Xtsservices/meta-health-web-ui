import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,Tooltip
} from "@mui/material";
import { Add} from "@mui/icons-material";
import * as XLSX from "xlsx";
import styles from "./TestPricing.module.scss";
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import excelIcon from "../../../assets/Labs/excelicon.png";
// import dayjs from "dayjs";
import { setError, setLoading, setSuccess } from "../../../store/error/error.action";
import TestPricingModal from "./TestPricingModal";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from "react-router-dom";
import DeleteIcon from "../../../assets/icon.png"
import delete_warning from "../../../assets/radiology/delete warning.png"

interface TestData {
  id?: number;
  labTestID?: number;
  hospitalID?: number;
  testName: string;
  lonicCode: string; // Ensure this is correctly defined
  hsn: string;
  gst: number;
  testPrice: number;
  addedOn?: string;
  updatedOn?: string;
  testType?: string;
}

const TestPricing: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useDispatch();
  const [data, setData] = useState<TestData[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editPriceData, setEditPriceData] = useState<TestData | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setOpenDeleteModal] = useState(false)
  // const [itemToDelete, setRowToDelete] = useState<number | null>(null)

  useEffect(() => {
    dispatch(setLoading(true));
    const path = location.pathname;

    const department = path.includes("radiology")
          ? "Radiology"
          : path.includes("pathology")
          ? "Pathology"
          : "";
    const getTestPricing = async () => {
      const response = await authFetch(
        `test/getlabTestPricing/${user.hospitalID}/${department}`,
        user.token
      );
      if (response?.testPricingList?.data?.length > 0) {
        setData(response.testPricingList.data);
        dispatch(setLoading(false));
      }else{
        setData([]);
        dispatch(setLoading(false));
      }

      if (openModal != true) {
        setEditPriceData(null);
      }
    };

    if (user.hospitalID) {
      getTestPricing();
    }
  }, [openModal, user.hospitalID, user.token,deleteId]);

  const formattedData = data.map((item: TestData) => ({
    "Test ID": item.labTestID,
    "Test Name": item.testName,
    "Lonic Code": item.lonicCode,
    "HSN Code": item.hsn,
    "GST (%)": item.gst,
    "Price": item.testPrice,
    "Total Price": item.testPrice + (item.testPrice * item.gst / 100),
    "Updated On": item.updatedOn ? new Date(item.updatedOn).toLocaleString() : "",
  }));
  

// Export to Excel
const handleExport = () => {
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "TestData");
  XLSX.writeFile(wb, "test_data.xlsx");
};

const handleDeleteTest =async ()=>{
  dispatch(setLoading(true));

  const response = await authFetch(
    `test/deleteLabTestPricing/${user.hospitalID}/${deleteId}`,
    user.token
  );

  setDeleteId(null)
  setOpenDeleteModal(false)
  if (response.status == 200) {
    dispatch(setLoading(false));
    dispatch(setSuccess("Deleted Success"));
  } else {
    dispatch(setError(response.message));
  }
}

  return (
    <div className={styles.testPriceContainer}>
      <div className={styles.subHeaderContainer}>
        <h3>Test Pricing</h3>
        <div>
        <Button
          variant="contained"
          onClick={handleExport}
          className={styles.uploadBtn}
          style={{ marginLeft: "10px", boxShadow:"none" }}
        >
          <img
            style={{ height: "1.8rem", width: "1.8rem", marginRight: "3px" }}
            src={excelIcon}
          />
          Export
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add sx={{ color: "white", fontWeight: "bold" }} />}
          onClick={() => setOpenModal(true)}
          className={styles.addButton}
        >
          Add Test Price
        </Button>
        </div>
      </div>
      {data?.length > 0 ? (
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead className={styles.tableHeader}>
              <TableRow>
                <TableCell className={styles.tableHeadCell}>Test ID</TableCell>
                <TableCell className={styles.tableHeadCell}>
                  Test Name
                </TableCell>
                {/* <TableCell className={styles.tableHeadCell}>
                  Lonic Code
                </TableCell> */}
                <TableCell className={styles.tableHeadCell}>HSN Code</TableCell>
                <TableCell className={styles.tableHeadCell}>GST (%)</TableCell>
                <TableCell className={styles.tableHeadCell}>Price</TableCell>
                <TableCell className={styles.tableHeadCell}>
                  Total Price
                </TableCell>
                {/* <TableCell className={styles.tableHeadCell}>
                  Updated On
                </TableCell> */}
                <TableCell className={styles.tableHeadCell} style={{textAlign:'center'}}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((row) => (
                <TableRow key={row.labTestID} className={styles.tableBodyRow}>
                  <TableCell className={styles.tableBodyCell} align="center">
                    {row.labTestID}
                  </TableCell>
                  <TableCell
                    className={styles.tableBodyCell}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}  
                  >  <Tooltip title = {row.testName} arrow><span>{row.testName}</span></Tooltip>
                  
                  </TableCell>
                  {/* <TableCell className={styles.tableBodyCell}>
                    {row.lonicCode}
                  </TableCell> */}
                  <TableCell className={styles.tableBodyCell} align="center">
                    {row.hsn}
                  </TableCell>
                  <TableCell className={styles.tableBodyCell} align="center">
                    {row.gst}
                  </TableCell>
                  <TableCell className={styles.tableBodyCell} align="center">
                     <span style ={{marginLeft:""}}>{row.testPrice}</span>
                  </TableCell>
                 
                  <TableCell className={styles.tableBodyCell} align="center">
                    {row.testPrice + (row.testPrice * row.gst) / 100}
                  </TableCell>
                  {/* <TableCell className={styles.tableBodyCell}>
                    {row.updatedOn ? (
                      <>
                        <div>{dayjs(row.updatedOn).format("YYYY-MM-DD")}</div>
                        <div>{dayjs(row.updatedOn).format("hh:mm A")}</div>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell> */}

                  <TableCell
                    className={styles.tableBodyCell}
                    style={{ cursor: "pointer"}} align="center"
                  >
                    <Button >
                      <EditIcon
                        onClick={() => {
                          setEditPriceData(row);
                          setOpenModal(true);
                        }} 
                        className={styles.button_styling}
                        sx={{ color: "black",marginRight:"1rem" , fontSize:"18px"}}
                      />
                      </Button>
                      <Button>
                    <img src={DeleteIcon} alt="delte icon" onClick={()=> {setOpenDeleteModal(true);setDeleteId(row.labTestID?row.labTestID:null)}} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p className={styles.tablenodata}>Tests Not Found! Please Add Tests</p>
      )}
      

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
        maxWidth={false} // Disable predefined maxWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "50vw", // Set width to 50% of viewport width
            maxWidth: "none", // Ensure it does not get restricted by default maxWidth
          },
        }}
      >
        <TestPricingModal
          open={openModal}
          setOpen={setOpenModal}
          editPriceData={editPriceData}
        />
      </Dialog>

      <Dialog open= {deleteModalOpen}  onClose={()=> setOpenDeleteModal(!deleteModalOpen)} sx={{
          "& .MuiDialog-paper": {
            width: "20vw", // Set width to 50% of viewport width
            maxWidth: "none" , padding:"25px" // Ensure it does not get restricted by default maxWidth
          },
        }}>
        <img src = {delete_warning} alt = "warning" style ={{width:"40px"}} />
        <div style ={{display:"flex", flexDirection:"column",alignItems:"flex-start"}}>
        <h3 style ={{fontWeight:"600"}}>Delete Test</h3>
        <p style ={{color:"#667085", fontWeight:"200"}}>Are you sure you want to delete this data? This action cannot be undone</p>
        <div style = {{display:"flex", justifyContent:"space-between", width:"100%",}}>

          <button onClick={()=> setOpenDeleteModal(false)}   style ={{width:"160px", height:"44px", border:"1px solid #D0D5DD", borderRadius:"8px", cursor:"pointer"}}>Cancel</button>
          <button onClick={()=> handleDeleteTest()} style ={{width:"160px", height:"44px", border:"none", background:"#D92D20",borderRadius:"8px",color:"#ffffff",cursor:"pointer",marginLeft:"1rem"}}>Delete</button>
        </div>
        </div>

      </Dialog>
    </div>
  );
};

export default TestPricing;
