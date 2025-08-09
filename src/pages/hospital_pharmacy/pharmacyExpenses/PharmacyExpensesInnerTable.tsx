import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "../OrderManagement/InnerTable.module.scss";
import { SelectedMedicineData } from "../../../utility/medicine";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { setError, setSuccess } from "../../../store/error/error.action";

import {
  Button,
  Dialog,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import warningIcon from "../../../assets/pharmacy/pharmacyBanners/warningicon.png";
interface InnerTableProps {
  data: SelectedMedicineData[];
  isButton: boolean;
  parentComponentName: string;
  setRenderData?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMEdId?: React.Dispatch<React.SetStateAction<number|null>>
}

export default function PharmacyExpensesInnerTable({
  data,
  parentComponentName,
  setRenderData,
  setEditMEdId
}: InnerTableProps) {
  const [totalAmount, setTotalAmount] = useState(0);
  const [rowID, setRowID] = useState<number | null>(null);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Calculate the total amount whenever `data` changes
  useEffect(() => {
    if (data) {
      const total = data.reduce((acc, row) => {
        const amount =
          row.costPrice * row.quantity +
          (row.costPrice * row.quantity * row.gst) / 100;
        return acc + amount;
      }, 0);
      setTotalAmount(total);
    }
  }, [data]);

  const handlDeleteMedicine = async () => {
    const response = await authFetch(
      `pharmacy/changeisActive/${rowID}`,
      user.token
    );
    handleClose();

    if(setRenderData){
      setRenderData(true)
    }
    
    if (response.status === 200) {
      dispatch(setSuccess(`successfully Deleted`));
    } else if (response.status === 400) {
      dispatch(setError(`Failed to delete medicine`));
    } else {
      dispatch(setError("Something went wrong, please try again."));
    }
  };

  const handlEditMedicine = (id: number) => {
    if(setEditMEdId && setRenderData){
      setEditMEdId(id)
      setRenderData(true)
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{boxShadow: "none", 
         border: "1px solid #ccc",
       }}>
        <Table sx={{ minWidth: 750}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                Med Name
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                Category
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                Qty
              </TableCell>
              {parentComponentName === "Inventory" && (
                <>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    HSN Code
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Cost Price
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Sale Price
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    GST
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Total Amount
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Action
                  </TableCell>
                </>
              )}

            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={row.name}>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ fontSize: "15px" }}
                >
                  {row.name}
                </TableCell>
                <TableCell style={{ fontSize: "15px" }}>
                  {row.category}
                </TableCell>
                <TableCell style={{ fontSize: "15px" }}>
                  {row.quantity}
                </TableCell>
                {parentComponentName === "Inventory" && (
                  <>
                    <TableCell style={{ fontSize: "15px" }}>
                      {row.hsn}
                    </TableCell>
                    <TableCell style={{ fontSize: "15px" }}>
                      {row.costPrice}
                    </TableCell>
                    <TableCell style={{ fontSize: "15px" }}>
                      {row.sellingPrice}
                    </TableCell>
                    <TableCell style={{ fontSize: "15px" }}>
                      {row.gst > 0 ? `${row.gst}%` : `N/A`}
                    </TableCell>
                    <TableCell style={{ fontSize: "15px" }}>
                      {(
                        row.costPrice * row.quantity +
                        (row.costPrice * row.quantity * row.gst) / 100
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell style={{ fontSize: "15px" }}>
                      <div>
                        <EditIcon
                          onClick={() => handlEditMedicine(row.id)}
                          style={{ cursor: "pointer", color: "gray" }}
                        />
                        <DeleteIcon
                          onClick={() => {
                            setRowID(row.id);
                            handleOpen();
                          }}
                          style={{
                            cursor: "pointer",
                            marginLeft: "1rem",
                            color: "gray",
                          }}
                        />
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <Box>
            {/* Modal Dialog */}
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-description"
              PaperProps={{
                sx: {
                  borderRadius: "12px",
                  padding: "24px",
                  maxWidth: "400px",
                  width: "100%",
                  textAlign: "left",
                },
              }}
            >
              {/* Warning Icon in a Circle */}
              <img
                src={warningIcon}
                style={{ height: "5rem", width: "5rem", marginBottom: "2rem" }}
              />

              {/* Heading */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Delete Medicine Data
              </Typography>

              {/* Paragraph */}
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  marginBottom: "24px",
                }}
              >
                Are you sure you want to delete this Medicine Data from your Medicine Inventory? This action
                cannot be undone.
              </Typography>

              {/* Buttons */}
              <DialogActions
                sx={{
                  display: "flex",
                  gap: "16px",
                  padding: 0,
                }}
              >
                <Button
                  onClick={handleClose}
                  fullWidth
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlDeleteMedicine}
                  fullWidth
                  variant="contained"
                  color="error"
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                    },
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </div>
      </TableContainer>
      {parentComponentName === "Inventory" && (
        <h4
          className={styles.h4}
          style={{
            fontWeight: "bold",
            marginRight: "5%",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          Total Amount = Rs{" "}
          <span
            style={{ fontSize: "15px", fontWeight: "bold", marginLeft: "5px" }}
          >
            {totalAmount.toFixed(2)}{" "}
          </span>
        </h4>
      )}
    </>
  );
}
