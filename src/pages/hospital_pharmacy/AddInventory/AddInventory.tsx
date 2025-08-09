import { useEffect, useState } from "react";
import { setLoading } from "../../../store/error/error.action";
import { useDispatch, useSelector } from "react-redux";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { ExpenseData } from "../../../utility/medicine";
import styles from "../pharmacyExpenses/PharmacyExpenses.module.scss";
import { Dialog } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddInventoryDialog from "./AddInventoryDialog";
import AddInventoryCard from "./AddInventoryCard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Add } from "@mui/icons-material";

const useStyles = makeStyles({
  dialogPaper: {
    width: "80%",
    margin: "0",
    padding: "0",
  },
});

const AddInventory: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [openOrderExpense, setOpenOrderExpense] = useState<boolean>(false);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);

  const [renderData, setRenderData] = useState(false);
  const [editMEdId, setEditMEdId] = useState<number | null>(null);
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

  const [editMedicineData, setEditMedicineData] = useState(
    initalSelectedMedicineData
  );

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);


  useEffect(() => {
    dispatch(setLoading(true));
    const getInventoryLogs = async () => {
      const response = await authFetch(
        `medicineInventoryLogs/${user.hospitalID}/getInventoryLogs`,
        user.token
      );
      if (response.status === 200) {
        setExpenseData(response.data);
        dispatch(setLoading(false));
      }
    };

    if (user.hospitalID) {
      getInventoryLogs();
    }
  }, [dispatch, user.hospitalID, user.token, openOrderExpense, renderData,openOrderExpense]);


  const normalizeDate = (date: Date | null) => {
    if (!date) return null;
    // Use UTC to avoid timezone issues
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };

  // Filter data by selected date
  const filteredData =
    startDate && endDate
      ? expenseData.filter((expense) => {
          // Convert expense.addedOn and selected dates to YYYY-MM-DD format
          const expenseDate = new Date(expense.addedOn)
            .toISOString()
            .split("T")[0];
          const start = startDate.toISOString().split("T")[0];
          const end = endDate.toISOString().split("T")[0];
          return expenseDate >= start && expenseDate <= end;
        })
      : expenseData;



// ===============this filter for edit===================
  const filterByMedicineId = (data: any[], targetId: number): any | null => {
    for (const item of data) {
      const matchedMedicines = item.medicinesList?.filter(
        (medicine: any) => medicine.id === targetId
      );
      if (matchedMedicines.length > 0) {
        return { ...item, medicinesList: matchedMedicines }; // Return full object with only matched medicines
      }
    }
    return null; // Return null if no match is found
  };

  useEffect(() => {
    if (editMEdId) {
      const result = filterByMedicineId(expenseData, editMEdId);
      console.log("editfilteredData", result);
  
      if (result && result.medicinesList.length > 0) {
        const matchedMedicine = result.medicinesList[0]; // Get the first matched medicine
  
        setEditMedicineData({
          ...initalSelectedMedicineData, // Ensure default structure
          ...matchedMedicine, // Set medicine details
          agencyName: result.agencyName,
          contactNo: result.contactNo,
          agentCode: result.agentCode,
          manufacturer: result.manufacturer,
          expiryDate: result.expiryDate,
          agencyID: result.agencyID,
          lowStockValue: result.lowStockValue,
        });
        setOpenOrderExpense(true)
      } else {
        setEditMedicineData(initalSelectedMedicineData); // Reset if no match found
      }
    }
  }, [editMEdId]);
  
useEffect(()=>{
  if(openOrderExpense) return
  setEditMEdId(null)
  setEditMedicineData(initalSelectedMedicineData)
},[openOrderExpense])

  return (
    <div className={styles.container}>
      <div className={styles.container__button}>
        <h3 style={{ fontWeight: "bold" }}>Add Inventory</h3>

        {/* Date picker for filtering by date */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className={styles.calendar} style={{ marginRight: "1rem" }}>
            <CalendarTodayIcon />
            <div className={styles.timeFrameContainer}>
              <div className={styles.datePickerContainer}>
                <DatePicker
                  selected={startDate}
                  onChange={(dates: [Date | null, Date | null]) => {
                    const [start, end] = dates;
                    setStartDate(normalizeDate(start));
                    setEndDate(normalizeDate(end));
                  }}
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  selectsRange
                  isClearable
                  placeholderText="Select a date range"
                  className={styles.datePicker}
                  style={{
                    padding: "10px",
                    zIndex: 9999,
                    position: "relative",
                  }}
                  calendarClassName={styles.calendar}
                  maxDate={new Date()}
                />
              </div>
            </div>
          </div>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              width: "150px",
              height: "45px",
              fontSize: "15px",
            }}
            onClick={() => {
              setOpenOrderExpense(true);
            }}
          >
            {" "}
            <Add sx={{ color: "white", fontSize: "20px" }} />
            Add Inventory
          </button>
        </div>
      </div>

      {/* Display filtered data */}
      <div>
        <AddInventoryCard
          data={filteredData}
          setEditMEdId={setEditMEdId}
          setRenderData={setRenderData}
        />
      </div>

      {/* Dialog for adding new inventory */}
      <Dialog
        open={openOrderExpense}
        onClose={() =>{ setOpenOrderExpense(!openOrderExpense);setEditMEdId(null)}}
        classes={{ paper: classes.dialogPaper }}
        maxWidth={false}
      >
        <AddInventoryDialog
          open={openOrderExpense}
          setOpen={setOpenOrderExpense}
          editMedicineData = {editMedicineData}
          editMEdId={editMEdId}

        />
      </Dialog>
    </div>
  );
};

export default AddInventory;
