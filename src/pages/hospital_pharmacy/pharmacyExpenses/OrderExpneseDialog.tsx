import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogContent,
  Typography,
  Paper,
} from "@mui/material";
import {
  setError,
  setLoading,
  setSuccess,
} from "../../../store/error/error.action";
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { Add } from "@mui/icons-material";
import ordermedicinebanner from "../../../assets/pharmacy/pharmacyBanners/ordermedicinebanner.png";
import cart_order from "../../../assets/pharmacy/buttons/cart_order.png";

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
  manufacturer: string;
  email: string;
  expiryDate: string;
  addedOn?: string;
}

interface ManufacturerData {
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
}

const OrderExpneseDialog = ({ setOpen, open }: OrderExpneseDialogProps) => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [medicineList, setMedicineList] = useState<SelectedMedicineData[]>([]);

  const [medicineInStockData, setMedicineInStockData] = useState<StockData[]>(
    []
  );

  const [manufactureData, setManufactureData] = useState<ManufacturerData[]>(
    []
  );

  const initalSelectedMedicineData = {
    id: null,
    name: "",
    category: "",
    quantity: 0,
    agencyName: "",
    contactNo: "",
    email: "",
    agentCode: null,
    manufacturer: "",
  };

  const [selectedMedicineData, setSelectedMedicineData] =
    useState<SelectedMedicineData>(initalSelectedMedicineData);

  const addMedicineToList = () => {
    console.log("selectedMedicineDataj", selectedMedicineData);

    if (
      selectedMedicineData.name &&
      selectedMedicineData.category &&
      selectedMedicineData.quantity &&
      selectedMedicineData.email &&
      selectedMedicineData.agencyName
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

  const submitHandler = async () => {
    if (medicineList.length > 0) {
      const response = await authPost(
        `medicineInventoryExpense/${user.hospitalID}/AddInventoryExpense`,
        { medicineList: medicineList },
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

  const handleAgencyChange = (agencyName: string) => {
    const selectedAgency = manufactureData.find(
      (agency) => agency.agencyName === agencyName
    );

    if (selectedAgency) {
      setSelectedMedicineData((prev) => ({
        ...prev,
        agencyName: selectedAgency.agencyName,
        contactNo: selectedAgency.contactNo,
        email: selectedAgency?.email || "",
        agentCode: selectedAgency.agentCode,
        manufacturer: selectedAgency.manufacturer,
      }));
    } else {
      setSelectedMedicineData((prev) => ({
        ...prev,
        agencyName: agencyName,
      }));
    }
  };

  // ======== re order==========

  const renderDirectUi = () => {
    return (
      <>
        <Grid container></Grid>
        <Grid item sm={12} sx={{ position: "relative" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Enter The Specific Details Of The Medicine
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Autocomplete
            freeSolo
            fullWidth
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
            options={[
              ...new Set(medicineInStockData?.map((item) => item.category)),
            ]}
            value={selectedMedicineData.category}
            onInputChange={(_e: unknown, newValue: string) => {
              setSelectedMedicineData((prev) => ({
                ...prev,
                category: newValue,
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Category" required />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Quantity"
            placeholder="Quantity"
            type="number"
            required
            value={
              selectedMedicineData.quantity === 0
                ? ""
                : selectedMedicineData.quantity
            }
            onChange={(e) =>
              setSelectedMedicineData((prev) => ({
                ...prev,
                quantity: Number(e.target.value),
              }))
            }
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={5} style={{ position: "relative" }}>
          <img
            src={ordermedicinebanner}
            alt="order medicine banner"
            style={{
              width: "150px",
              height: "120px",
              position: "absolute",
              left: "65%",
              top: "35%",
            }}
          />
        </Grid>
        <Grid item sm={12} sx={{ mt: "20px" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Enter The Agency Details
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            fullWidth
            options={[
              ...new Set(manufactureData?.map((item) => item.agencyName)),
            ]}
            value={selectedMedicineData.agencyName}
            onInputChange={(_e: unknown, newValue: string) => {
              handleAgencyChange(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Agency Name" required />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="contac"
            label="Contact Number"
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
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Agency Code"
            name="agentCode"
            type="number"
            value={
              selectedMedicineData.agentCode
                ? String(selectedMedicineData.agentCode)
                : ""
            }
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
          <Autocomplete
            freeSolo
            fullWidth
            options={[
              ...new Set(manufactureData?.map((item) => item.manufacturer)),
            ]}
            value={selectedMedicineData.manufacturer}
            onInputChange={(_e: unknown, newValue: string) => {
              setSelectedMedicineData((prev) => ({
                ...prev,
                manufacturer: newValue,
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Manufacture" required />
            )}
          />
        </Grid>

        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#1977f3",
              padding: "1rem 2rem",
            }}
            onClick={addMedicineToList}
          >
            Add <Add sx={{ color: "white" }} />
          </Button>
        </Grid>
      </>
    );
  };

  return (
    <div>
      <DialogContent>
        <h1>Order Medicine</h1>

        <Box
          sx={{
            p: 3,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <Grid container spacing={2}>
            {renderDirectUi()}

            {/* Medicine List */}
            {medicineList.length > 0 && (
              <Grid item xs={12} style={{}}>
                <TableContainer
                  component={Paper}
                  style={{
                    marginTop: "20px",
                    maxHeight: "250px",
                    overflowY: "scroll",
                    display: "block",
                  }}
                >
                  <Table>
                    <TableHead
                      style={{
                        backgroundColor: "#F1F1FD",
                        position: "sticky",
                        top: 0,
                      }}
                    >
                      <TableRow>
                        <TableCell>S:No</TableCell>
                        <TableCell>Medicine</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Agency</TableCell>
                        <TableCell>Agent Code</TableCell>
                        <TableCell>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {medicineList.map((data, index) => (
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
              </Grid>
            )}

            {/* Save and Close Buttons */}
            {medicineList.length > 0 && (
              <>
                <Grid item xs={12}>
                  <hr
                    style={{
                      height: "1px",
                      background: "#ccc",
                      border: "none",
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Button
                      sx={{
                        padding: "0.8rem",
                        color: "#252525",
                      }}
                      onClick={() => {
                        setOpen(!open);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "#1977F3",
                        padding: "0.8rem 2rem",
                        marginLeft: "1rem",
                        display: "flex",
                        alignItems: "center",
                        height: "35px",
                        width: "85px",
                      }}
                      onClick={debounceSubmitHandler}
                    >
                      <img src={cart_order} alt="cart order" />
                      Order
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
    </div>
  );
};

export default OrderExpneseDialog;
