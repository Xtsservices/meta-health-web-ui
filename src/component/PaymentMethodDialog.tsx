import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Button,
  Box,
  IconButton,
  Checkbox,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import cards from "../assets/addPatient/Frame3809.png";
import online from "../assets/addPatient/Frame3810.png";
import { useLocation } from "react-router-dom";
import paymentImg from "../assets/pharmacy/payment.png";

type PaymentMethod = "cards" | "online" | "cash";

const PaymentMethodDialog = ({
  open,
  onClose,
  amount,
  onSubmitPaymenthandler,
  onPaymentUpdate,
  pType,
  total,
  pharmacySale,
}: {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  amount: number;
  onSubmitPaymenthandler: (
    paymentDetails: Record<PaymentMethod, number>
  ) => void;

  onPaymentUpdate?: (due: number, paying: number) => void;
  pType?: number;
  total: number;
  pharmacySale?: boolean;
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const location = useLocation();
  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMethod(event.target.value as PaymentMethod);
  };

  const [selectedMethods, setSelectedMethods] = useState<Set<PaymentMethod>>(
    new Set()
  );
  const [enteredAmount, setEnteredAmount] = useState<{
    [key in PaymentMethod]: number;
  }>({
    cards: 0,
    online: 0,
    cash: 0,
  });
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    method: PaymentMethod
  ) => {
    const newSelectedMethods = new Set(selectedMethods);
    if (event.target.checked) {
      newSelectedMethods.add(method);
    } else {
      newSelectedMethods.delete(method);
    }
    setSelectedMethods(newSelectedMethods);
  };

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, // Accept both input and textarea elements
    method: PaymentMethod
  ) => {
    const value = event.target.value ? parseFloat(event.target.value) : 0; // Ensure it's treated as a number
    setEnteredAmount((prev) => ({
      ...prev,
      [method]: value, // Update the correct method with the new value
    }));
  };

  useEffect(() => {
    const totalPaying = Object.values(enteredAmount).reduce(
      (total, amount) => total + (typeof amount === "number" ? amount : 0),
      0
    );
    const totalDue = amount - totalPaying;
    if (onPaymentUpdate) {
      onPaymentUpdate(totalDue, totalPaying);
    }
  }, [enteredAmount, amount, onPaymentUpdate]);

  const totalEnteredAmount = Object.values(enteredAmount).reduce(
    (total, amount) =>
      total + (typeof amount === "number" ? amount : parseFloat(amount || "0")),
    0
  );

  // Fix floating-point precision issue
  const roundedTotal = Math.round(totalEnteredAmount * 100) / 100;
  const path: boolean = ["pathology", "radiology"].some((keyword) =>
    location.pathname.includes(keyword)
  );
  console.log("path", path);
  console.log("path", total);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          width:"800px"
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "20px",
          color: "black",
          display: "flex",
          justifyContent: "center", // Center the content
          alignItems: "center",
          position: "relative", // Position the close button relative to the title
          paddingRight: "30px",
          
        }}
      >
        <span
          style={{
            textAlign: "center",
            margin: "10px",
            color: "#1977F3",
            fontWeight: "600",
          }}
        >
          Payment Received Through
        </span>
        <IconButton
          onClick={() => onClose(false)}
          sx={{
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: "600px", maxWidth: "100%" }}>
        <Box
          sx={{
            textAlign: "center",
            marginBottom:"100px"
          }}
        >
          <img
            src={paymentImg}
            alt="paymentImg"
            style={{ height: "120px", width: "140px", position:"absolute", left:"38%", top:60}}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: "#F5F8FF",
            padding: "30px",
            borderRadius: "10px",
            marginTop: "10px",
          }}
        >
          <RadioGroup value={selectedMethod} onChange={handleMethodChange}>
            <p style={{ color: "black", }}>Select Payment Method</p>

            <Box
              sx={{
                display: "flex", // To align items side by side
                alignItems: "center", // Vertically align the checkbox and input
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMethods.has("cards")}
                    onChange={(e) => handleCheckboxChange(e, "cards")}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fill: "#007bff", //  Forces blue background inside checkbox
                      },
                    }}
                  />
                }
                label="Credit or Debit Cards"
              />

              {selectedMethods.has("cards") && (
                <TextField
                  label="Enter Amount"
                  type="number"
                  value={enteredAmount.cards || ""}
                  onChange={(e) => handleAmountChange(e, "cards")}
                  sx={{ width: "150px", backgroundColor: "white", height:"55px" }} // Set width if needed
                />
              )}
            </Box>
            <img
              src={cards}
              alt="GPay"
              style={{ height: "18px", width: "200px", marginBottom: "10px",marginLeft:"0px" }}
            />
            <hr
              style={{
                height: "1px",
                backgroundColor: "#B2CAEA",
                border: "none",
                width: "100%",
                marginBottom: "10px",
              }}
            />

            <Box
              sx={{
                display: "flex", // To align items side by side
                alignItems: "center", // Vertically align the checkbox and input
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMethods.has("online")}
                    onChange={(e) => handleCheckboxChange(e, "online")}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fill: "#007bff", //  Forces blue background inside checkbox
                      },
                     
                    }}
                  />
                }
                label="Online Payment"
              />
              {selectedMethods.has("online") && (
                <TextField
                  label="Enter Amount"
                  type="number"
                  value={enteredAmount.online || ""}
                  onChange={(e) => handleAmountChange(e, "online")}
                  sx={{
                    width: "150px",
                    backgroundColor: "white",
                    marginTop: "5px",
                    height: "46px", // Adjust height
                    "& .MuiOutlinedInput-root": {
                      border: "none", // Removes border
                      height: "49px", // Adjusts input height
                      padding: "0px", // Reduces padding
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center", // Centers text inside input
                    },
                  }}
                />
              )}
            </Box>

            <img
              src={online}
              alt="GPay"
              style={{ height: "20px", width: "200px", marginBottom: "10px" }}
            />

            <hr
              style={{
                height: "1px",
                backgroundColor: "#B2CAEA",
                border: "none",
                width: "100%",
                marginBottom: "10px",
              }}
            />

            <Box
              sx={{
                display: "flex", // To align items side by side
                alignItems: "center", // Vertically align the checkbox and input
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMethods.has("cash")}
                    onChange={(e) => handleCheckboxChange(e, "cash")}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fill: "#007bff", //  Forces blue background inside checkbox
                      },
                    }}
                  />
                }
                label="Cash"
              />
              {selectedMethods.has("cash") && (
                <TextField
                  label="Enter Amount"
                  type="number"
                  value={enteredAmount.cash || ""}
                  onChange={(e) => handleAmountChange(e, "cash")}
                  sx={{
                    width: "150px",
                    backgroundColor: "white",
                    height: "46px", // Adjust height
                    border:"none",
                    "& .MuiOutlinedInput-root": {
                      border: "none", // Removes border
                      height: "49px", // Adjusts input height
                      padding: "0px", // Reduces padding
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center", // Centers text inside input
                    },
                  }}
                />
              )}
            </Box>
            <hr
              style={{
                height: "1px",
                backgroundColor: "#B2CAEA",
                border: "none",
                width: "100%",
                marginBottom: "10px",
              }}
            />
          </RadioGroup>
          <Box sx = {{height:"150px", display:"flex", flexDirection:"column", justifyContent:"space-between",alignItems:"center"}} >
            <div style={{ display: "flex", alignItems: "center", height:"35px" }}>
              <p style={{ minWidth: "180px",marginTop:"20px" }}>Due Amount   <span style ={{marginLeft:"25px", fontWeight:"bold"}}> Rs. </span></p>
              <span
                style={{
                  backgroundColor: "white",
                  padding: "6px 8px",
                  borderRadius: "5px",
                  minWidth: "150px", // Ensure consistent width
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                {amount}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", height:"35px" }}>
              <p  style={{ minWidth: "180px",marginTop:"20px" }}> Paid Amount  <span style ={{marginLeft:"25px", fontWeight:"bold"}}> Rs. </span></p>

              <span
                style={{
                  backgroundColor: "white",
                  padding: "6px 8px",
                  borderRadius: "5px",
                  minWidth: "150px", // Ensure consistent width
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                {(
                  Math.round(
                    Object.values(enteredAmount).reduce(
                      (total, amount) =>
                        total + (typeof amount === "number" ? amount : 0),
                      0
                    ) * 100
                  ) / 100
                ).toFixed(2)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", height:"35px" }}>
              <p  style={{ minWidth: "180px",marginTop:"20px" }}>Total Due <span style ={{marginLeft:"50px", fontWeight:"bold"}}> Rs. </span></p>

              <span
                style={{
                  backgroundColor: "white",
                  padding: "6px 8px",
                  borderRadius: "5px",
                  minWidth: "150px", // Ensure consistent width
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                {(
                  Math.round(
                    (amount -
                      Object.values(enteredAmount).reduce(
                        (total, amount) =>
                          total + (typeof amount === "number" ? amount : 0),
                        0
                      )) *
                      100
                  ) / 100
                ).toFixed(2)}
              </span>
            </div>
          </Box>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => {
              const selectedPayments = Array.from(selectedMethods).reduce(
                (acc, method) => {
                  acc[method] = enteredAmount[method] || 0;
                  return acc;
                },
                {} as Record<PaymentMethod, number>
              );
              const paymentDataWithTime = {
                ...selectedPayments,
                timestamp: new Date().toISOString(), // Add the current timestamp
              };
              onSubmitPaymenthandler(paymentDataWithTime);
              onClose((prevState) => !prevState);
            }}
            disabled={
              !selectedMethod ||
              pType === 1 ||
              (pType === 21 && roundedTotal !== amount) ||
              ((pType === 2 || pType === 3) && roundedTotal <= 0) ||
              (pharmacySale && roundedTotal !== amount) ||
              (path && roundedTotal !== amount)
            }
            sx={{
              padding: "6px 26px",
              width: "319px",
              height: "48px",
              borderRadius: "24px",
              textTransform: "none",
              backgroundColor: "#F59706",
              fontSize:"20px",
              "&:hover": {
                backgroundColor: "darkorange", // Set a darker shade on hover
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
