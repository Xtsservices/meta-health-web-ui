import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import styles from "./InnerTable.module.scss";
import { useState, useEffect } from "react";
import { authPost } from "../../../axios/useAuthPost";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setError, setSuccess } from "../../../store/error/error.action";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentMethodDialog from "../../../component/PaymentMethodDialog";
import { authFetch } from "../../../axios/useAuthFetch";
import {
  AlertTestList,
  medicineCategory,
  MedicineList,
  PharmacyOrder,
} from "../../../utility/medicine";
import { CheckCircle } from "@mui/icons-material";
import { Typography, Chip } from "@mui/material";
import MedicineTakenByImage from "../../../assets/pharmacy/pharmacyBanners/MedicineTakenByImage.png"
import rejectpopup from "../../../assets/pharmacy/pharmacyBanners/rejectpopup.png"

interface InnerTableProps {
  patientTimeLineID: number;
  data: MedicineList[] | TestList[] | AlertTestList[];
  isButton: boolean;
  department?: string;
  pType?: number;
  alertFrom?: string;
  rejectedReason?:string;
  sale?: string;
  isRejectReason?: string;
  patientOrderPay?: string;
  patientData?: PharmacyOrder;
  paidAmount?: string;
  patientOrderOpd?: string;
  labAlert?:string;
  labBilling?: boolean;
  dueAmount?:string;
  alertRejectedTab?: string;
  reception?:string;
}
interface NurseTypeProps {
  id: number | null;
  departmentID: number | null;
  phoneNo: string;
  firstName: string;
  lastName: string;
}

interface TestList {
  id: number | string;
  testName: string;
  charge: number;
  qty: number;
  price: number;
  gst: number;
  amount: number;
  datetime?:string;
}

