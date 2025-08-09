import React, { useState } from "react";
import {
  Button,
  Modal,
  Paper,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { authPost } from "../../../axios/useAuthPost";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setError, setSuccess } from "../../../store/error/error.action";
import pharmacybannerimage from "../../../assets/pharmacy/pharmacyBanners/pharmacybannerimage.png"

interface SelectedMedicineData {
  id: number | null;
  name: string;
  category: string;
  quantity: number;
  agencyName: string | null;
  contactNo: string | null;
  email: string | null;
  agentCode: number | null;
  manufacturer: string | null;
  location: string | null
}

interface ManufacturerData {
  gst: number | null;
  agencyName: string;
  contactNo: string;
  email: string;
  agentCode: number | null;
  manufacturer: string;
}

interface ReorderMedicineModalProps {
  medData: SelectedMedicineData[];
  manufactureData: ManufacturerData[];
  handleClearData: (value: string) => void;
  isOpen: boolean;
  heading:string
}

const ReorderMedicineModal: React.FC<ReorderMedicineModalProps> = ({
  medData,
  manufactureData,
  isOpen,
  handleClearData,
  heading
}) => {
  const dispatch = useDispatch();
  const [selectedMedicine, setSelectedMedicine] = useState<SelectedMedicineData>({
    id: null,
    name: "",
    category: "",
    quantity: 0,
    agencyName: null,
    contactNo: null,
    email: null,
    agentCode: null,
    manufacturer: null,
    location:""
  });
  const user = useSelector(selectCurrentUser);
  const [medicineDropdown, setMedicineDropdown] =
    useState<SelectedMedicineData[]>(medData);
  const [tableData, setTableData] = useState<SelectedMedicineData[]>([]);

  const onClose = () => {
    handleClearData("close");
  };

  const handleAgencyChange = (agencyName: string) => {
    const selectedAgency = manufactureData.find(
      (agency) => agency.agencyName === agencyName
    );
    if (selectedAgency) {
      setSelectedMedicine((prev) => ({
        ...prev,
        agencyName: selectedAgency.agencyName,
        contactNo: selectedAgency.contactNo,
        email: selectedAgency.email,
        agentCode: selectedAgency.agentCode,
        manufacturer: selectedAgency.manufacturer,
      }));
    }
  };

  const handleAddMedicine = () => {
    setTableData((prev) => [...prev, selectedMedicine]);
    setMedicineDropdown((prev) =>
      prev.filter((medicine) => medicine.id !== selectedMedicine.id)
    );
    // Reset the selected medicine
    setSelectedMedicine({
      id: null,
      name: "",
      category: "",
      quantity: 0,
      agencyName: null,
      contactNo: null,
      email: null,
      agentCode: null,
      manufacturer: null,
      location:""
    });
  };

  const handleSubmit = async() => {

    if (tableData.length > 0) {
        const response = await authPost(
          `medicineInventoryExpense/${user.hospitalID}/ReorderOrReplaceMedicine`,
          { medicineList: tableData},
          user.token
        );
  
        if (response.status == 200) {
          dispatch(setSuccess("Successfully Added"));
          handleClearData("success");
        } else {
          dispatch(setError("Something Went Wrong"));
        }
      } else {
        dispatch(setError("Data is missing"));
      }

    // Simulate API call
    console.log("Submitting data:", tableData);
    // Clear the table data after submission
    setTableData([]);
    setMedicineDropdown(medData); // Reset dropdown to include all medicines
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper
        elevation={3}
        style={{
          padding: "26px",
          width: "700px",
          margin: "auto",
          marginTop: "5%",
          borderRadius: "10px",
          position:"relative",
        }}
      >
        <h2 style={{ textAlign: "center" }}>{heading}</h2>
        <img src = {pharmacybannerimage} alt = "pharmacy order banner"  style = {{position:"absolute",top :"20px",height:"120px",left:2,zIndex:0,}}/>
        <div >
        <form
          style={{
            display: "grid",
            gap: "20px",
            marginBottom: "20px",
            marginTop:"50px",
            border:"1px solid #D8D8D8",
            borderRadius:"10px",
            padding:"25px",
            background:"#ffffff",
            position:"relative",
            zIndex:2, 
            maxHeight:"400px",
            overflowY:"scroll",
            scrollbarWidth:"thin",
            marginRight:"10px",            
            
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Medicine Dropdown */}
            <Select
              value={selectedMedicine.id ?? ""}
              style ={{background:"#ffffff"}}
              onChange={(e) => {
                const selected = medData.find(
                  (medicine) =>
                    medicine.id === Number(e.target.value)
                );
                if (selected) {
                  setSelectedMedicine((prev) => ({
                    ...prev,
                    id: selected.id,
                    name: selected.name,
                    category: selected.category,
                  }));
                }
              }}
              displayEmpty
              sx = {{
                background: "#ffffff",
                  "& .MuiSvgIcon-root": {
                  color: "#1977F3"},
                  }}
            >
              <MenuItem value="" disabled>
                Select Medicine
              </MenuItem>
              {medicineDropdown
                .filter((medicine) => medicine.id !== null)
                .map((medicine) => (
                  <MenuItem key={medicine.id} value={medicine.id as number}>
                    {medicine.name}
                  </MenuItem>
                ))}
            </Select>

            {/* Agency Dropdown */}
            <Select
              value={selectedMedicine.agencyName || ""}
              onChange={(e) => handleAgencyChange(e.target.value)}
              displayEmpty
              sx = {{
                background: "#ffffff",
                  "& .MuiSvgIcon-root": {
                  color: "#1977F3"},
                  }}
            >
              <MenuItem value="" disabled>
                Select Agency
              </MenuItem>
              {manufactureData.map((agency, index) => (
                <MenuItem key={index} value={agency.agencyName}>
                  {agency.agencyName}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label="Category"
              value={selectedMedicine.category}
              InputProps={{ readOnly: true }}
            />
            <TextField 
            label = "Location" 
            value={selectedMedicine.location ||""} 
            InputProps={{readOnly:true}}
            />
            <TextField
              label="Contact No"
              value={selectedMedicine.contactNo || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Email ID"
              value={selectedMedicine.email || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Agent Code"
              value={selectedMedicine.agentCode || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Manufacturer"
              value={selectedMedicine.manufacturer || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Quantity"
              type="number"
              value={selectedMedicine.quantity || ""}
              onChange={(e) =>
                setSelectedMedicine((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
            />
            <div style = {{display:"flex", alignItems:"center", justifyContent:"flex-start", borderRadius:"6px"}}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "100px"}}
            onClick={handleAddMedicine}
            disabled={!selectedMedicine.id || selectedMedicine.quantity <= 0}
          >
            + Add
          </Button>
          </div>
          </div>
          
        </form>
        </div>
        <hr/>
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow sx= {{background:"#F1F1FD"}}>
                <TableCell>S:No</TableCell>
                <TableCell>Medicine</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Agency</TableCell>
                <TableCell>Agent Code</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.category}</TableCell>
                  <TableCell>{data.agencyName}</TableCell>
                  <TableCell>{data.agentCode}</TableCell>
                  <TableCell>{data.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            
            onClick={onClose}
            style={{ marginRight: "10px", color:"#000000", textTransform:"none" }}
          >
            Close
          </Button>
          <Button style={{backgroundColor:"#1977F3", borderRadius:"6px", textTransform:"none"}} variant="contained" onClick={handleSubmit}>
            Order
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};

export default ReorderMedicineModal;
