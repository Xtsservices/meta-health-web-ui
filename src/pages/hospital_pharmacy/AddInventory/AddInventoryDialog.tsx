import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogContent,
  Dialog,
  Paper,
} from "@mui/material";
import {
  setError,
  setLoading,
  setSuccess,
} from "../../../store/error/error.action";
import EditIcon from '@mui/icons-material/Edit';
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { formatDate2 } from "../../../utility/global";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { Add } from "@mui/icons-material";
import pharmacybannerimage from "../../../assets/pharmacy/pharmacyBanners/pharmacybannerimage.png";

interface SelectedMedicineData {
  name: string;
  category: string;
  hsn: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockValue: number;
  email: string;
  expiryDate: string;
  gst: number | null;
  agencyName: string;
  agencyID: number | null;
  contactNo: string;
  agentCode: number | null;
  manufacturer: string;
}

interface StockData {
  name: string;
  id: number;
  hospitalID?: number;
  category: string;
  hsn: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockValue: number;
  manufacturer: string;
  email: string;
  expiryDate: string;
  addedOn?: string;
}

interface ManufacturerData {
  id: number;
  gst: number | null;
  agencyName: string;
  contactNo: string;
  email: string;
  agentCode: number | null;
  manufacturer: string;
}

interface OrderExpneseDialogProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  editMedicineData: SelectedMedicineData;
  editMEdId: number | null;
}