export default function   InnerTable({
  patientTimeLineID,
  data = [],
  isButton,
  department,
  pType,
  alertFrom,
  sale,
  patientOrderPay,
  paidAmount,
  patientOrderOpd,
  isRejectReason,
  labAlert,
  labBilling,
  dueAmount,
  rejectedReason,
  alertRejectedTab,
  reception,
}: InnerTableProps) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPayment, setIsPayment] = useState<boolean>(false);
  const [nurses, setNurses] = useState<NurseTypeProps[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>("");
  const [discountReasonID, setDiscountReasonID] = useState<string>("");
  const [tableData] = useState<MedicineList[] | TestList[] | AlertTestList[]>(
    data || []
  );
  const [decreasedQuantities, setDecreasedQuantities] = useState<{
    [key: number]: boolean;
  }>({});
  const [reasons, setReasons] = useState<{ [key: string]: string }>({});

  const [rejectReason, setRejectReason] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation()
  const path = location.pathname
  const module = path.includes("pharmacy")? "Medicine": "Lab";

  const isLabDepartment = department?.includes("Lab");
  const [isNurseEntered, setIsNurseEntered] = useState<NurseTypeProps>({
    id: null,
    departmentID: null,
    phoneNo: "",
    firstName: "",
    lastName: "",
  });

  const [totalDue, setTotalDue] = useState(0);

  const [totalPaying, setTotalPaying] = useState(0);

  useEffect(() => {
    const getAllNurses = async () => {
      const response = await authFetch(
        `/doctor/${user.hospitalID}/getAllNurse`,
        user.token
      );
      if (response.message == "success") {
        setNurses(response.data);
      }
    };

    if (user.hospitalID && user.token) {
      getAllNurses();
    }
  }, [user.hospitalID, user.token]);

  const onSubmitPaymenthandler = async (
    paymentDetails: Record<string, number>
  ) => {
    let response ;
    if(module === "Medicine") {
      response = await authPost(
        `/medicineInventoryPatientsOrder/${
          user.hospitalID
        }/${"payment"}/${patientTimeLineID}/updatePatientOrderStatus`,
        {
          paymentMethod: paymentDetails,
          discount: {
            discount: discount,
            discountReason: discountReason,
            discountReasonID: discountReasonID,
          },
          dueAmount: totalDue, // Pass the due amount
  
          paidAmount: totalPaying, // Pass the paid amount
          totalAmount: discountedTotal.toFixed(2),
  
          // medicineList: tableData,
        },
        user.token
      );
       }else{
        response = await authPost(
          `/test/${user.roleName}/${
            user.hospitalID
          }/${patientTimeLineID}/updateTestPaymentDetails`,
          {
            paymentMethod: paymentDetails,
            discount: {
              discount: discount,
              discountReason: discountReason,
              discountReasonID: discountReasonID,
            },
            dueAmount: totalDue, 
    
            paidAmount: totalPaying, 
            totalAmount: discountedTotal.toFixed(2),
       
          },
          user.token
        );

       }

   

    if (response.status === 200) {
      navigate("../");
      dispatch(setSuccess(response.message));
    } else if (response.status !== 200) {
      dispatch(setError(response.message));
    } else {
      dispatch(setError("Something went wrong"));
    }
  };

  //TODO:dont remove this
  // const OnNurseSelected = async () => {
  //   await authPost(
  //     `/medicineInventoryPatientsOrder/${
  //       user.hospitalID
  //     }/${"rejected"}/${patientTimeLineID}/updatePatientOrderStatus`,
  //     {},
  //     user.token
  //   );
  // };

  const RejectHandler = async () => {
   
    if (!rejectReason.trim()) {
      dispatch(setError("Please Enter Reject Reason "));
      return;
    }

    let response;
    if(module === "Medicine") {
       response = await authPost(
        `/medicineInventoryPatientsOrder/${
          user.hospitalID
        }/${"rejected"}/${patientTimeLineID}/updatePatientOrderStatus`,
        { rejectReason },
        user.token
      );
    }else{
      response = await authPost(`/test/${user.roleName}/${user.hospitalID}/${"rejected"}/${patientTimeLineID}`,  { rejectReason },
        user.token)
    }
  
    if (response.status === 200) {
      navigate("../");
      dispatch(setSuccess(response.message));
    } else if (response.status === 201) {
      navigate("../");
      dispatch(setSuccess("Order Rejected"));
    } else {
      dispatch(setError(response.message));
    }
  };

  const AcceptHandler = async () => {
    if (!labAlert && pType !== 1 && isNurseEntered.id == null) {
      dispatch(setError("Nurse not added"));
      return;
    }
    
    let response;
    if(module === "Medicine") {
      const requestBody: any = {};

      // Only include reasons if there are any
      if (Object.keys(reasons).length > 0) {
        requestBody.reasons = reasons;
      }
      requestBody.updatedQuantities = quantities;
      requestBody.nurseID = isNurseEntered.id;
       response = await authPost(
        `/medicineInventoryPatientsOrder/${
          user.hospitalID
        }/${"completed"}/${patientTimeLineID}/updatePatientOrderStatus`,
        requestBody,
        user.token
      );

    }else{
      response = await authPost(`/test/${user.roleName}/${user.hospitalID}/${"approved"}/${patientTimeLineID}`,  {},
        user.token)
    }

    if (response.status === 200) {
      navigate("../");
      dispatch(setSuccess(response.message));
    } else if (response.status === 201) {
      navigate("../");
      dispatch(setSuccess("Order Completed"));
    } else {
      dispatch(setError("Something went wrong"));
    }
  };

  const [quantities, setQuantities] = useState<any>({}); // To store the quantity for each row
  const [grossAmount, setGrossAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState("0.00");

  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});

  const handleDecrement = (id: number, quantity: number) => {
    if (quantity > 1) {
      setQuantities((prev: any) => {
        const updatedQuantities = { ...prev, [id]: quantity - 1 };

        const row = (tableData as MedicineList[]).find(
          (row) => row?.medId === id
        );

        // Ensure the row is found and it's of type MedicineList
        if (row && "Frequency" in row && "daysCount" in row) {
          const initialQuantity = row.Frequency * row.daysCount;
          setDecreasedQuantities((prev) => ({
            ...prev,
            [id]: updatedQuantities[id] < initialQuantity,
          }));
        }
        return updatedQuantities;
      });
    }
  };

  const handleIncrement = (id: number, quantity: number) => {
    setQuantities((prev: any) => {
      const updatedQuantities = { ...prev, [id]: quantity + 1 };
      return updatedQuantities;
    });
  };

  // Handle reason change
  const handleReasonChange = (medicineName: number, value: string) => {
    setReasons((prev) => ({ ...prev, [medicineName]: value }));
  };

  // Handle reject action with reason

  const handleRejectClick = () => {
    setOpenDialog(true);
  };

  // Handle change in reject reason
  const handleRejectReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRejectReason(e.target.value);
  };

  const handlePaymentDetailsUpdate = (due: number, paying: number) => {
    setTotalDue(due);
    setTotalPaying(paying);
  };

  const groupedData = (tableData as MedicineList[]).reduce(
    (acc: Record<string, MedicineList[]>, item: MedicineList) => {
      if (!("datetime" in item) || !item.datetime) return acc; // Skip items without datetime

      const key = item.datetime.substring(0, 19); // Ensure key is always a string

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);

      return acc;
    },
    {} as Record<string, MedicineList[]>
  );

  const groupedTests = (tableData as AlertTestList[]).reduce(
    (acc: Record<string, AlertTestList[]>, item) => {
      if (!item.addedOn) return acc;
  
      const key = item.addedOn.substring(0, 19);
  
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      console.log(acc,"groupedtest")
      return acc;
    },
    {} as Record<string, AlertTestList[]>
  );

  

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatTime(isoString: string) {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${String(hours).padStart(2, "0")}-${minutes}${amPm}`;
  }

  const formatDateTest = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", { 
      timeZone: "Asia/Kolkata", 
      year: "numeric", 
      month: "2-digit", 
      day: "2-digit", 
      // hour: "2-digit", 
      // minute: "2-digit", 
      // second: "2-digit", 
      // hour12: true 
    });
  };

  useEffect(() => {
    const fetchDoctorNames = async (functionName:any) => {
      const names: Record<number, string> = {};
      console.log(functionName, "names_get")

      for (const medicines of Object.values(functionName)) {
        for (const row of medicines as MedicineList[]) {
          if (row.userID && !names[row.userID]) {
            const name = await doctorData(row.userID);
            if (name) names[row.userID] = name;
          }
        }
      }

      setDoctorNames(names);
    };
    if ((patientOrderPay || pType==1 || pType==21) && (pType===2 || pType===3 || pType==1 || pType==21) || reception) {
      const functionName = module === "Lab"? groupedTests:groupedData
      fetchDoctorNames(functionName);
    }
  }, []);
  

  // useEffect(() => {
  //   const fetchDoctorNames = async () => {
  //     const names: Record<number, string> = {};

  //     // for (const medicines of Object.values(tableData)) {
  //       for (const row of tableData as MedicineList[]) {
  //         if (row.userID && !names[row.userID]) {
  //           const name = await doctorData(row.userID);
  //           console.log(name, "opd data")
  //           if (name) names[row.userID] = name;
  //         }
  //       }
      

  //     setDoctorNames(names);
  //   };


  //   if (patientOrderPay) {
  //     fetchDoctorNames();
  //   }
  // }, []);
 
  const doctorData = async (userID: number) => {
    try {
      const response = await authFetch(`user/${userID}`, user.token);
      if (response.message === "success" && response.user) {
       
        const doctorName = `${response.user.firstName} ${response.user.lastName}`;
        console.log(doctorName, "name")
        return doctorName;
      }
    } catch (error) {
      console.error("Error fetching doctor name:", error);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [groupedData, discount]);
  console.log(groupedData,"grouped_date")

  const calculateTotals = () => {
    let total = 0;
    let totalGst = 0;

    // Loop through groupedData to calculate totals
    Object.values(groupedData).forEach((medicines: MedicineList[]) => {
      medicines.forEach((row) => {
        const quantity = row.updatedQuantity ?? 0;
        const price = row.sellingPrice ?? 0;
        const gstRate = row.gst ?? 18; // Default GST is 18%

        const itemTotal = quantity * price;
        const itemGst = (itemTotal * gstRate) / 100;

        total += itemTotal;
        totalGst += itemGst;
      });
    });

    let testTotal = 0;
  let testTotalGst = 0;

  // Loop through groupedTests to calculate totals for Tests
  Object.values(groupedTests).forEach((tests: AlertTestList[]) => {
    tests.forEach((test) => {
      const price = test.testPrice ?? 0;
      const gstRate = test.gst ?? 18; // Assuming GST is also applicable to tests

      const itemTotal = price;
      const itemGst = (itemTotal * gstRate) / 100;

      testTotal += itemTotal;
      testTotalGst += itemGst;
    });
  });
    // Update state with calculated values
    // setGrossAmount(total);
    // setGstAmount(totalGst.toFixed(2));

    // // Apply discount if applicable
    // const totalWithGst = total + totalGst;
    // const discountedTotal = totalWithGst * (1 - discount / 100);
    // setDiscountedTotal(discountedTotal);

    const grossAmount = total + testTotal;
  const gstAmount = totalGst + testTotalGst;

  setGrossAmount(grossAmount);
  setGstAmount(gstAmount.toFixed(2));


  // Apply discount if applicable
  const totalWithGst = grossAmount + gstAmount;
  const discountedTotal = totalWithGst * (1 - discount / 100);

  setDiscountedTotal(discountedTotal);
  };

  const getNurseName = (nurseID: number | null) => {
    const nurse = nurses.find((n) => n.id === nurseID);
    return nurse ? `${nurse.firstName} ${nurse.lastName}` : "";
  };

  // Create a reverse mapping
  const medicineCategoryReverse: Record<number, string> = Object.fromEntries(
    Object.entries(medicineCategory).map(([key, value]) => [value, key])
  );

  

  const renderPaymentDetails = ()=> (
    <div style ={{background:"#F8FAFE", padding:"10px", marginTop:'15px'}}>
          <h2 style = {{textAlign:"left", marginLeft:"20px"}}>Payment Details</h2>
          <Grid container spacing={2} marginTop={2} marginLeft={1}>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Discount"
                type="number"
                placeholder="Enter discount %"
                value={discount===0?"":discount}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= 100) {
                    setDiscount(value);
                  } else {
                    setDiscount(100);
                  }
                }}
                inputProps={{ min: 0}}
              />
            </Grid>
            {}
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Name"
                placeholder="Enter"
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                sx={{ marginLeft: "1rem" }}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="ID Number"
                placeholder="Enter"
                value={discountReasonID}
                onChange={(e) => setDiscountReasonID(e.target.value)}
                sx={{ marginLeft: "1rem" }}
              />
            </Grid>
                
            <h4
              className={styles.h4}
              style={{ paddingLeft: "10rem", fontWeight: "600",fontSize:"16px" }}
            >
              Gross : {grossAmount} ₹
            </h4>
            <h4
              className={styles.h4}
              style={{ paddingLeft: "5rem", fontWeight: "600",fontSize:"16px" }}
            >
              Gst : {gstAmount} ₹
            </h4>
            <div>
              <h4
                className={styles.h4}
                style={{ paddingLeft: "7rem", fontWeight: "bold",fontSize:"17px" }}
              >
                Total :{discountedTotal.toFixed(2)} ₹
              </h4>
              {pType !== 1 && (
                <>
                  <h4
                    className={styles.h4}
                    style={{
                      paddingLeft: "7rem",
                      fontWeight: "bold",
                      marginBottom: "0", fontSize:"17px" // Remove bottom margin
                    }}
                  >
                    Paid : {parseFloat(paidAmount ?? "0").toFixed(2)} ₹
                  </h4>
                  <h4
                    className={styles.h4}
                    style={{ paddingLeft: "7rem", fontWeight: "bold",fontSize:"17px" }}
                  >
                    Due :{" "}
                    {(discountedTotal - parseFloat(paidAmount ?? "0")).toFixed(
                      2
                    )} ₹
                  </h4>
                </>
              )}
            </div>
          </Grid>
        </div>
  )

  console.log(doctorNames,"doctor_names")

  return (
    <>
      <TableContainer component={Paper} >
        <Table  aria-label="simple table" sx={{
          minWidth: 650,
                  border: "none", // Light gray border
                  "&:last-child td, &:last-child th": { borderBottom: "none" }, // Removes border from last row
                }}> 
          <TableHead>
          {(isLabDepartment || labAlert || rejectedReason) ? (
              <TableRow style = {{borderBottom:"0.5px solid #9B9B9B"}}>
                <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>S.NO</TableCell>
                <TableCell style={{ fontWeight: "bold",fontSize:"16px" }} align="center">Test ID</TableCell>
                <TableCell style={{ fontWeight: "bold",fontSize:"16px" }} > <span style = {{marginLeft:"100px",fontWeight: "bold",fontSize:"16px" }}>Test Name </span></TableCell>

                {(labAlert || rejectedReason) && (
                  <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>HSN Code</TableCell>
               
                )}

                {/* {labBilling && (
                  <>
                    <TableCell style={{ fontWeight: "bold" }}>GST</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Total Amount
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Test Date
                    </TableCell>
                  </>
                )} */}

                

                {(labAlert || rejectedReason)  && (
                  <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>
                    Lonic Code
                  </TableCell>
                )}
                {(labAlert || rejectReason) && (
                  <TableCell></TableCell>
                ) }
                {
                  rejectedReason && <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>Rejected Reason</TableCell>
                }
                {isLabDepartment && !labAlert && (
                  <>
                    <TableCell style={{ fontWeight: "bold" }}>Charge</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Qty</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>GST</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
                  </>
                )}
              </TableRow>
            ) : (
              !isLabDepartment &&
              !patientOrderPay &&
              (alertFrom || patientOrderOpd && !labBilling || isRejectReason || sale || reception) && (
                <TableRow  sx={{
                  border: "1px solid #ddd", // Light gray border
                  "&:last-child td, &:last-child th": { borderBottom: "none" }, // Removes border from last row
                }}>
                  {/* Medicines List Headers */}
                  <TableCell style={{ fontWeight: "bold", fontSize:"17px" }}>Med. ID</TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize:"17px" }}>
                    Med Name
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold",fontSize:"17px" }}>Category</TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize:"17px" }}>Quantity</TableCell>
                  <TableCell style={{ fontWeight: "bold",fontSize:"17px" }}>HSN Code</TableCell>
                  {alertFrom && (<TableCell></TableCell>)}
      
                  {!alertFrom && (
                    <>
                      <TableCell style={{ fontWeight: "bold",fontSize:"17px" }}>
                        Price
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold",fontSize:"17px" }}>GST </TableCell>
                      <TableCell style={{ fontWeight: "bold",fontSize:"17px" }}>
                        {reception ? "Amount" : "Total Amount" }
                      </TableCell>
                      
                    </>
                  )}
                  {!isRejectReason && !alertFrom && !sale && !reception && (
                    <TableCell style={{ fontWeight: "bold",fontSize:"17px" }}>Doctor Name</TableCell>
                  )}
                  
                  {isRejectReason && (
                    <TableCell style={{ fontWeight: "bold",fontSize:"17px" }}>
                      Rejected Reason
                    </TableCell>
                  )}
                </TableRow>
              )
            )}

            {patientOrderPay && !labBilling &&
              (pType === 2 || pType === 3) &&
              Object.entries(groupedData).map(([date, medicines]) => (
                <Table key={date}>
                  <TableHead sx={{
                   borderRadius:'4px',
                  border: "1px solid #ddd", // Light gray border
                  "&:last-child td, &:last-child th": { borderBottom: "none" }, // Removes border from last row
                }}>
                    <TableRow>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        Med. ID
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        Med Name
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        Category
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        Quantity
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        HSN Code
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        Price
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        GST
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        Total Amount
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        Order Date
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        Time
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#252525",fontSize:"16px" }}>
                        Doctor Name
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(medicines as MedicineList[]).map((row) => (
                      <TableRow key={row.takenFromInventoryID}>
                        <TableCell style = {{fontSize:"16px"}}>{row.takenFromInventoryID}</TableCell>
                        <TableCell style = {{fontSize:"16px"}}>{row.medicineName}</TableCell>
                        <TableCell style = {{fontSize:"16px"}}>
                          {medicineCategoryReverse[row.medicineType ?? 1]}
                        </TableCell>
                        <TableCell style = {{fontSize:"16px"}}>{row.updatedQuantity}</TableCell>
                        <TableCell style = {{fontSize:"16px"}}>{row.hsn}</TableCell>
                        <TableCell style = {{fontSize:"16px"}}>{row.sellingPrice}</TableCell>
                        <TableCell style = {{fontSize:"16px"}}>{row.gst || 18}</TableCell>
                        <TableCell style = {{fontSize:"16px"}}>
                          {(
                            (row.updatedQuantity ?? 0) *
                              (row.sellingPrice ?? 0) +
                            ((row.updatedQuantity ?? 0) *
                              (row.sellingPrice ?? 0) *
                              (row.gst ?? 18)) /
                              100
                          ).toFixed(2)}
                        </TableCell>

                        <TableCell style = {{fontSize:"16px"}}>
                          {row.datetime ? formatDate(row.datetime) : "N/A"}
                        </TableCell>
                        <TableCell style = {{fontSize:"16px"}}>
                          {row.datetime ? formatTime(row.datetime) : "N/A"}
                        </TableCell>
                        <TableCell style = {{fontSize:"16px"}}>
                          {row.userID
                            ? doctorNames[row.userID] || "Loading..."
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Medication taken by row */}
                    <TableRow>
                      <TableCell colSpan={11}>
                        <Box sx={{ m: 2  }}>
                          {/* Content Section */}
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            px={10}
                            sx={{ mb: 2,background:"#BFFDC5", width:"80%",ml:"5%" }}
                          >
                            <div style = {{display:"flex", alignItems:"center"}}>
                            <img src ={MedicineTakenByImage} />
                            <Typography
                              variant="body2"
                              color="#077D13"
                              style={{ fontSize: "16px",justifySelf:"flex-start", marginLeft:"20px" }}
                            >
                              Medication Taken by{" "}
                              <span
                                style={{ fontWeight: "bold", fontSize: "18px" }}
                              >
                                {getNurseName(medicines[0]?.nurseID ?? 0)}
                              </span>
                            </Typography>
                            </div>

                            {/* Box for vertical alignment of icon and Chip */}
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              width="20%"
                              ml={2}
                            >
                              
                              <Chip 
                                label={
                                  <Typography sx={{ fontWeight: "bold", color:"#077D13" }}>
                                    Accepted
                                  </Typography>
                                }
                                sx = {{
                                  p: 0.5,height:25, background:"transparent"
                                }}
                                
                               
                              />
                              <CheckCircle
                                sx={{ color: "#17D329", fontSize: 20 }}
                              />
                            </Box>
                          </Box>

                          {/* Horizontal Line */}
                          {/* <Divider /> */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ))}
          </TableHead>
          <TableBody>
            {department?.includes("Lab") || labAlert || rejectedReason
              ? (tableData as (TestList | AlertTestList)[]).map(
                  (row, index) => (
                    <TableRow key={row.id} sx= {{borderBottom:"0.4px solid rgb(169, 167, 167)"}}>
                      <TableCell style ={{fontSize:"16px"}}>{index + 1}</TableCell>
                      <TableCell style ={{fontSize:"16px"}} align="center">{row.id}</TableCell>
                      {"test" in row ? (
                        <TableCell style ={{fontSize:"16px"}} > <span style = {{marginLeft:"100px",fontSize:"16px"}}>{row.test} </span></TableCell>
                      ) : (
                        <TableCell style ={{fontSize:"16px"}}>{row.testName}</TableCell>
                      )}
                      {(labAlert || rejectedReason) && "loinc_num_" in row && (
                        <>
                          <TableCell style ={{fontSize:"16px"}}>{row.hsn || "1236"}</TableCell>
                          <TableCell style ={{fontSize:"16px"}}>{row.loinc_num_}</TableCell>
                        </>
                      )}

                      {
                        rejectedReason && <TableCell style ={{color:"#C43232", fontSize:"16px"}}>{rejectedReason}</TableCell>
                      }

                      {!labAlert && "charge" in row && "qty" in row && (
                        <>
                          <TableCell style ={{fontSize:"16px"}}>{row.charge}</TableCell>
                          <TableCell style ={{fontSize:"16px"}}>{row.qty}</TableCell>
                          <TableCell style ={{fontSize:"16px"}}>{row.price || 0}</TableCell>
                          <TableCell style ={{fontSize:"16px"}}>18%</TableCell>
                          <TableCell>
                            {(
                              row.price * row.qty +
                              (row.price * row.qty * 18) / 100
                            ).toFixed(2)}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )
                )
              : !isLabDepartment &&
                !patientOrderPay &&
                (alertFrom || patientOrderOpd && !labBilling || isRejectReason || sale || reception) &&
                (tableData as MedicineList[]).map((row) => {
                  const initialQuantity = row.Frequency * row.daysCount;
                  const quantity =
                    row.medId !== undefined
                      ? quantities[row.medId] || row.Frequency * row.daysCount
                      : row.Frequency * row.daysCount;

                  const price = row.price ?? row.sellingPrice ?? 0;
                  const gst = row.gst ?? 18;
                  const updatedQuantity =
                    row.medId !== undefined
                      ? quantities[row.medId] || initialQuantity
                      : initialQuantity;

                  const amount = (
                    price * updatedQuantity +
                    (price * updatedQuantity * gst) / 100
                  ).toFixed(2);

                  const validSaleAmount =
                    price * row.quantity + (price * row.quantity * gst) / 100 ||
                    0;
                  const saleAmount = validSaleAmount.toFixed(2);

                  return (
                    <TableRow key={row.id}>
                      <TableCell style ={{fontSize:"16px"}}>{row.id}</TableCell>
                      <TableCell style ={{fontSize:"16px"}}>{row.name || row.medicineName}</TableCell>
                      <TableCell style ={{fontSize:"16px"}}>
                        {medicineCategoryReverse[Number(row.medicineType)] ||
                          row.category}
                      </TableCell>

                      {/* Conditional rendering for quantity */}
                      <TableCell style ={{fontSize:"16px"}}>
                        {alertFrom ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              
                            }}
                          >
                            <button
                              onClick={() =>
                                handleDecrement(row.medId || 0, quantity)
                              }
                              style={{ marginRight: "10px", background:"#E6EEF8", border:"none" }}
                            >
                              -
                            </button>
                            <span>{quantity}</span>
                            <button
                              onClick={() =>
                                handleIncrement(row.medId || 0, quantity)
                              }
                              style={{ marginLeft: "10px", background:"#E6EEF8", border:"none" }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span>{quantity || row.quantity}</span>
                        )}
                      </TableCell>

                      <TableCell style ={{fontSize:"15px"}}>{row.hsn}</TableCell>

                      {!alertFrom && (
                        <>
                          <TableCell style ={{fontSize:"15px"}}>{price}</TableCell>
                          {isRejectReason ? <TableCell style ={{fontSize:"15px"}}>0</TableCell> : <TableCell style ={{fontSize:"15px"}}>{`${Number(row.gst) ?? 18}%`}</TableCell>}
                          

                          <TableCell style ={{fontSize:"15px"}}>
                            {sale !== undefined ? saleAmount : amount}
                          </TableCell>
                        </>
                      )}
                      
                      {isRejectReason && <TableCell style ={{color:"#C43232",fontSize:"15px"}}>{row.reason}</TableCell>}
                      {!isRejectReason && !alertFrom && !sale && !reception && (
                        <TableCell style = {{fontSize:"16px"}}>
                        {row.userID
                          ? doctorNames[row.userID] || "Loading..."
                          : "N/A"}
                      </TableCell>
                      )}

                      {/* Reason Input (Only when Quantity is Decreased) */}
                      <TableCell>
                        {decreasedQuantities[row.medId ?? 0] && (
                          <input
                            type="text"
                            value={reasons[row.medId ?? 0] || ""}
                            onChange={(e) =>
                              handleReasonChange(
                                row?.medId ?? 0,
                                e.target.value
                              )
                            }
                            placeholder="Enter reason"
                          />
                        )}
                      </TableCell>

                    </TableRow>
                  );
                })}
          </TableBody>

          <TableBody>
          {(labBilling && !alertRejectedTab) && (pType != 1) &&
  Object.entries(groupedTests).map(([datetime, tests]) => (
    <div key={datetime} style={{ marginBottom: "1.5rem" }}>
      <Table>
        <TableHead>
          <TableRow style = {{borderBottom:"0.5px solid #9B9B9B"}}>
            <TableCell style={{ fontWeight: "bold", fontSize:"16px" }}>S.No</TableCell>
            <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>Test ID</TableCell>
            <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>Test Name</TableCell>
            <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>HSN Code</TableCell>
            <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>GST</TableCell>
            <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>Price</TableCell>
            <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>Total Amount</TableCell>
            <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>Test Date</TableCell>
            <TableCell style={{ fontWeight: "bold",fontSize:"16px" }}>Doctor Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tests.map((row, index) => (
            <TableRow key={`${row.id}-${datetime}-${index}`}>
              <TableCell style ={{fontSize:"16px"}}>{index + 1}</TableCell>
              <TableCell style ={{fontSize:"16px"}}>{row.id}</TableCell>
              <TableCell style ={{fontSize:"16px"}}>{row.test}</TableCell>
              <TableCell style ={{fontSize:"16px"}}>{row.hsn}</TableCell>
              <TableCell style ={{fontSize:"16px"}}>{row.gst}%</TableCell>
              <TableCell style ={{fontSize:"16px"}}>{row.testPrice || 0}</TableCell>
              <TableCell style ={{fontSize:"16px"}}>
                {(((row.testPrice || 0) * 18) / 100 + (row.testPrice || 0)).toFixed(2)}
              </TableCell>
              <TableCell style ={{fontSize:"16px"}}>
                {row.addedOn ? formatDateTest(row.addedOn) : "N/A"}
              </TableCell>
              <TableCell style ={{fontSize:"16px"}}>   
                {row.userID ? doctorNames[row.userID] || "Loading...": "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ))}

{labBilling && pType == 1 && (
  <div style={{ marginBottom: "1.5rem" }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ fontWeight: "bold" }}>S:No</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Test ID</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Test Name</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>HSN Code</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>GST</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Total Amount</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Test Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(tableData as ( AlertTestList)[]).map((row, index) => (
          <TableRow key={`${row.id}-${index}`}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{row.id}</TableCell>
            <TableCell>CT Scan</TableCell>
            <TableCell>abcd</TableCell>
            <TableCell>18%</TableCell>
            <TableCell>{row.testPrice || 0}</TableCell>
            <TableCell>
              {(((row.testPrice || 0) * 18) / 100 + (row.testPrice || 0)).toFixed(2)}
            </TableCell>
            <TableCell>
              {row.addedOn ? formatDateTest(row.addedOn) : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}



</TableBody>

        </Table>
      </TableContainer>

      {patientOrderPay && (
        renderPaymentDetails()
        // <div style ={{background:"#F8FAFE", padding:"10px"}}>
        //   <h2 style = {{textAlign:"left", marginLeft:"20px"}}>Payment Details</h2>
        //   <Grid container spacing={2} marginTop={2} marginLeft={1}>
        //     <Grid item xs={12} sm={2}>
        //       <TextField
        //         fullWidth
        //         label="Discount (%)"
        //         type="number"
        //         value={discount}
        //         onChange={(e) => {
        //           const value = Number(e.target.value);
        //           if (value <= 100) {
        //             setDiscount(value);
        //           } else {
        //             setDiscount(100);
        //           }
        //         }}
        //         inputProps={{ min: 0, max: 100 }}
        //       />
        //     </Grid>
        //     <Grid item xs={12} sm={2}>
        //       <TextField
        //         fullWidth
        //         label="Name"
        //         value={discountReason}
        //         onChange={(e) => setDiscountReason(e.target.value)}
        //         sx={{ marginLeft: "1rem" }}
        //       />
        //     </Grid>

        //     <Grid item xs={12} sm={2}>
        //       <TextField
        //         fullWidth
        //         label="ID Number"
        //         value={discountReasonID}
        //         onChange={(e) => setDiscountReasonID(e.target.value)}
        //         sx={{ marginLeft: "1rem" }}
        //       />
        //     </Grid>

        //     <h4
        //       className={styles.h4}
        //       style={{ paddingLeft: "10rem", fontWeight: "500" }}
        //     >
        //       Gross : {grossAmount} ₹
        //     </h4>
        //     <h4
        //       className={styles.h4}
        //       style={{ paddingLeft: "5rem", fontWeight: "500" }}
        //     >
        //       Gst : {gstAmount} ₹
        //     </h4>
        //     <div>
        //       <h4
        //         className={styles.h4}
        //         style={{ paddingLeft: "7rem", fontWeight: "bold" }}
        //       >
        //         Total Amount :{discountedTotal.toFixed(2)} ₹
        //       </h4>
        //       {pType !== 1 && (
        //         <>
        //           <h4
        //             className={styles.h4}
        //             style={{
        //               paddingLeft: "7rem",
        //               fontWeight: "bold",
        //               marginBottom: "0", // Remove bottom margin
        //             }}
        //           >
        //             Paid Amount: {parseFloat(paidAmount ?? "0").toFixed(2)} ₹
        //           </h4>
        //           <h4
        //             className={styles.h4}
        //             style={{ paddingLeft: "7rem", fontWeight: "bold" }}
        //           >
        //             Due Amount:{" "}
        //             {(discountedTotal - parseFloat(paidAmount ?? "0")).toFixed(
        //               2
        //             )} ₹
        //           </h4>
        //         </>
        //       )}
        //     </div>
        //   </Grid>
        // </div>
      )}

      {/* Reception alerts OPD */}
      {reception && pType==1 &&( 
        renderPaymentDetails()
      )}

      {/* Reception alerts IPD and Emergency  */}
      
      {reception && (pType==2  || pType==3) && (
        <div style = {{display:"flex", alignItems:"center", marginTop:"20px", padding:"10px", justifyContent:"space-around", width:"90%"}}>
        <div style = {{width:"200px", display:"flex", alignItems:"center"}}>
        <label>Discount:</label>
        <input  type ="number" style = {{width:"100px"}} />
        </div>
        <h4
            className={styles.h4}
            style={{ paddingLeft: "10rem", fontWeight: "600",fontSize:"16px" }}
          >
            Gross : {grossAmount} ₹
          </h4>
          <h4
            className={styles.h4}
            style={{ paddingLeft: "5rem", fontWeight: "600",fontSize:"16px" }}
          >
            Gst : {gstAmount} ₹
          </h4>
          <h4
              className={styles.h4}
              style={{ paddingLeft: "7rem", fontWeight: "bold",fontSize:"17px" }}
            >
              Total :{discountedTotal.toFixed(2)} ₹
            </h4>
        
        
      </div> 
      )}

      {isButton && (pType === 2 || pType === 3) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: labAlert ? "flex-end" : "space-around",
            gap: "1rem",
            marginTop: "2rem",
            paddingLeft: "50rem",
            marginBottom: "2rem",
            marginRight: labAlert? "7rem": "15px",
          }}
        >
          {/* Select Nurse Dropdown */}
          {!labAlert && (
            <Select
              value={isNurseEntered?.firstName + isNurseEntered?.lastName || ""}
              onChange={(e) => {
                const selectedNurse = nurses.find(
                  (nurse) => nurse.firstName + nurse.lastName === e.target.value
                );
                if (selectedNurse) {
                  setIsNurseEntered(selectedNurse);
                }
              }}
              displayEmpty
              className={styles.searchInput}
            >
              <MenuItem value="" disabled>
                Select Nurse
              </MenuItem>
              {nurses?.map((nurse, index) => (
                <MenuItem key={index} value={nurse.firstName + nurse.lastName}>
                  {nurse.firstName + nurse.lastName}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* Button Group */}
          <div style={{ display: "flex", gap: "1rem", justifyContent:"flex-end" }}>
            <Button
              className={styles.button__accept_ipd}
              onClick={AcceptHandler}
              style={{ width: "88px", padding: "0.5rem 1rem",borderRadius:"25px",textTransform:"none" }}
            >
              {path?.toLowerCase().includes("pathology") || path?.toLowerCase().includes("radiology") ? "Approve"   : "Accept"}
            </Button>
          </div>
          </div>
       
      )}

      {((isButton && pType === 1)  || (labAlert && pType === 21)) &&  (
        <div style = {{background: reception ? "#ECF2FF" : "", padding: reception ? "10px": ""}} >
        <div className={styles.button__group} >
          <Button className={styles.button__reject} onClick={handleRejectClick} style = {{border:"1px solid #C43232", borderRadius:"20px",textTransform:"none"}}>
            Reject
          </Button>
          <Button
            className={styles.button__accept_ipd}
            onClick={AcceptHandler}
            style={{  borderRadius:"20px",textTransform:"none" }}
          >
          {path?.toLowerCase().includes("reception")? "Pay" : "Accept" }
          </Button>
        </div>
        </div>
      )}

      {patientOrderPay && (
        <div style = {{background:"#ECF2FF", padding:"10px"}}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
        >
          <Button
            className={styles.button__accept}
            onClick={() => setIsPayment((prevState) => !prevState)} style ={{borderRadius:"22px", padding:"10px"}}
          >
           {`Total: ${(discountedTotal - parseFloat(paidAmount ?? "0")).toFixed(2)} `}₹  
           
           <span style ={{fontWeight:"bold", marginLeft:"10px"}}>Procced to Pay</span>
          </Button>
        </Box>
        </div>
      )}

      {patientOrderOpd && (
        <>
        {renderPaymentDetails()}
        <div style = {{background:"#ECF2FF", padding:"10px"}}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
        >
          <Button
            className={styles.button__accept}
            onClick={() => setIsPayment((prevState) => !prevState)} style ={{borderRadius:"22px", padding:"10px"}}
          >
           {`Total: ${(discountedTotal - parseFloat(paidAmount ?? "0")).toFixed(2)} `}₹  
           
           <span style ={{fontWeight:"bold", marginLeft:"10px"}}>Procced to Pay</span>
          </Button>
        </Box>
        </div>
        </>
      )}
      {isPayment && (
        <PaymentMethodDialog
          open={isPayment}
          onClose={setIsPayment}
          onSubmitPaymenthandler={onSubmitPaymenthandler}
          total={Number(discountedTotal.toFixed(2))} //here pass due anount not total amount?
          amount={ Number(dueAmount) > 0 ? Number(dueAmount) : Number(
            (discountedTotal - parseFloat(paidAmount ?? "0")).toFixed(2)
          )}
          onPaymentUpdate={handlePaymentDetailsUpdate}
          pType={pType} //patient from opd need to pay full payment
        />
      )}
      

      {/* Dialog for Reject Reason */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{ style: { width: "600px", borderRadius:"20px" } }}
      >
        <div  style = {{display:"flex", flexDirection:"column" ,alignItems:"center", padding:"20px", position:"relative"}}>
        <DialogTitle sx={{ fontWeight: "bold", color:"#1977F3",marginBottom:"150px" , fontSize:"20px"}}>
          Rejection Reason
        </DialogTitle>
        <img src = {rejectpopup} alt ="reject pop up image" style ={{width:"240px", alignSelf:"center",position:"absolute",top:60 }} />

        <DialogContent style ={{height:"200px"}}>
          <TextField 
            
            autoFocus
            margin="dense"
            id="rejectReason"
            minRows={5}
            multiline
            type="text"
            placeholder="Write reason here...."
            fullWidth
            variant="outlined"
            value={rejectReason}
            sx = {{width:"500px", border:"#9B9B9B"}}
            onChange={handleRejectReasonChange}
          />
        </DialogContent>
        <div style = {{width:"90%",display:"flex", justifyContent:"space-between" }}>
          <button onClick={() => setOpenDialog(false)} className={styles.cancel_button_in_pop_up}>
            Cancel
          </button>
          <button onClick={RejectHandler} className={styles.confirm_pop_up}>
            Confirm
          </button>
        </div>
        </div>
      </Dialog>
    </>
  );
}
