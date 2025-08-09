import React, {useState } from "react";
import styles from "../OrderManagement/OrdersTabs.module.scss";
import TaxInvoiceWalkIn from "./TaxInvoiceWalkIn";
import TaxInvoiceInPatient from "./TaxInvoiceInpatient";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface TaxInvoiceTabsProps {
  type?: "medicine" | "test";
}



const TaxInvoiceTabs: React.FC<TaxInvoiceTabsProps> = ({ type }) => {
  const [activeTab, setActiveTab] = useState("In_Hospital_Tax_Invoice");

  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);



  const normalizeDate = (date: Date | null) => {
    if (!date) return null;
    // Use UTC to avoid timezone issues
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };

 

  const renderContent = () => {
    switch (activeTab) {
      case "In_Hospital_Tax_Invoice":
        return (
          <TaxInvoiceInPatient
            title={"IPD Hospital Tax Invoice"}
            departmentType={2}
            type={type}
            startDate={startDate}
            endDate={endDate}
          />
        );
      case "opd_Hospital_Tax_Invoice":
        return (
          <TaxInvoiceInPatient
            title={"OPD Hospital Tax Invoice"}
            departmentType={1}
            type={type}
            startDate={startDate}
            endDate={endDate}
          />
        );
      case "Walk_In_Tax_Invoice":
        return <TaxInvoiceWalkIn title={"Walk In Tax Invoice"} type={type}    startDate={startDate}
        endDate={endDate}/>;
      default:
        return null;
    }
  };

  

  
  return (
    <div className={styles.tabsContainer}>
      <div
        className={styles.tabHeaders}
        style={{
          display: "flex",
          alignItems:"flex-end",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Left-aligned buttons */}
        <div className={styles.button_container}>
          <button
            className={
              activeTab === "In_Hospital_Tax_Invoice" ? styles.active : ""
            }
            onClick={() => setActiveTab("In_Hospital_Tax_Invoice")}
          >
            IPD Tax Invoice
          </button>
          <button
            className={
              activeTab === "opd_Hospital_Tax_Invoice" ? styles.active : ""
            }
            onClick={() => setActiveTab("opd_Hospital_Tax_Invoice")}
          >
            OPD Tax Invoice
          </button>
          <button
            className={activeTab === "Walk_In_Tax_Invoice" ? styles.active : ""}
            onClick={() => setActiveTab("Walk_In_Tax_Invoice")}
          >
            Walk-In Tax Invoice
          </button>
        </div>

       
        <div className={styles.calendar} style={{ marginRight: "1rem", marginLeft: "auto" , marginBottom:'10px'}}>
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

      </div>

      <div className={styles.tabContent}>{renderContent()}</div>
      
    </div>
  );
};

export default TaxInvoiceTabs;
