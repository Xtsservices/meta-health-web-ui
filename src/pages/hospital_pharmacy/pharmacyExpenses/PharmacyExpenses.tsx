import { useEffect, useState } from "react";
import OrderExpneseDialog from "./OrderExpneseDialog";
import PharmacyExpensesCard from "./PharmacyExpensesCard";
import { setLoading } from "../../../store/error/error.action";
import { useDispatch, useSelector } from "react-redux";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { ExpenseData } from "../../../utility/medicine";
import { Dialog } from "@mui/material";
import styles from "./PharmacyExpenses.module.scss";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Add } from "@mui/icons-material";

const PharmacyExpenses: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [openOrderExpense, setOpenOrderExpense] = useState<boolean>(false);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);

  useEffect(() => {
    dispatch(setLoading(true));
    const getInventoryExpenseData = async () => {
      const response = await authFetch(
        `medicineInventoryExpense/${user.hospitalID}/getInventoryExpenseData`,
        user.token
      );
      if (response.status == 200) {
        setExpenseData(response.data);
        dispatch(setLoading(false));
      }
    };

    if (user.hospitalID) {
      getInventoryExpenseData();
    }
  }, [dispatch, user.hospitalID, user.token, openOrderExpense]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  return (
    <div className={styles.container}>
      <div className={styles.container__button}>
        <h3 style ={{fontWeight:"bold"}}>Order Placement</h3>
        {/* <TextField
          type="date"
          sx={{
            backgroundColor: "white",
            margin: "0 1rem",
            borderRadius: "10rem",
            "& fieldset": { border: "none" }, // Removes the border
            padding:"1px"
          }}
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          className={styles.datePicker}
        /> */}
        <div style = {{display:"flex", alignItems:"center"}}>
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
                className="datePicker"
              />
            </div>
          </div>
        </div>

        <button style ={{display:"flex", alignItems:"center", fontSize:"15px"}}
          onClick={() => {
            setOpenOrderExpense(true);
          }}
  
        >
           <Add sx={{ color: "white" ,fontSize:"20px"}} />
          Add Order
        </button>
        </div>
      </div>

      <div>
        <PharmacyExpensesCard data={filteredData} />
      </div>

      <Dialog
        open={openOrderExpense}
        onClose={() => setOpenOrderExpense(!openOrderExpense)}
        maxWidth={false} // Disable predefined maxWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "40vw", // Set width to 50% of viewport width
            maxWidth: "none", // Ensure it does not get restricted by default maxWidth
            borderRadius:'16px',
          },
        }}
      >
        <OrderExpneseDialog
          open={openOrderExpense}
          setOpen={setOpenOrderExpense}
        />
      </Dialog>
    </div>
  );
};

export default PharmacyExpenses;