const AddInventoryDialog = ({
  setOpen,
  open,
  editMedicineData,
  editMEdId,
}: OrderExpneseDialogProps) => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [medicineList, setMedicineList] = useState<SelectedMedicineData[]>([]);

  const [medicineInStockData, setMedicineInStockData] = useState<StockData[]>(
    []
  );

  const [manufactureData, setManufactureData] = useState<ManufacturerData[]>(
    []
  );

  const medicineTypes = [
    "Capsules",
    "Syrups",
    "Tablets",
    "Injections",
    "IvLine",
    "Tubing",
    "Topical",
    "Drops",
    "Spray",
  ];

  console.log("editMedicineDataloop", editMedicineData);
  const initalSelectedMedicineData = {
    name: "",
    category: "",
    hsn: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    lowStockValue: 0,
    email: "",
    expiryDate: "",
    agencyName: "",
    contactNo: "",
    agentCode: null,
    manufacturer: "",
    addedOn: "",
    gst: null,
    agencyID: null,
  };

  const [selectedMedicineData, setSelectedMedicineData] =
    useState<SelectedMedicineData>(
      editMedicineData ? editMedicineData : initalSelectedMedicineData
    );
  console.log("selectedMedicineData", selectedMedicineData);
  const addMedicineToList = () => {
    if (
      selectedMedicineData.name &&
      selectedMedicineData.category &&
      selectedMedicineData.costPrice &&
      selectedMedicineData.expiryDate &&
      selectedMedicineData.hsn &&
      selectedMedicineData.gst &&
      selectedMedicineData.quantity &&
      selectedMedicineData.sellingPrice &&
      selectedMedicineData.lowStockValue
    ) {
      setMedicineList([
        ...medicineList,
        {
          ...selectedMedicineData,
        },
      ]);
      setSelectedMedicineData(initalSelectedMedicineData);
    } else {
      dispatch(setError("Some Medicine Data missing"));
    }
  };
  console.log("manufactureData", manufactureData);

  const submitHandler = async () => {
    if (medicineList.length > 0) {
      const response = await authPost(
        `medicineInventoryLogs/${user.hospitalID}/addInventoryLogs`,
        { medicineList: medicineList, user: user },
        user.token
      );
      if (response.status == 200) {
        dispatch(setSuccess("Successfully Added"));
        setOpen(!open);
      } else {
        dispatch(setError("Something Went Wrong"));
      }
    } else {
      dispatch(setError("Data is missing"));
    }
  };
  const debounceSubmitHandler = debounce(submitHandler, DEBOUNCE_DELAY);

  useEffect(() => {
    dispatch(setLoading(true));
    const getManufactureData = async () => {
      const response = await authFetch(
        `medicineInventoryManufacture/${user.hospitalID}/getAllManufacture`,
        user.token
      );
      if (response.status == 200) {
        setManufactureData(response.data);
        dispatch(setLoading(false));
      }
    };

    if (user.hospitalID) {
      getManufactureData();
    }
  }, [dispatch, user.hospitalID, user.token]);

  useEffect(() => {
    dispatch(setLoading(true));
    const getMedicineInventory = async () => {
      const response = await authFetch(
        `pharmacy/${user.hospitalID}/getMedicineInventory`,
        user.token
      );
      if (response.status == 200) {
        setMedicineInStockData(response.medicines);
        dispatch(setLoading(false));
      }
    };

    if (user.hospitalID) {
      getMedicineInventory();
    }
  }, [dispatch, user.hospitalID, user.token]);

  useEffect(() => {
    if (manufactureData) {
      const filterData = manufactureData?.filter(
        (each) =>
          each.agencyName === selectedMedicineData.agencyName &&
          each.manufacturer === selectedMedicineData.manufacturer
      );
      if (filterData?.length > 0) {
        setSelectedMedicineData((prev) => ({
          ...prev,
          contactNo: filterData[0].contactNo,
          email: filterData[0].email,
          agentCode: filterData[0].agentCode,
          manufacturer: filterData[0].manufacturer,
          agencyID: filterData[0].id,
        }));
      }
    }
  }, [selectedMedicineData.agencyName, selectedMedicineData.manufacturer]);


  async function handleEditMedicine(){

    if (
      selectedMedicineData.category &&
      selectedMedicineData.quantity &&
      selectedMedicineData.gst &&
      selectedMedicineData.sellingPrice &&
      selectedMedicineData.costPrice &&
      selectedMedicineData.hsn &&
      selectedMedicineData.lowStockValue && editMEdId
    ) {
      const response = await authPost(
        `medicineInventoryLogs/${user.hospitalID}/editMedicineInventoryData/${editMEdId}`,
        { medicineList: selectedMedicineData },
        user.token
      );
      if (response.status == 200) {
        dispatch(setSuccess("Successfully Edit"));
        setOpen(!open);
      } else {
        dispatch(setError("Something Went Wrong"));
      }
    } else {
      dispatch(setError("Data is missing"));
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            maxHeight: "800px",
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              p: 3,
              pt: 2,
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <div>
              <h1 style={{ textAlign: "center", marginLeft: "auto" }}>
                Add Inventory
              </h1>
              <img
                src={pharmacybannerimage}
                alt="add inventory banner image"
                style={{
                  position: "absolute",
                  left: "75%",
                  top: "4%",
                  width: "125px",
                  height: "140px",
                }}
              />
            </div>
            <Grid container spacing={1}>
              {/* Medicine Section */}

              <Grid
                container
                spacing={2}
                style={{
                  border: "0.8px solid #D8D8D8",
                  padding: "1rem",
                  marginTop: "18px",
                  borderRadius: "10px",
                  paddingTop: "6px",
                }}
              >
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    style={{
                      marginTop: "20px",
                      color: "#252525",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Enter The Specific Details Of The Medicine
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    disabled={editMEdId ? true : false}
                    options={[
                      ...new Set(medicineInStockData?.map((item) => item.name)),
                    ]}
                    value={selectedMedicineData.name}
                    onInputChange={(_e: unknown, newValue: string) => {
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        name: newValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Medicine Name" required />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    options={[...new Set(medicineTypes?.map((item) => item))]}
                    value={selectedMedicineData.category}
                    onInputChange={(_e: unknown, newValue: string) => {
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        category: newValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        required
                        sx={{ background: "white" }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={selectedMedicineData.quantity}
                    onChange={(e) =>
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        quantity: Number(e.target.value),
                      }))
                    }
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <TextField
                    fullWidth
                    label="GST %"
                    name="gst"
                    type="number"
                    value={selectedMedicineData.gst?.toString() || ""}
                    onChange={(event) => {
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        gst: Number(event.target.value),
                      }));
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "14px", color: "#252525", fontWeight: 600 }}
                  >
                    Fill In The Details Below To Add A New Medicine To The
                    Inventory
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    disabled={editMEdId ? true : false}
                    options={[
                      ...new Set(
                        manufactureData?.map((item) => item.agencyName)
                      ),
                    ]}
                    value={selectedMedicineData.agencyName}
                    onInputChange={(_e: unknown, newValue: string) => {
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        agencyName: newValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Agency Name" required />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo
                    disabled={editMEdId ? true : false}
                    fullWidth
                    options={[
                      ...new Set(
                        manufactureData?.map((item) => item.manufacturer)
                      ),
                    ]}
                    value={selectedMedicineData.manufacturer}
                    onInputChange={(_e: unknown, newValue: string) => {
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        manufacturer: newValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Manufacturer" required />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    disabled={editMEdId ? true : false}
                    label="Agent Code"
                    name="agentCode"
                    type="number"
                    value={selectedMedicineData.agentCode?.toString() || ""}
                    onChange={(event) => {
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        agentCode: Number(event.target.value),
                      }));
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="contac"
                    disabled={editMEdId ? true : false}
                    label="Contact No"
                    name="contactNumber"
                    value={selectedMedicineData.contactNo}
                    onChange={(event) => {
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        contactNo: event.target.value,
                      }));
                    }}
                    inputProps={{
                      maxLength: 10,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Exp Date"
                      disabled={editMEdId ? true : false}
                      value={
                        selectedMedicineData?.expiryDate
                          ? dayjs(selectedMedicineData.expiryDate)
                          : null
                      }
                      onChange={(newValue) => {
                        setSelectedMedicineData((prev) => ({
                          ...prev,
                          expiryDate: String(newValue),
                        }));
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Selling Price"
                    fullWidth
                    type="number"
                    value={selectedMedicineData?.sellingPrice}
                    onChange={(e) =>
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        sellingPrice: Math.max(0, parseFloat(e.target.value)),
                      }))
                    }
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Cost Price"
                    fullWidth
                    type="number"
                    value={selectedMedicineData?.costPrice}
                    onChange={(e) =>
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        costPrice: Math.max(0, parseFloat(e.target.value)),
                      }))
                    }
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    options={[
                      ...new Set(medicineInStockData?.map((item) => item.hsn)),
                    ]}
                    value={selectedMedicineData.hsn}
                    onInputChange={(_e: unknown, newValue: string) => {
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        hsn: newValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="HSN/Code" required />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="LowStock Alert"
                    fullWidth
                    type="number"
                    value={selectedMedicineData?.lowStockValue}
                    onChange={(e) =>
                      setSelectedMedicineData((prev) => ({
                        ...prev,
                        lowStockValue: Math.max(0, parseFloat(e.target.value)),
                      }))
                    }
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="email"
                name="email"
                value={selectedMedicineData.email}
                onChange={(event) => {
                  setSelectedMedicineData((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }));
                }}
                required
              />
            </Grid> */}

                <Grid item xs={4}>
                  {editMEdId ? (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "#1977f3",
                        padding: "0.8rem",
                        width: "100px",
                        height: "54px",
                      }}
                      onClick={handleEditMedicine}
                    >
                      <EditIcon sx={{ color: "white",marginRight:"4px" }} />
                      Edit 
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "#1977f3",
                        padding: "0.8rem",
                        margin: "2px",
                        width: "100px",
                        height: "42px",
                      }}
                      onClick={addMedicineToList}
                    >
                      <Add sx={{ color: "white" }} />
                      Add
                    </Button>
                  )}
                </Grid>
              </Grid>

              {/* Medicine List */}
              {medicineList.length > 0 && (
                <Grid item xs={12}>
                  <TableContainer
                    component={Paper}
                    style={{ marginTop: "20px", position: "relative" }}
                  >
                    <Table>
                      <TableHead
                        style={{
                          backgroundColor: "#F1F1FD",
                          position: "sticky",
                          top: "0",
                        }}
                      >
                        <TableRow>
                          <TableCell>Medicine Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>HSN/Code</TableCell>
                          {/* <TableCell>email</TableCell> */}
                          <TableCell>Expiry date</TableCell>
                          <TableCell>Cost Price</TableCell>
                          <TableCell>Selling Price</TableCell>
                          <TableCell>Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody
                        style={{ maxHeight: "300px", overflowY: "scroll" }}
                      >
                        {medicineList.map((medicine, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {medicine.name}
                            </TableCell>
                            <TableCell>{medicine.category}</TableCell>
                            <TableCell>{medicine.hsn}</TableCell>
                            {/* <TableCell>{medicine.email}</TableCell> */}
                            <TableCell>
                              {formatDate2(medicine.expiryDate)}
                            </TableCell>
                            <TableCell>{medicine.costPrice}</TableCell>
                            <TableCell>{medicine.sellingPrice}</TableCell>
                            <TableCell>{medicine.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}

              {/* Save and Close Buttons */}

              {/* Save and Close Buttons */}
              {medicineList.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <hr style={{ border: "1px solid gray" }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setOpen(!open);
                        }}
                      >
                        Close
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ backgroundColor: "#1977f3", marginLeft: "1rem" }}
                        onClick={debounceSubmitHandler}
                      >
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddInventoryDialog;
