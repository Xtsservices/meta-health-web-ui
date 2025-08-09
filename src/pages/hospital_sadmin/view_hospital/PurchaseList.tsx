import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authPost } from "../../../axios/useAuthPost";
import { authFetch } from "../../../axios/useAuthFetch";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../../store/error/error.action";
import { useParams } from "react-router-dom";
import { formatDate2, capitalizeFirstLetter } from "./../../../utility/global";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DownloadIcon from "@mui/icons-material/Download";
// import IconButton from "@mui/material/IconButton";
interface Purchase {
  purchaseDate: string;
  purchaseType: string;
  hubCount: number | null;
  deviceCount: number | null;
  totalCost: number | null;
}

const PurchaseList = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState({
    purchaseDate: "",
    purchaseType: "",
    hubCount: "",
    deviceCount: "",
    totalCost: "",
  });
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setPurchaseData({ ...purchaseData, [name]: value });
  };

  const handleAddPurchase = async () => {
    if (!purchaseData.purchaseDate || !purchaseData.purchaseType) {
      dispatch(setError("Please fill the required fields."));
      return;
    }

    const hubCount = parseFloat(purchaseData.hubCount);
    const deviceCount = parseFloat(purchaseData.deviceCount);
    const totalCost = parseFloat(purchaseData.totalCost);

    if (isNaN(hubCount) || isNaN(deviceCount) || isNaN(totalCost)) {
      dispatch(
        setError(
          "Please enter values for hubCount, deviceCount, and totalCost."
        )
      );
      return;
    }
    try {
      const newPurchaseData: Purchase = {
        purchaseDate: purchaseData.purchaseDate,
        purchaseType: purchaseData.purchaseType,
        hubCount: hubCount,
        deviceCount: deviceCount,
        totalCost: totalCost,
      };
      // console.log("Sending data to server:", newPurchaseData);
      const response = await authPost(
        `purchase/hospital/${id}`,
        newPurchaseData,
        user.token
      );
      // console.log("Response from server to add purchase:", response);

      if (
        response &&
        (response.message === "success" || response.data?.message === "success")
      ) {
        // console.log("purchase log", newPurchaseData);
        dispatch(setSuccess("Purchase List Successfully Added"));
        setPurchases((prevPurchases) => [...prevPurchases, newPurchaseData]);
        setPurchaseData({
          purchaseDate: "",
          purchaseType: "",
          hubCount: "",
          deviceCount: "",
          totalCost: "",
        });
        setIsPopupOpen(false);
      } else {
        console.error("Error: Invalid response format.");
        dispatch(
          setError("Error adding purchase list. Please try again later.")
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      dispatch(setError("Error adding purchase list. Please try again later."));
    }
  };
  const debouncedHandleAddPurchase = debounce(handleAddPurchase, DEBOUNCE_DELAY);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const response = await authFetch(`purchase/hospital/${id}`, user.token);
        if (response && response.message === "success") {
          setPurchases(response.purchases);
        } else {
          console.error("Error fetching data");
          // dispatch(setError("Error fetching purchase data. Please try again later."));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // dispatch(setError("Error fetching purchase data. Please try again later."));
      }
    };

    fetchPurchaseData();
  }, [id, user.token, dispatch]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button variant="contained" onClick={handleOpenPopup}>
          Purchase List
        </Button>
      </div>
      <Dialog open={isPopupOpen} onClose={handleClosePopup}>
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add Purchase
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClosePopup}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            required
            label="Date of Purchase"
            type="date"
            name="purchaseDate"
            InputLabelProps={{
              shrink: true,
            }}
            value={purchaseData.purchaseDate}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Type of Purchase</InputLabel>
            <Select
              required
              label="Type Of Purchase"
              value={purchaseData.purchaseType}
              onChange={handleInputChange}
              name="purchaseType"
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Number of Hubs"
            type="number"
            name="hubCount"
            required
            value={purchaseData.hubCount}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Number of Devices"
            type="number"
            name="deviceCount"
            required
            value={purchaseData.deviceCount}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Cost"
            type="number"
            name="totalCost"
            required
            value={purchaseData.totalCost}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" onClick={debouncedHandleAddPurchase}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
      {purchases.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Date of Purchase</b>
                </TableCell>
                <TableCell>
                  <b>Type of Purchase</b>
                </TableCell>
                <TableCell>
                  <b>Number of Hubs</b>
                </TableCell>
                <TableCell>
                  <b>Number of Devices</b>
                </TableCell>
                <TableCell>
                  <b>Total Cost</b>
                </TableCell>
                {/* <TableCell>
                  <b>Actions</b>
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate2(purchase.purchaseDate)}</TableCell>
                  <TableCell>
                    {capitalizeFirstLetter(purchase.purchaseType)}
                  </TableCell>
                  <TableCell>{purchase.hubCount}</TableCell>
                  <TableCell>{purchase.deviceCount}</TableCell>
                  <TableCell>{purchase.totalCost}</TableCell>
                  {/* <TableCell>
                    <IconButton aria-label="delete">
                      <DeleteIcon
                        color="error"
                      />{" "}
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default PurchaseList;
