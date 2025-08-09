import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { Phone } from "@mui/icons-material";
import { ChangeEvent, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import apollo from "../../../assets/aplop.png";
import { useState } from "react";
import {
  MedicineData,
  PatientData,
  PatientOrderCompletedProps,
  PharmacyMedicineData,
  PharmacySaleMedicine,
  PharmacySaleTaxInvoice,
  ProcedureData,
  TestData
} from "../../../types";
import PaymentMethodDialog from "../../../component/PaymentMethodDialog";
import { medicineCategory } from "../../../utility/medicine";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useSelector } from "react-redux";
import reception_hospitalBanner from "../../../assets/reception/reception_hospitalBanner.png"

interface IpdInnerTableProps {
  data: PatientData | PatientOrderCompletedProps | PharmacySaleTaxInvoice;
  pharmacyTaxInvoice?: string;
  type: string | undefined;
}
const IpdInnerTable: React.FC<IpdInnerTableProps> = ({
  data,
  pharmacyTaxInvoice,
  type
}) => {
  const user = useSelector(selectCurrentUser);
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("discount");
  const [discount, setDiscount] = useState("10");
  const [reason, setReason] = useState("");
  const [id, setId] = useState("");
  const [insuranceAmount, setInsuranceAmount] = useState("");
  const [payableAmount] = useState(57030.462);
  const [openAddPopUp, setAddPopUp] = useState(false)

  // const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
  //   {}
  // );

  const [openPaymentMethodDialog, setOpenPaymentMethodDialog] = useState(false); // for the payment method dialog
  const handlePay = () => {
    setOpen(false); // Close the first dialog
    setOpenPaymentMethodDialog(true); // Open the payment method dialog
  };

  const onSubmitPaymenthandler = async (
    paymentDetails: Record<string, number>
  ) => {
    console.log("paymentDetails",paymentDetails)
    setOpenPaymentMethodDialog(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };
  const closeAddModal = ()=> setAddPopUp(false)
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const isPharmacyMedicine = (
    item: MedicineData | PharmacyMedicineData | PharmacySaleMedicine
  ): item is PharmacyMedicineData => {
    return (
      (item as PharmacyMedicineData).sellingPrice !== undefined &&
      (item as PharmacyMedicineData).Frequency !== undefined
    );
  };

  const isSalePharmacyMedicine = (
    item: MedicineData | PharmacyMedicineData | PharmacySaleMedicine
  ): item is PharmacySaleMedicine => {
    return (
      (item as PharmacySaleMedicine).totalQuantity !== undefined &&
      (item as PharmacySaleMedicine).sellingPrice !== undefined &&
      (item as PharmacySaleMedicine).quantity !== undefined
    );
  };
  const isPharmacyList = data?.medicinesList?.some((item) =>
    isPharmacyMedicine(item)
  );
  const isSalePharmacyList = data?.medicinesList?.some((item) =>
    isSalePharmacyMedicine(item)
  );

  // const handleCheckboxChange = (code: string) => {
  //   setSelectedItems((prev) => {
  //     const updatedSelection = { ...prev, [code]: !prev[code] };

  //     return updatedSelection;
  //   });
  // };
  const isPatientData = (data: any): data is PatientData => {
    return "procedures" in data && "testList" in data;
  };

  // Update the total amount based on the selected items
  // useEffect(() => {
  //   if (isPatientData(data)) {
  //     const total = Object.keys(selectedItems)
  //       .filter((key) => selectedItems[key])
  //       .reduce((sum, key) => {
  //         const item =
  //           data.procedures.find(
  //             (procedure) => procedure.code.toString() === key
  //           ) ||
  //           data.medicinesList.find(
  //             (medicine) => medicine.id.toString() === key
  //           ) ||
  //           data.testList.find((test) => test.testID.toString() === key);

  //         return item ? sum + item.amount : sum;
  //       }, 0);

  //     setTotalAmount(total);
  //   }
  // }, [selectedItems, data]);
  useEffect(() => {
    if (isPatientData(data)) {
      const total = [
        ...data.procedures,
        ...data.medicinesList,
        ...data.testList
      ].reduce((sum, item) => sum + item.amount, 0);

      setTotalAmount(total);
    }
  }, [data]);

  const handlePaymentDetailsUpdate = (due: number, paying: number) => {
    console.log(due, paying);
  };

  const medicines: (MedicineData | PharmacyMedicineData)[] =
    "procedures" in data
      ? (data.medicinesList as MedicineData[])
      : (data.medicinesList as PharmacyMedicineData[]);

  const grandTotal = medicines?.reduce<number>((acc, item) => {
    const quantity = isPharmacyMedicine(item)
      ? Number(item.updatedQuantity)
      : item.qty;

    const gst =
      isPharmacyMedicine(item) || isSalePharmacyMedicine(item)
        ? (Number(item.gst) / 100) * item.sellingPrice
        : (item.gst * quantity) / 100;

    const amount =
      "amount" in item
        ? item.amount
        : isPharmacyMedicine(item)
        ? item.sellingPrice * quantity
        : 0;

    return (
      acc +
      (gst +
        (isSalePharmacyMedicine(item)
          ? item.sellingPrice * item.quantity
          : amount))
    );
  }, 0);

  // Create a reverse mapping
  const medicineCategoryReverse: Record<number, string> = Object.fromEntries(
    Object.entries(medicineCategory).map(([key, value]) => [value, key])
  );


  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchDoctorNames = async () => {
      const names: Record<number, string> = {};
      await Promise.all(
        data.medicinesList.map(async (order) => {
          if ("userID" in order && order.userID !== undefined) {
            const name = await doctorData(order.userID);
            if (name) names[order.userID] = name;
          }
        })
      );
      setDoctorNames(names);
    };

   
      fetchDoctorNames();
   
  }, [data]);

  const doctorData = async (userID: number) => {
    try {
      const response = await authFetch(`user/${userID}`, user.token);
      if (response.message === "success" && response.user) {
        const doctorName = `${response.user.firstName} ${response.user.lastName}`;
        return doctorName;
      }
    } catch (error) {
      console.error("Error fetching doctor name:", error);
    }
  };


  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          margin:0,
        }}
      >
        {Array.isArray(data.medicinesList) &&
          data.medicinesList.some(
            (item) =>
              !(isPharmacyMedicine(item) || isSalePharmacyMedicine(item))
          ) && (
            <>
              <div style={{ display: "flex", justifyContent: "center", }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    marginTop: "16px"
                  }}
                >
                  {/* Logo and Address */}
                  <Box>
                    <img
                      src={apollo}
                      alt="Apollo Logo"
                      style={{
                        maxWidth: "120px",
                        marginBottom: "8px",
                        marginRight: "20px"
                      }}
                    />
                  </Box>

                  {/* Heading */}
                  <Box sx={{ textAlign: "center", marginRight: "20px" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        color: "#b2caea"
                      }}
                    >
                      APOLLO HOSPITALS
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "#333",
                        lineHeight: "1.7"
                      }}
                    >
                      Opposite IIMB, 154/11, Amaldobhavi Nagar, Panduranga
                      Nagar,
                      <br />
                      Bangalore - 560076 (India)
                      <br />
                      Tel.: (+91)-80-26304050 / 26304051 Fax: (+91)-80-41463151
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                      backgroundColor: "#d32f2f",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      alignSelf: "flex-start"
                    }}
                  >
                    EMERGENCY
                    <Phone style={{ color: "#000" }} />
                    1066
                  </Typography>
                  {/* Print Button */}
                </Box>
                <IconButton sx={{ alignSelf: "center", marginLeft: "20px" }}>
                  <PrintIcon sx={{ fontSize: "34px", color: "#333" }} />
                </IconButton>
              </div>
              {/* Patient Details */}
              <Box
                sx={{
                  padding: "16px",
                  backgroundColor: "white",
                  marginLeft: "25px",
                  marginTop: "16px",
                  textAlign: "left"
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "black",

                    fontWeight: "bold"
                  }}
                >
                  Dr. Dyapa Sindu (MBBS, Ms)
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",

                    fontWeight: "bold",
                    color: "black"
                  }}
                >
                  In patient bill
                </Typography>

                <Box
                  sx={{
                    marginTop: "16px",
                    border: "1px solid #000",
                    width: "90%"
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1px 1fr", // Two columns with a divider in between
                      alignItems: "start",
                      gap: "16px"
                    }}
                  >
                    <Box sx={{ padding: "16px" }}>
                      <Typography
                        sx={{ fontWeight: "bold", paddingBottom: "6px" }}
                      >
                        PATIENT DETAILS
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "bold", paddingBottom: "6px" }}
                      >
                        Sravan Kumar V
                      </Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        A2 Nagesan Nagar
                      </Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Vadular
                      </Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cuddalore Taluk
                      </Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Tamil Nadu
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: "1px",
                        backgroundColor: "#000",
                        height: "100%", // Adjusts based on the content
                        marginX: "5px" // Spacing between the line and content
                      }}
                    />
                    <Box sx={{ padding: "16px" }}>
                      <Typography>
                        IP No: <strong>97101</strong>
                      </Typography>
                      <Typography>
                        ID No: <strong>0000246611</strong>
                      </Typography>
                      <Typography>
                        Bill No: <strong>ICR33504</strong>
                      </Typography>
                      <Typography>
                        Bill Dt/Time: <strong>13-Jan-2013 10:06 AM</strong>
                      </Typography>
                      <Typography>
                        Admission Dt/Time: <strong>10-Jan-2014 7:22 AM</strong>
                      </Typography>
                      <Typography>
                        Discharge Dt/Time: <strong>13-Jan-2014 10:06 AM</strong>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}

        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 1,
            overflow: "hidden",
            margin: "0 auto",
            width: "100%"
          }}
        >
         {!pharmacyTaxInvoice &&  (
          <Typography
          variant="h6"
          color="white"
          align="left"
          fontWeight="bold"
          sx={{ backgroundColor: "#1977f3", padding: 2 }}
        >
          MEDICINES
        </Typography>

         )} 
          {/* Header */}
          {/* <Box sx={{ backgroundColor: "#1977f3", padding: 2 }}>
            <Typography
              variant="h6"
              color="white"
              align="left"
              fontWeight="bold"
            >
              {type === "medicine"?"MEDICINE":"Tests"}
            </Typography>
          </Box> */}
          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {Array.isArray(data.medicinesList) &&
                    data.medicinesList.some(
                      (item) =>
                        !(
                          isPharmacyMedicine(item) ||
                          isSalePharmacyMedicine(item)
                        )
                    ) && <TableCell></TableCell>}

                  {type === "medicine" && (
                    <>
                      <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Med ID
                      </TableCell>
                      <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Medicine Name
                      </TableCell>
                      <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Category
                      </TableCell>
                      <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Qty
                      </TableCell>
                      <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        HSN Code
                      </TableCell>
                      <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Price
                      </TableCell>
                      <TableCell style ={{fontWeight:"bold",fontSize:"16px"}} >
                        GST
                      </TableCell>
                      <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Amount
                      </TableCell>
                      {data.medicinesList.some((item) => "userID" in item && item.userID !== undefined) && (
      <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>Doctor Name</TableCell>
    )}
                    </>
                  )}
                  {type === "test" && (
                    <>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Test ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Test Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Charges</b>
                      </TableCell>
                      <TableCell>
                        <b>GST</b>
                      </TableCell>
                      <TableCell>
                        <b>Amount</b>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {("procedures" in data
                  ? (data.medicinesList as MedicineData[])
                  : (data.medicinesList as PharmacyMedicineData[])
                )?.map((item) => {
                  // Calculate the quantity (Frequency * daysCount) only for PharmacyMedicineData
                  const quantity = isPharmacyMedicine(item)
                    ? item.updatedQuantity ?? 1
                    : item.qty ?? 1;

                  // Calculate GST (18% of total price) for PharmacyMedicineData
                  const gst =
                    isPharmacyMedicine(item) || isSalePharmacyMedicine(item)
                      ? Number(item.gst)
                      : (item.gst * quantity) / 100;

                  // Calculate amount if it exists, else calculate based on price * quantity
                  const amount =
                    "amount" in item
                      ? item.amount
                      : isPharmacyMedicine(item)
                      ? item.sellingPrice * (item.updatedQuantity ?? 1)
                      : 0;

                  const calGst =
                    isPharmacyMedicine(item) || isSalePharmacyMedicine(item)
                      ? (Number(item.gst) / 100) * item.sellingPrice
                      : (item.gst * quantity) / 100;
                  // Total amount = GST + Amount
                  const totalAmount =
                    calGst +
                    (isSalePharmacyMedicine(item)
                      ? item.sellingPrice * item.quantity
                      : amount);

                  return (
                    <TableRow key={item.id}>
                      {/* {!isPharmacyMedicine(item) &&
                        !isSalePharmacyMedicine(item) && (
                          <TableCell>
                            <Checkbox
                              checked={!!selectedItems[item.id]}
                              onChange={() =>
                                handleCheckboxChange(item.id.toString())
                              }
                            />
                          </TableCell>
                        )} */}
                       {!pharmacyTaxInvoice && <TableCell></TableCell>}

                      {type === "medicine" && (
                        <>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            {"medicineName" in item
                              ? item.medicineName
                              : item.name}
                          </TableCell>
                          <TableCell>
                            {pharmacyTaxInvoice && "medicineType" in item
                              ? medicineCategoryReverse[
                                  Number(item.medicineType)
                                ]
                              : item.category}
                          </TableCell>

                          <TableCell>
                            {"updatedQuantity" in item
                              ? item.updatedQuantity
                              : quantity}
                          </TableCell>
                          <TableCell>{item.hsn}</TableCell>
                          <TableCell>
                            {isPharmacyMedicine(item) ||
                            isSalePharmacyMedicine(item)
                              ? item.sellingPrice
                              : item.price}
                          </TableCell>
                          <TableCell>{gst}%</TableCell>
                          <TableCell>{totalAmount.toFixed(2)}</TableCell>
                          
                          <TableCell>{doctorNames[(item as PharmacyMedicineData).userID]}</TableCell>

                        </>
                      )}

                      {type === "test" && (
                        <>
                          <TableCell>1</TableCell>
                          <TableCell>CT0876==</TableCell>
                          <TableCell>CT Scan</TableCell>

                          <TableCell>5000</TableCell>
                          <TableCell>18%</TableCell>
                          <TableCell>5900</TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Typography
          variant="h6"
          sx={{
            margin: "15px",
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
            fontWeight: "bold"
          }}
        >
          {isPharmacyList || isSalePharmacyList ? (
            <div style = {{display:"flex", justifyContent:"space-between",width:"30%", fontWeight:"bold",fontSize:"18px"}}>
              Total  <strong style ={{fontWeight:"bold", marginLeft:"30px"}}>{grandTotal.toFixed(2)}</strong>
            </div>
          ) : (
            <>
              <span style ={{fontSize:"16px"}}>Sub Total: <strong> 590.18</strong> </span>
            </>
          )}
        </Typography>

        {Array.isArray(data.medicinesList) &&
          data.medicinesList.some(
            (item) =>
              !(isPharmacyMedicine(item) || isSalePharmacyMedicine(item))
          ) && (
            <>
              {/* Test Table */}
              <Box
                sx={{
                  marginTop: 2,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  overflow: "hidden",
                  margin: "0 auto",
                  width: "100%"
                }}
              >
                <Typography
                  variant="h6"
                  color="white"
                  align="left"
                  fontWeight="bold"
                  sx={{ backgroundColor: "#1977f3", padding: 2 }}
                >
                  TESTS
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}} >
                          Test ID
                        </TableCell>
                        <TableCell style= {{fontWeight:"bold",fontSize:"16px"}}>
                        Test Name
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Charge
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                          Qty
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Price
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        GST
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {"testList" in data &&
                        data?.testList.map((item: TestData) => (
                          <TableRow key={item.testID}>
                            {/* <TableCell>
                              <Checkbox
                                checked={!!selectedItems[item.testID]}
                                onChange={() =>
                                  handleCheckboxChange(item.testID.toString())
                                }
                              />
                            </TableCell> */}
                            <TableCell></TableCell>
                            <TableCell>{item.testID}</TableCell>
                            <TableCell>{item.testName}</TableCell>
                            <TableCell>{item.charge}</TableCell>
                            <TableCell>{item.qty}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.gst}</TableCell>
                            <TableCell>{item.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  margin: "15px",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "90%",
                  gap: 1
                }}
              >
                Sub Total: <strong> 4,013.18</strong>
              </Typography>
              <hr
                style={{
                  border: "none",
                  borderTop: "2px solid #ccc",

                  width: "100%"
                }}
              />

              <Box
                sx={{
                  margin: "15px",
                  width: "90%",
                  display: "flex",
                  alignItems: "center",
                  gap: 3
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: "#000000", marginBottom: 2, fontSize:"24px" }}
                >
                  Fee Schedule
                </Typography>
                <Box sx={{ alignItems: "center", gap: 2 }}>
                  {/* Dropdown to select services */}
                  <TextField
                    select
                    label="Service"
                    variant="outlined"
                    sx={{ minWidth: 500, marginRight: 2 }}
                  >
                    <MenuItem value="" disabled>
                      Select services charges
                    </MenuItem>
                    <MenuItem value="Ventilator Use Fee">
                      Ventilator Use Fee
                    </MenuItem>
                    <MenuItem value="Specialist Consultation fee">
                      Specialist Consultation fee
                    </MenuItem>
                    <MenuItem value="Oxygen cylinders">
                      Oxygen cylinders
                    </MenuItem>
                  </TextField>

                  {/* TextField for units */}
                  {/* <TextField
                    label="Enter Units"
                    type="number"
                    variant="outlined"
                    sx={{ width: 140, marginRight: 2 }}
                    inputProps={{ min: 0 }}
                  /> */}

                  {/* Add button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>setAddPopUp(true)}
                    sx={{
                      backgroundColor: "#3498db",
                      textTransform: "none",
                      marginTop: 1
                    }}
                  >
                    + Add
                  </Button>
                </Box>
              </Box>
            </>
          )}

        {Array.isArray(data.medicinesList) &&
          data.medicinesList.some(
            (item) =>
              !(isPharmacyMedicine(item) || isSalePharmacyMedicine(item))
          ) && (
            <>
              {/* Header for Procedures */}
              <Box
                sx={{
                  marginTop: 2,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  overflow: "hidden"
                }}
              >
                <Typography
                  variant="h6"
                  color="white"
                  align="left"
                  fontWeight="bold"
                  sx={{ backgroundColor: "#1977f3", padding: 2 }}
                >
                  PROCEDURES
                </Typography>
                {/* Procedure Table */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Code
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Particulars
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Rate
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Units
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Price
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        GST
                        </TableCell>
                        <TableCell style ={{fontWeight:"bold",fontSize:"16px"}}>
                        Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {"procedures" in data &&
                        data?.procedures?.map((item: ProcedureData) => (
                          <TableRow key={item.code}>
                            {/* <TableCell>
                              <Checkbox
                                checked={!!selectedItems[item.code]}
                                onChange={() =>
                                  handleCheckboxChange(item.code.toString())
                                }
                              />
                            </TableCell> */}
                            <TableCell></TableCell>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.particulars}</TableCell>
                            <TableCell>{item.rate}</TableCell>
                            <TableCell>{item.units}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.gst}</TableCell>
                            <TableCell>{item.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Typography
                variant="subtitle1"
                sx={{
                  margin: "15px",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "90%",
                  gap: 1
                }}
              >
                Sub Total: <strong> 1,638.18</strong>
              </Typography>
              {/* <hr
                style={{
                  border: "none",
                  borderTop: "2px solid #ccc",

                  width: "100%"
                }}
              /> */}
              <Typography
                variant="subtitle1"
                sx={{
                  margin: "10px",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "90%",
                  fontSize: "18px",
                  gap: 2
                }}
              >
                Total Amount{" "}
                <Box sx={{ marginLeft: "150px", fontSize: "20px" }}>
                  <strong>52,345.60</strong>
                </Box>
              </Typography>
              {/* <hr
                style={{
                  border: "none",
                  borderTop: "2px solid #ccc",

                  width: "100%"
                }}
              /> */}
              <div style = {{border :"1px solid #000", display:"flex", alignItems:"center", height:"60px"}}>
                <h3 style = {{fontWeight:"bold"}}>Total in words : </h3>
                <h3>{}</h3>
              </div>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 6,
                  marginTop: 2,
                  marginRight: 5
                }}
              >
                <Button
                  
                  color="primary"
                  sx={{ textTransform: "none", borderRadius: "20px" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none", borderRadius: "20px", width:"100px" }}
                  onClick={handleOpen}
                >
                  Pay
                </Button>
              </Box>
            </>
          )}

        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle
            sx={{ textAlign: "center", color: "#3498db", position: "relative" }}
          >
            Total Billing
            {/* Close icon positioned at the top right */}
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: "8px",
                right: "8px"
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            {/* Radio Buttons for Insurance or Discount */}
            <FormControl component="fieldset" sx={{ marginTop: "20px" }}>
              <RadioGroup
                row
                defaultValue="discount"
                sx={{ justifyContent: "center" }}
                value={paymentMethod}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="insurance"
                  control={<Radio />}
                  label="Insurance"
                />
                <FormControlLabel
                  value="discount"
                  control={<Radio />}
                  label="Discount"
                />
              </RadioGroup>
            </FormControl>

            {/* Sub total */}
            <Typography variant="body1" sx={{ marginTop: "10px" }}>
              Sub total: 53700.85
            </Typography>

            {/* SGST */}
            <Typography variant="body1" sx={{ marginTop: "10px" }}>
              SGST: 4833.07
            </Typography>

            {/* CGST */}
            <Typography variant="body1" sx={{ marginTop: "10px" }}>
              CGST: 4833.07
            </Typography>

            {/* Total Charges */}
            <Typography variant="body1" sx={{ marginTop: "10px" }}>
              Total Charges: 63367.18
            </Typography>

            {/* Discount % */}
            <TextField
              fullWidth
              label="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              type="number"
              InputProps={{
                endAdornment: <span>%</span>
              }}
              sx={{ marginTop: "10px" }}
            />
            {paymentMethod === "discount" && (
              <>
                {/* Grid container to display Reason and ID in one row */}
                <Grid container spacing={1} sx={{ marginTop: "10px" }}>
                  <Grid item xs={6}>
                    {/* Reason Field */}
                    <TextField
                      fullWidth
                      label="Reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    {/* ID Field */}
                    <TextField
                      fullWidth
                      label="ID"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {paymentMethod === "insurance" && (
              <>
                {/* Insurance Amount Field */}
                <TextField
                  fullWidth
                  label="Insurance Amount"
                  value={insuranceAmount}
                  onChange={(e) => setInsuranceAmount(e.target.value)}
                  sx={{ marginTop: "10px" }}
                />
              </>
            )}

            {/* Total Payable Amount */}
            <Typography variant="body1" sx={{ marginTop: "20px" }}>
              Total payable amount: {payableAmount.toFixed(2)}
            </Typography>
          </DialogContent>

          {/* Dialog Actions (Cancel and Pay buttons) */}
          <DialogActions sx={{ justifyContent: "center", paddingBottom: 3 }}>
            <Button
              variant="contained"
              color="success"
              sx={{ borderRadius: "20px" }}
              onClick={handlePay}
            >
              Pay
            </Button>
            
          </DialogActions>
        </Dialog>

       {/* Add pop up  */}
        <Dialog open = {openAddPopUp} onClose={closeAddModal}  sx = {{borderRadius:"14px"}}>
          <div style = {{display:"flex", flexDirection:"column", alignItems:"center", width:"500px", padding:"20px"}}>
            <h3 style ={{fontWeight:"600"}}>Other Services</h3>
            <img src = {reception_hospitalBanner} alt = "hospital banner" style ={{width:"240px", marginBottom:"20px"}}/> 
            <TextField label = "Name of the Service"  fullWidth style ={{padding:"8px", borderRadius:"15px"}}/>
            <TextField label = "Units" type = "number" style ={{padding:"8px"}} fullWidth /> 
            <TextField label = "Amount" type ="number" style ={{padding:"8px"}} fullWidth />
            <div style = {{width:"100%", display:"flex", justifyContent:"flex-end", marginTop:"20px"}}>
              <Button  
                  color="primary"
                  sx={{ textTransform: "none", borderRadius: "20px" }}
                  onClick={closeAddModal}
              >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none", borderRadius: "20px",marginLeft:"25px"  }}
                >
                  submit
                </Button>
            </div>
          </div>

        </Dialog>

        {openPaymentMethodDialog && (
          <PaymentMethodDialog
            open={openPaymentMethodDialog}
            onClose={setOpenPaymentMethodDialog}
            onSubmitPaymenthandler={onSubmitPaymenthandler}
            total={Number(totalAmount)}
            amount={Number(totalAmount)}
            onPaymentUpdate={handlePaymentDetailsUpdate}
          />
        )}
      </div>
    </>
  );
};

export default IpdInnerTable;
