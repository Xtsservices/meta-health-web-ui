import React, { useState } from "react";
import {
  Grid,
  Paper,
  Box,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stack,
} from "@mui/material";
import { QRCode } from "react-qrcode-logo";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./taxInvoice.module.scss";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation } from "react-router-dom";
import addIcon from "../../../assets/reception/add_icon.png";

const PatientBilling = () => {
  const location = useLocation();
  const { tabIndex } = location.state || {};
  const buttonText = tabIndex === 0 ? "Out Patient" : "In Patient";

  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedUnits, setSelectedUnits] = useState("");

  const patientData = {
    id: "FB2309030",
    name: "MR. ISHA RAO",
    admissionNo: "IP940",
    patientID: "0019",
    ageSex: "9Yrs/S/Male",
    consultant: "DR. G V PRAVEEN KUMAR",
    department: "GYNAECOLOGY",
    address: "6-6-426 BANSILAPET, CHACHA NEHRU NAGAR, HYDERABAD, TELANGANA",
  };

  const medicineData = [
    {
      medID: "1107",
      medicineName: "Pegrafleef 6mg",
      category: "Injection",
      qty: 36,
      hsnCode: 1107,
      price: 720,
      gst: "18%",
      amount: 849.6,
    },
    {
      medID: "1196",
      medicineName: "Piclix 100mg",
      category: "Capsules",
      qty: 24,
      hsnCode: 1165,
      price: 240,
      gst: "18%",
      amount: 283.2,
    },
    {
      medID: "1139",
      medicineName: "Qmax 200mg",
      category: "Tablets",
      qty: 60,
      hsnCode: 1198,
      price: 120,
      gst: "18%",
      amount: 141.6,
    },
  ];

  const testData = [
    {
      testID: "1165",
      testName: "Blood",
      charge: "600",
      qty: 2,
      price: 1200,
      gst: "18%",
      amount: 1416,
    },
    {
      testID: "1166",
      testName: "Urine",
      charge: "300",
      qty: 2,
      price: 600,
      gst: "18%",
      amount: 708,
    },
  ];
  const chargesData = [
    {
      code: "001",
      particulars: "Ventilator Use Fee",
      rate: 500,
      units: 2,
      price: 1000,
      gst: "18%",
      amount: 1180,
    },
    {
      code: "002",
      particulars: "Procedure Fee",
      rate: 1200,
      units: 1,
      price: 1200,
      gst: "18%",
      amount: 1416,
    },
    {
      code: "003",
      particulars: "Doctor Visit Fee",
      rate: 300,
      units: 5,
      price: 1500,
      gst: "18%",
      amount: 1770,
    },
    {
      code: "004",
      particulars: "Room Charges",
      rate: 2000,
      units: 3,
      price: 6000,
      gst: "18%",
      amount: 7080,
    },
    {
      code: "005",
      particulars: "Nurse Fee",
      rate: 150,
      units: 10,
      price: 1500,
      gst: "18%",
      amount: 1770,
    },
  ];

  const subTotal = medicineData
    .reduce((acc, item) => acc + item.amount, 0)
    .toFixed(2);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(event.target.value);
  };
  const handleSubmit = () => {
    // Handle form submission
    console.log("Selected payment method:", paymentMethod);
    handleClose();
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const serviceOptions = [
    "Ventilator Use Fee",
    "Procedure Fee",
    "Doctor Visit Fee",
    "Medical Supplies Fee",
    "Surgeon Fee",
    "Anesthesia Fee",
    "Room Charges",
    "ICU Nurse Fee",
    "Food Charges",
  ];

  const unitsOptions: Record<string, number[]> = {
    "Ventilator Use Fee": [1, 2, 3, 4, 5],
    "Procedure Fee": [1, 2],
    "Doctor Visit Fee": [1, 2, 3, 4, 5],
    "Medical Supplies Fee": [1, 2, 3, 4],
    "Surgeon Fee": [1],
    "Anesthesia Fee": [1],
    "Room Charges": [1, 2, 3, 4],
    "ICU Nurse Fee": [1, 2, 3],
    "Food Charges": [1, 2, 3, 4],
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value as string);
  };

  const handleServiceChange = (event: SelectChangeEvent<string>) => {
    setSelectedService(event.target.value);
    setSelectedUnits(""); // Reset units when service changes
  };

  const handleUnitsChange = (event: SelectChangeEvent<string>) => {
    setSelectedUnits(event.target.value);
  };

  const handleAdd = () => {
    // Add logic for the "Add" button here
    console.log(`Service: ${selectedService}, Units: ${selectedUnits}`);
  };

  return (
    <div className={styles.billingContainer}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              label="Patient ID"
              variant="outlined"
              fullWidth
              value={patientData.id}
              disabled
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                ml: 3,
                mt: 1,
                backgroundColor: "#d4edda",
                color: "green",
                border: "2px solid green",
                "&:hover": {
                  backgroundColor: "#c3e6cb",
                },
              }}
            >
              {buttonText}
            </Button>
          </Grid>

          <Paper elevation={0} style={{ padding: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box display="flex">
                  <Typography variant="body1" sx={{ minWidth: "150px" }}>
                    <strong>Patient Name</strong>
                  </Typography>
                  <Typography variant="body1">: {patientData.name}</Typography>
                </Box>
                <Box display="flex">
                  <Typography variant="body1" sx={{ minWidth: "150px" }}>
                    <strong>Patient ID</strong>
                  </Typography>
                  <Typography variant="body1">
                    : {patientData.patientID}
                  </Typography>
                </Box>
                {tabIndex === 1 && (
                  <Box display="flex">
                    <Typography variant="body1" sx={{ minWidth: "150px" }}>
                      <strong>Date of Admission</strong>
                    </Typography>
                    <Typography variant="body1">
                      : 7th Sep 2023, 11:10 AM
                    </Typography>
                  </Box>
                )}
                <Box display="flex">
                  <Typography variant="body1" sx={{ minWidth: "150px" }}>
                    <strong>Consultant</strong>
                  </Typography>
                  <Typography variant="body1">
                    : {patientData.consultant}
                  </Typography>
                </Box>
                <Box display="flex">
                  <Typography variant="body1" sx={{ minWidth: "150px" }}>
                    <strong>Department</strong>
                  </Typography>
                  <Typography variant="body1">
                    : {patientData.department}
                  </Typography>
                </Box>
                <Box display="flex">
                  <Typography variant="body1" sx={{ minWidth: "150px" }}>
                    <strong>Address</strong>
                  </Typography>
                  <Typography variant="body1">
                    : {patientData.address}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3}>
                <Box display="flex">
                  <Typography variant="body1" sx={{ minWidth: "130px" }}>
                    <strong>Admission No</strong>
                  </Typography>
                  <Typography variant="body1">
                    : {patientData.admissionNo}
                  </Typography>
                </Box>
                {tabIndex === 1 && (
                  <>
                    <Box display="flex">
                      <Typography variant="body1" sx={{ minWidth: "130px" }}>
                        <strong>Discharge Date</strong>
                      </Typography>
                      <Typography variant="body1">: 1st Aug 2023</Typography>
                    </Box>
                    <Box display="flex">
                      <Typography variant="body1" sx={{ minWidth: "130px" }}>
                        <strong>Admitted Ward</strong>
                      </Typography>
                      <Typography variant="body1">: ICU</Typography>
                    </Box>
                  </>
                )}
                <Box display="flex">
                  <Typography variant="body1" sx={{ minWidth: "130px" }}>
                    <strong>Age / Sex</strong>
                  </Typography>
                  <Typography variant="body1">
                    : {patientData.ageSex}
                  </Typography>
                </Box>
                <Grid item xs={3}>
                  <QRCode value={patientData.id} size={64} />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "10px", whiteSpace: "nowrap" }}
                  >
                    Scan QR code
                  </Typography>
                </Grid>
              </Grid>
              {tabIndex === 2 && (
                <Grid item xs={3}>
                  <Box display="flex" justifyContent="flex-end">
                    <Typography variant="body1">Print </Typography>
                    <PrintIcon sx={{ marginLeft: "8px" }} />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="h6"
          sx={{ backgroundColor: "#64b5f6", color: "white", padding: "8px" }}
        >
          MEDICINE
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Med ID</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  Medicine Name
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Qty</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>HSN Code</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>GST</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicineData.map((med, index) => (
                <TableRow key={index}>
                  <TableCell>{med.medID}</TableCell>
                  <TableCell>{med.medicineName}</TableCell>
                  <TableCell>{med.category}</TableCell>
                  <TableCell>{med.qty}</TableCell>
                  <TableCell>{med.hsnCode}</TableCell>
                  <TableCell>{med.price}</TableCell>
                  <TableCell>{med.gst}</TableCell>
                  <TableCell>{med.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography align="right" sx={{ marginTop: "12px" }}>
          Sub Total:<strong> {subTotal}</strong>
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="h6"
          sx={{ backgroundColor: "#64b5f6", color: "white", padding: "8px" }}
        >
          TESTS
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Test ID</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Test Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Charge</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Qty</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>GST</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testData.map((med, index) => (
                <TableRow key={index}>
                  <TableCell>{med.testID}</TableCell>
                  <TableCell>{med.testName}</TableCell>
                  <TableCell>{med.charge}</TableCell>
                  <TableCell>{med.qty}</TableCell>

                  <TableCell>{med.price}</TableCell>
                  <TableCell>{med.gst}</TableCell>
                  <TableCell>{med.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography align="right" sx={{ marginTop: "12px" }}>
          Sub Total:<strong> 2,124</strong>
        </Typography>

        {tabIndex === 1 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Typography variant="h5" sx={{ color: "#64b5f6", ml: 15 }}>
                  Fee Schedule
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Services</InputLabel>
                  <Select
                    value={selectedService}
                    onChange={handleServiceChange}
                    label="Services"
                  >
                    {serviceOptions.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Units</InputLabel>
                  <Select
                    value={selectedUnits}
                    onChange={handleUnitsChange}
                    label="Units"
                    disabled={!selectedService}
                  >
                    {selectedService &&
                      unitsOptions[selectedService]?.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  onClick={handleAdd}
                  disabled={!selectedService || !selectedUnits}
                >
                  Add
                  <img src={addIcon} alt="" className={styles.img} />
                </Button>
              </Grid>
            </Grid>
          </>
        )}

        {tabIndex === 1 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              sx={{
                backgroundColor: "#64b5f6",
                color: "white",
                padding: "8px",
              }}
            >
              PROCEDURES
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Code</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Particulars
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Rate</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Units</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>GST</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chargesData.map((med, index) => (
                    <TableRow key={index}>
                      <TableCell>{med.code}</TableCell>
                      <TableCell>{med.particulars}</TableCell>
                      <TableCell>{med.rate}</TableCell>
                      <TableCell>{med.units}</TableCell>
                      <TableCell>{med.price}</TableCell>
                      <TableCell>{med.gst}</TableCell>
                      <TableCell>{med.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography align="right" sx={{ marginTop: "12px" }}>
              Sub Total: <strong>15,930</strong>
            </Typography>
          </>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography align="center" sx={{ marginTop: "12px" }}>
          Total Amount :<strong>3, 398.4</strong>
        </Typography>
        <Divider sx={{ my: 2 }} />

        {tabIndex === 2 && (
          <>
            <Paper elevation={3} sx={{ padding: "16px", margin: "16px" }}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                color="#64b5f6"
              >
                Payment Information
              </Typography>
              <Box sx={{ marginBottom: "8px" }}>
                <Typography variant="subtitle1" component="div">
                  Payment Method: <strong>Cash</strong>
                </Typography>
              </Box>
              <Box sx={{ marginBottom: "8px" }}>
                <Typography variant="subtitle1" component="div">
                  Amount Paid: <strong>₹3,398</strong>
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" component="div">
                  Date of Payment: <strong>6/08/2024</strong>
                </Typography>
              </Box>
            </Paper>
            <p className={styles.note}>Note :</p>
          </>
        )}

        {tabIndex !== 2 && (
          <>
            <Grid item>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ ml: 3, mt: 3, borderRadius: "12px" }}
                  onClick={handleClickOpen}
                >
                  Pay Now
                </Button>
              </Stack>
            </Grid>
          </>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="payment-option"
                name="payment-option"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="insurance"
                  control={<Radio />}
                  label="Insurance Claim"
                />
              </RadioGroup>
            </FormControl>

            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: 2,
                mt: 2,
                width: "400px",
              }}
            >
              <Stack spacing={2}>
                <Typography variant="body1">
                  Total Amount: <span>3,398.4</span>
                </Typography>
                <Typography variant="body1">
                  Insurance Claim Amount: 0
                </Typography>
                <Typography variant="body1">
                  <strong>Total Due:</strong> 3,398.4 Rs
                </Typography>
              </Stack>
            </Box>

            <Grid item xs={10} style={{ marginTop: "16px" }}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  label="Payment Method"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="card">Card Payment</MenuItem>
                  <MenuItem value="online">Online Payment</MenuItem>
                  <MenuItem value="other">Card Credit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openPopup} onClose={handleClosePopup}>
          <DialogTitle sx={{ textAlign: "center" }}>
            Submission Successful
          </DialogTitle>
          <DialogContent sx={{ width: "300px" }}>
            <Stack direction="column" alignItems="center" spacing={1}>
              <CheckCircleIcon style={{ color: "green", fontSize: 80 }} />
              <Typography variant="h6" component="p">
                Thank you
              </Typography>
              <Typography component="p">
                Your form has been submitted
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePopup}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default PatientBilling;
