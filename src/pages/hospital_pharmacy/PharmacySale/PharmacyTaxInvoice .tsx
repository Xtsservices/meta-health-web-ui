import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search, CloudUpload, PictureAsPdf } from "@mui/icons-material";
import calendarIcon from "../../../assets/uim_calender.png";
import styles from "./TaxInvoice.module.scss";
import PrintIcon from "@mui/icons-material/Print";

interface Invoice {
  date: string;
  patientName: string;
  mobileNumber: string; // Added mobile number field
  amount: string;
  method: string;
  pdf: string;
}

const PharmacyTaxInvoice: React.FC = () => {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // For search input
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]); // For filtered results

  // Sample data for invoices, now including mobile number
  const invoiceData: Invoice[] = [
    {
      date: "24-7-2024",
      patientName: "Ramu",
      mobileNumber: "9876543210",
      amount: "₹45000",
      method: "Card",
      pdf: "invoice_001.pdf",
    },
    {
      date: "24-7-2024",
      patientName: "Kiran",
      mobileNumber: "1234567890",
      amount: "₹45000",
      method: "Card",
      pdf: "invoice_002.pdf",
    },
  ];

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  // const isFutureDate = (date: Date) => {
  //   const today = new Date();
  //   return date <= today;
  // };

  const handleFromDateChange = (date: Date | null) => {
    if (date && date <= toDate) {
      setFromDate(date);
    } else {
      alert("From Date must be less than or equal to To Date");
    }
  };

  const handleToDateChange = (date: Date | null) => {
    if (date && date >= fromDate) {
      setToDate(date);
      toggleDatePicker();
    } else {
      alert("To Date must be greater than or equal to From Date");
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = invoiceData.filter((invoice) =>
        invoice.mobileNumber.includes(value)
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoiceData);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Section with Search, Date Range, and Icons */}
      <div className={styles.topSection}>
        <button className={styles.todayButton}>Today</button>
        <div className={styles.dateRange}>
          <span>{`${fromDate?.toLocaleDateString()} - ${toDate?.toLocaleDateString()}`}</span>
          <IconButton
            className={styles.calendarIcon}
            onClick={toggleDatePicker}
          >
            <img src={calendarIcon} alt="Calendar" />
          </IconButton>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextField
          placeholder="Search with mobile number"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          className={styles.searchInput}
          style={{ width: "30%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  style={{
                    backgroundColor: "#ffb400",
                    borderRadius: "5px",
                    padding: "11px",
                  }}
                >
                  <Search style={{ color: "white", fontSize: "34px" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* Date Picker Section */}
      {showDatePicker && (
        <div className={styles.datePickerWrapper}>
          <div className={styles.datePicker}>
            <label>From:</label>
            <DatePicker
              selected={fromDate}
              onChange={handleFromDateChange}
              dateFormat="dd MMM yyyy"
              maxDate={new Date()}
              className={styles.customDatePicker}
            />
          </div>
          <div className={styles.datePicker}>
            <label>To:</label>
            <DatePicker
              selected={toDate}
              onChange={handleToDateChange}
              dateFormat="dd MMM yyyy"
              minDate={fromDate}
              maxDate={new Date()}
              className={styles.customDatePicker}
            />
          </div>
        </div>
      )}

      {/* Table Section */}
      <section className={styles.invoiceTable}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={styles.headerCell}>Date</TableCell>
                <TableCell className={styles.headerCell}>
                  Patient Name
                </TableCell>
                <TableCell className={styles.headerCell}>
                  Mobile Number
                </TableCell>
                <TableCell className={styles.headerCell}>Amount</TableCell>
                <TableCell className={styles.headerCell}>Method</TableCell>
                <TableCell className={styles.headerCell}>PDF</TableCell>
                <TableCell className={styles.headerCell}>Print</TableCell>
                <TableCell className={styles.headerCell}>
                  Upload Prescription
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredInvoices.length > 0
                ? filteredInvoices
                : invoiceData
              ).map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.patientName}</TableCell>
                  <TableCell>{invoice.mobileNumber}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.method}</TableCell>
                  <TableCell>
                    <IconButton>
                      <PictureAsPdf />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Button
                      className={styles.uploadButton}
                      startIcon={<PrintIcon />}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className={styles.uploadButton}
                      startIcon={<CloudUpload />}
                    >
                      + Upload
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </section>
    </div>
  );
};

export default PharmacyTaxInvoice;
