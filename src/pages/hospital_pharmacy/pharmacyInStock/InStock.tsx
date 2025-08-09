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
  Modal,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import * as XLSX from "xlsx";
import styles from "./InStock.module.scss";
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { authPost } from "../../../axios/useAuthPost";
import {
  setError,
  setLoading,
  setSuccess,
} from "../../../store/error/error.action";
import export_button from "../../../assets/pharmacy/buttons/export_button.png"

interface StockData {
  id: number;
  hospitalID?: number;
  name: string;
  category: string;
  hsn: string;
  quantity: number;
  totalQuantity: number;
  costPrice: number;
  sellingPrice: number;
  manufacturer: string;
  location: string;
  expiryDate: string;
  addedOn?: string;
}

const category_items = [
  "Injection",
  "Capsules",
  "Syrup",
  "Tablets",
  "Gel",
  "Spray",
  "Intubation",
  "Inhaler",
];

const InStock: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [data, setData] = useState<StockData[]>([]);
  const [filteredData, setFilteredData] = useState<StockData[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    "Available"
  );
  const [newStock, setNewStock] = useState<StockData>({
    id: 0,
    name: "",
    category: "",
    hsn: "",
    quantity: 0,
    totalQuantity: 0,
    expiryDate: "",
    location: "",
    costPrice: 0,
    sellingPrice: 0,
    manufacturer: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    category: false,
    quantity: false,
    costPrice: false,
    sellingPrice: false,
    hsn: false,
    expiryDate: false,
    location: false,
    manufacturer: false,
  });
  const [locationAnchorEl, setLocationAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [medicineNameAnchorEl, setMedicineNameAnchorEl] =
    useState<null | HTMLElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMedicineName, setSelectedMedicineName] = useState<
    string | null
  >(null);

  useEffect(() => {
    dispatch(setLoading(true));
    const getMedicineInventory = async () => {
      const response = await authFetch(
        `pharmacy/${user.hospitalID}/getMedicineInventory`,
        user.token
      );
      if (response.status == 200) {
        setData(response.medicines);
        dispatch(setLoading(false));
      }
    };

    if (user.hospitalID) {
      getMedicineInventory();
    }
  }, [dispatch, user.hospitalID, user.token]);

  useEffect(() => {
    let filteredResult = data;

    if (selectedLocation) {
      filteredResult = filteredResult.filter(
        (item) => item.location === selectedLocation
      );
    }
    if (selectedCategory) {
      filteredResult = filteredResult.filter(
        (item) => item.category === selectedCategory
      );
    }
    if (selectedMedicineName) {
      filteredResult = filteredResult.filter(
        (item) => item.name === selectedMedicineName
      );
    }
    if (selectedFilter === "Available") {
      filteredResult = filteredResult.filter((item) =>
        dayjs(item.expiryDate).isAfter(dayjs(), "day")
      );
    }
    if (selectedFilter === "Expired") {
      filteredResult = filteredResult.filter((item) =>
        dayjs(item.expiryDate).isBefore(dayjs(), "day")
      );
    }

    setFilteredData(filteredResult);
  }, [
    data,
    selectedLocation,
    selectedCategory,
    selectedMedicineName,
    selectedFilter,
  ]);

  const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setCategoryAnchorEl(event.currentTarget);
  };

  const handleMedicineNameClick = (event: React.MouseEvent<HTMLElement>) => {
    setMedicineNameAnchorEl(event.currentTarget);
  };
  const handleLocationClose = () => {
    setLocationAnchorEl(null);
  };

  const handleCategoryClose = () => {
    setCategoryAnchorEl(null);
  };
  const handleMedicineNameClose = () => {
    setMedicineNameAnchorEl(null);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    handleLocationClose();
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    handleCategoryClose();
  };
  const handleMedicineNameSelect = (category: string) => {
    setSelectedMedicineName(category);
    handleMedicineNameClose();
  };

  const handleResetLocationFilter = () => {
    setSelectedLocation(null);
    handleLocationClose();
  };

  const handleResetCategoryFilter = () => {
    setSelectedCategory(null);
    handleCategoryClose();
  };
  const handleResetMedicineNameFilter = () => {
    setSelectedMedicineName(null);
    handleMedicineNameClose();
  };

  const uniqueLocations = Array.from(
    new Set(data?.map((item) => item.location))
  );
  const uniqueCategories = Array.from(
    new Set(data?.map((item) => item.category))
  );
  const uniqueMedicines = Array.from(new Set(data?.map((item) => item.name)));
  
  const formattedData = data.map((item:StockData)=> ({
    "Med ID" : item.id, 
    "Med Name" : item.name, 
    "Category" : item.category,
    "HSN Code" : item.hsn,
    "Stock Qty" : item.totalQuantity, 
    "Cost Price" : item.costPrice, 
    "Sale Price" : item.sellingPrice, 
    "Expiry Date": item.expiryDate, 
     "Status" : item?.expiryDate && dayjs(item.expiryDate).isBefore(dayjs())
      ? "Expired"
      : item?.expiryDate &&
        dayjs(item.expiryDate).diff(dayjs(), "month") < 1
      ? "Expiring"
      : "Available"}))

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StockData");
    XLSX.writeFile(wb, "stock_data.xlsx");
  };

  const postMedicineInventory = async (newStock: StockData) => {
    const response = await authPost(
      `pharmacy/${user.hospitalID}/postMedicineInventory`,
      newStock,
      user.token
    );
    if (response.status === 201) {
      setData([...data, newStock]);
      setFilteredData([...data, newStock]);
      dispatch(
        setSuccess(`Medicine "${newStock.name}" was successfully added.`)
      );
    } else if (response.status === 400) {
      dispatch(setError(`Failed to add medicine: ${newStock.name}`));
    } else {
      dispatch(setError("Something went wrong, please try again."));
    }
  };
  console.log(selectedFilter, "seelctedFilter");

  const handleAddStock = (event: any) => {
    // validation
    event.preventDefault();
    const newErrors = {
      name: newStock.name.trim() === "",
      category: newStock.category.trim() === "",
      hsn: newStock.hsn.trim() === "",
      quantity: newStock.quantity <= 0,
      expiryDate: newStock.expiryDate === null || newStock.expiryDate === "",
      location: newStock.location.trim() === "",
      manufacturer: newStock.manufacturer.trim() === "",
      costPrice: newStock.costPrice <= 0,
      sellingPrice: newStock.sellingPrice <= 0,
    };
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((error) => error);
    if (hasError) {
      return;
    }

    setOpenModal(false);
    postMedicineInventory(newStock);
    setNewStock({
      id: 0,
      name: "",
      category: "",
      hsn: "",
      quantity: 0,
      totalQuantity: 0,
      expiryDate: "",
      location: "",
      costPrice: 0,
      sellingPrice: 0,
      manufacturer: "",
    });
  };
  const dynamicColAdjust = selectedFilter !=="Expired" ? styles.tableHeadCell : styles.tableHeadCellExpired

  return (
    <div className={styles.inStockContainer}>
      <div className={styles.subHeaderContainer}>
        {/* <Button
          variant="contained"
          component="label"
          startIcon={<Upload />}
          className={styles.uploadBtn}
        >
          Upload
          <input hidden type="file" onChange={handleUpload} />
        </Button> */}
        <div className={styles.button_container}>
          <button
            className={selectedFilter === "Available" ? styles.active : ""}
            onClick={() => setSelectedFilter("Available")}
          >
            Available
          </button>
          <button
            className={selectedFilter === "Expired" ? styles.active : ""}
            onClick={() => setSelectedFilter("Expired")}
          >
            Expired
          </button>
        </div>
        <Button
          variant="contained"
          onClick={handleExport}
          className={styles.uploadBtn}
          style={{ marginLeft: "10px",display:"flex", alignItems:"center", textTransform:"none"}}
        >
          <img src = {export_button} alt = "export button image" style ={{marginRight:"5px"}} />
          Export
        </Button>
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpenModal(true)}
          className={styles.addButton}
        >
          Add Stock
        </Button> */}
      </div>
      <TableContainer
        component={Paper}
        className={styles.tableContainer}
        sx={{ borderRadius: "15px",border:"0px", boxShadow:"none",scrollbarWidth:"thin" }}
      >
        <Table>
          <TableHead className={dynamicColAdjust}>
            <TableRow sx = {{position:"sticky",top:0}}>
              <TableCell className={dynamicColAdjust} sx={{borderTopLeftRadius:"15px",fontSize:"16px"}}>Med ID</TableCell>
              <TableCell className={dynamicColAdjust} sx ={{fontSize:"16px"}}>
                Med Name
                <IconButton size="small" onClick={handleMedicineNameClick}>
                  <FilterList sx={{ color: "white" }} />
                </IconButton>
              </TableCell>
              <TableCell className={dynamicColAdjust}>
                Category
                <IconButton size="small" onClick={handleCategoryClick}>
                  <FilterList sx={{ color: "white" }} />
                </IconButton>
              </TableCell>
              <TableCell className={dynamicColAdjust} sx ={{fontSize:"16px"}}>HSN Code</TableCell>
              <TableCell className={dynamicColAdjust} sx ={{fontSize:"16px"}}>Stock Qty</TableCell>
              <TableCell className={dynamicColAdjust} sx ={{fontSize:"16px"}}>Cost Price</TableCell>
              <TableCell className={dynamicColAdjust} sx ={{fontSize:"16px"}}>Sale Price</TableCell>
              <TableCell className={dynamicColAdjust} sx ={{fontSize:"16px"}}>Expiry Date</TableCell>
              {selectedFilter !== "Expired" ? (
                  <TableCell className={dynamicColAdjust} sx ={{fontSize:"16px"}}> <span style ={{marginLeft:"20px",fontSize:"16px",fontWeight:"bold"}}>Status </span></TableCell>
              ) : <TableCell className={dynamicColAdjust}></TableCell>}
              
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.map((row) => (
              <TableRow
                key={row.id}
                className={styles.tableBodyRow}
              >
                <TableCell className={styles.tableBodyCell} sx = {{fontSize:"16px"}}>{row.id}</TableCell>
                <TableCell className={styles.tableBodyCell} sx = {{fontSize:"16px"}} >
                  {row?.name}
                </TableCell>
                <TableCell className={styles.tableBodyCell} sx = {{fontSize:"16px"}}>
                  {row?.category}
                </TableCell>
                <TableCell className={styles.tableBodyCell} sx = {{fontSize:"16px"}}>
                  {row?.hsn}
                </TableCell>
                <TableCell className={styles.tableBodyCell} sx = {{fontSize:"16px"}}>
                  {row?.totalQuantity}
                </TableCell>
                <TableCell className={styles.tableBodyCell} sx = {{fontSize:"16px"}}>
                  {row?.costPrice}
                </TableCell>
                <TableCell className={styles.tableBodyCell} sx = {{fontSize:"16px"}} >
                  {row?.sellingPrice}
                </TableCell>
                
                <TableCell className={styles.tableBodyCell} sx = {{fontSize:"16px"}}>
                  {row?.expiryDate
                    ? dayjs(row.expiryDate).format("DD/MM/YYYY")
                    : "N/A"}
                </TableCell>

                {selectedFilter!=="Expired" ? (
                  <TableCell
                  className={styles.tableBodyCell}
                >
                  <div
                    className={styles.expiringStatus}
                    style={{
                      borderRadius: "40px",
                      height:"32px",
                      fontSize:"14px",
                      width:"80px",
                      display:"flex", alignItems:"center",justifyContent:"center",
                      backgroundColor:
                        row?.expiryDate &&
                        dayjs(row.expiryDate).isBefore(dayjs()) 
                          ? "red"
                          : row?.expiryDate &&
                            dayjs(row.expiryDate).diff(dayjs(), "month") < 1
                          ? "#F4EAB7" 
                          : "#BCF4B7", 
                      color:
                        row?.expiryDate &&
                        dayjs(row.expiryDate).isBefore(dayjs())
                          ? "white" 
                          : row?.expiryDate &&
                            dayjs(row.expiryDate).diff(dayjs(), "month") < 1
                          ? "#A18705" 
                          : "#117209", 
                    }}
                  >
                    {row?.expiryDate && dayjs(row.expiryDate).isBefore(dayjs())
                      ? "Expired"
                      : row?.expiryDate &&
                        dayjs(row.expiryDate).diff(dayjs(), "month") < 1
                      ? "Expiring"
                      : "Available"}
                  </div>
                </TableCell>


                ) : (<TableCell></TableCell>)}
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* {data?.length == 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <h4>NO DATA FOUND</h4>
          </div>
        )} */}
      </TableContainer>
      {/* ===location===== */}
      <Menu
        anchorEl={locationAnchorEl}
        open={Boolean(locationAnchorEl)}
        onClose={handleLocationClose}
      >
        {uniqueLocations.map((location) => (
          <MenuItem
            key={location}
            onClick={() => handleLocationSelect(location)}
          >
            {location}
          </MenuItem>
        ))}
        <MenuItem onClick={handleResetLocationFilter}>
          Reset Location Filter
        </MenuItem>
      </Menu>
      {/* ==========medicine======== */}
      <Menu
        anchorEl={medicineNameAnchorEl}
        open={Boolean(medicineNameAnchorEl)}
        onClose={handleMedicineNameClose}
      >
        {uniqueMedicines.map((medicine, index) => (
          <MenuItem
            key={index}
            onClick={() => handleMedicineNameSelect(medicine)}
          >
            {medicine}
          </MenuItem>
        ))}
        <MenuItem onClick={handleResetMedicineNameFilter}>
          Reset Medicine Name Filter
        </MenuItem>
      </Menu>
      {/* ===Category====== */}
      <Menu
        anchorEl={categoryAnchorEl}
        open={Boolean(categoryAnchorEl)}
        onClose={handleCategoryClose}
      >
        {uniqueCategories.map((category) => (
          <MenuItem
            key={category}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </MenuItem>
        ))}
        <MenuItem onClick={handleResetCategoryFilter}>
          Reset Category Filter
        </MenuItem>
      </Menu>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper className={styles.modalContent}>
          <h2
            style={{
              fontWeight: "normal",
              color: "#052040",
              textAlign: "center",
            }}
          >
            ADD NEW STOCK
          </h2>
          <form>
            <TextField
              label="Medicine Name"
              fullWidth
              value={newStock?.name}
              onChange={(e) =>
                setNewStock({ ...newStock, name: e.target.value })
              }
              margin="normal"
              className={styles.modalInput}
              error={errors.name}
              helperText={errors.name ? "Medicine Name is required" : ""}
            />
            <FormControl
              fullWidth
              margin="normal"
              className={styles.modalInput}
              error={errors.category}
            >
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={newStock?.category || ""}
                onChange={(e) =>
                  setNewStock({ ...newStock, category: e.target.value })
                }
              >
                {category_items.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Category is required
                </span>
              )}
            </FormControl>
            <TextField
              label="HSN/SAC"
              fullWidth
              value={newStock?.hsn}
              onChange={(e) =>
                setNewStock({ ...newStock, hsn: e.target.value })
              }
              margin="normal"
              className={styles.modalInput}
              error={errors.hsn}
              helperText={errors.hsn ? "HSN/SAC is required" : ""}
            />
            <TextField
              label="Stock Qty"
              fullWidth
              type="number"
              value={newStock?.quantity}
              onChange={(e) =>
                setNewStock({
                  ...newStock,
                  quantity: Math.max(0, parseInt(e.target.value)),
                })
              }
              margin="normal"
              className={styles.modalInput}
              inputProps={{ min: 0 }}
              error={errors.quantity}
              helperText={
                errors.quantity ? "Quantity must be greater than 0" : ""
              }
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Exp Date"
                value={newStock?.expiryDate ? dayjs(newStock.expiryDate) : null}
                onChange={(newValue) =>
                  setNewStock({
                    ...newStock,
                    expiryDate: newValue ? newValue.toISOString() : "",
                  })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    className: styles.modalInput,
                    error: errors.expiryDate,
                    helperText: errors.expiryDate ? "Invalid or past date" : "",
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Location"
              fullWidth
              value={newStock?.location}
              onChange={(e) =>
                setNewStock({ ...newStock, location: e.target.value })
              }
              margin="normal"
              className={styles.modalInput}
              error={errors.location}
              helperText={errors.location ? "Location is required" : ""}
            />
            <TextField
              label="Manufacturer"
              fullWidth
              value={newStock?.manufacturer}
              onChange={(e) =>
                setNewStock({ ...newStock, manufacturer: e.target.value })
              }
              margin="normal"
              className={styles.modalInput}
              error={errors.manufacturer}
              helperText={errors.manufacturer ? "Manufacturer is required" : ""}
            />
            <TextField
              label="Cost Price"
              fullWidth
              type="number"
              value={newStock?.costPrice}
              onChange={(e) =>
                setNewStock({
                  ...newStock,
                  costPrice: Math.max(0, parseFloat(e.target.value)),
                })
              }
              margin="normal"
              className={styles.modalInput}
              inputProps={{ min: 0 }}
              error={errors.costPrice}
              helperText={
                errors.costPrice ? "Cost Price must be greater than 0" : ""
              }
            />
            <TextField
              label="Selling Price"
              fullWidth
              type="number"
              value={newStock?.sellingPrice}
              onChange={(e) =>
                setNewStock({
                  ...newStock,
                  sellingPrice: Math.max(0, parseFloat(e.target.value)),
                })
              }
              margin="normal"
              className={styles.modalInput}
              inputProps={{ min: 0 }}
              error={errors.sellingPrice}
              helperText={
                errors.sellingPrice
                  ? "Selling Price must be greater than 0"
                  : ""
              }
            />
            <div className={styles.button__div}>
              <button type="button" onClick={handleAddStock}>
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenModal(false);
                  setErrors({
                    name: false,
                    category: false,
                    quantity: false,
                    costPrice: false,
                    sellingPrice: false,
                    hsn: false,
                    expiryDate: false,
                    location: false,
                    manufacturer: false,
                  });
                }}
              >
                Close
              </button>
            </div>
          </form>
        </Paper>
      </Modal>
    </div>
  );
};

export default InStock;
