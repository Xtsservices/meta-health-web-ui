import React from "react";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Box,
  Typography,
} from "@mui/material";

interface Test {
  testID: number;
  testName: string;
  testPrice: number | null; // Allow null
  gst: number | null; // Allow null
}

interface Discount {
  discount: number;
  discountReason: string;
  discountReasonID: string;
}

interface Patient {
  patientID: number;
  pName: string;
  firstName: string;
  lastName: string;
  addedOn: string;
  departmemtType: number;
  hospitalID: number;
  category: string;
  discount: Discount[] | null;
  testsList: Test[];
}

interface IpdInnerTableProps {
  data: Patient;
  taxInvoice?: string;
  type?: string;
}

const IpdOpdInnerTable: React.FC<IpdInnerTableProps> = ({
  data,
}) => {

  return (
    <>
      <Box
        sx={{
          marginTop: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
          overflow: "hidden",
          margin: "0 auto",
          width: "100%",
        }}
      >
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>SL.No</b>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {data.testsList?.map((item, index) => {
                // Ensure testPrice and gst are valid numbers
                const testPrice = item.testPrice || 0; // Default to 0 if null
                const gst = item.gst || 0; // Default to 0 if null

                const gstAmount = (testPrice * gst) / 100;
                const totalAmount = testPrice + gstAmount;

                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.testID}</TableCell>
                    <TableCell>{item.testName}</TableCell>
                    <TableCell>{testPrice.toFixed(2)}</TableCell>
                    <TableCell>{gstAmount.toFixed(2)}</TableCell>
                    <TableCell>{totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>


      {/* Final Amount After Discount */}
      <Typography
        variant="subtitle1"
        sx={{
          margin: "15px",
          display: "flex",
          justifyContent: "flex-end",
          width: "90%",
          gap: 1,
        }}
      >
        Total Amount:{" "}
        <strong>
          {(() => {
            const subtotal = data.testsList.reduce((acc, item) => {
              const testPrice = item.testPrice || 0; // Default to 0 if null
              const gst = item.gst || 0; // Default to 0 if null
              return acc + testPrice + (testPrice * gst) / 100;
            }, 0);

            const discountPercentage = data.discount?.[0]?.discount ?? 0;
            const finalTotal = subtotal - (subtotal * discountPercentage) / 100;

            return finalTotal.toFixed(2);
          })()}
        </strong>
      </Typography>
    </>
  );
};

export default IpdOpdInnerTable;