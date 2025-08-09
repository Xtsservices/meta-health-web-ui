import React, { useState } from "react";
import styles from "./taxInvoice.module.scss";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import IpdBilling from "./IpdBilling";
import AllTaxInvoice from "./AllTaxInvoice";

const TaxInvoice: React.FC = () => {
  const [activeTab, setActiveTab] = useState("IPD Tax Invoices");

  const renderContent = () => {
    switch (activeTab) {
      case "IPD Tax Invoices":
        return <IpdBilling />;
      case "All Tax Invoices":
        return <AllTaxInvoice />;
      default:
        return null;
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return today.toLocaleDateString("en-US", options);
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabRow}>
        {/* Tabs */}
        <div className={styles.tabHeaders}>
          <button
            className={activeTab === "IPD Tax Invoices" ? styles.active : ""}
            onClick={() => setActiveTab("IPD Tax Invoices")}
          >
            IPD Billing
          </button>
          <button
            className={activeTab === "All Tax Invoices" ? styles.active : ""}
            onClick={() => setActiveTab("All Tax Invoices")}
          >
            All Tax Invoices
          </button>
        </div>

        {/* Calendar Section */}
        <div className={styles.calendarSection}>
          <CalendarTodayIcon className={styles.calendarIcon} />
          <span className={styles.date}>{getTodayDate()}</span>
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};

export default TaxInvoice;

// import React, { useState } from "react";
// import { Tabs, Tab, Box } from "@mui/material";
// import { Grid, TextField, Button } from "@mui/material";
// import styles from "./taxInvoice.module.scss";
// import { useNavigate } from "react-router-dom";

// const TaxInvoice = () => {
//   const [value, setValue] = useState(0);
//   const [patientID, setPatientID] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
//     setValue(newValue);
//     if (newValue === 2) {
//       navigate("/hospital-dashboard/reception/tax-invoice/allTaxInvoices");
//     }
//   };
//   const handleIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPatientID(event.target.value);
//   };

//   const handleSubmit = () => {
//     navigate("/hospital-dashboard/reception/tax-invoice/patientBilling", {
//       state: { tabIndex: value },
//     });
//   };

//   return (
//     <Box className={styles.boxContainer}>
//       <Box>
//         <Tabs
//           value={value}
//           textColor="inherit"
//           TabIndicatorProps={{
//             style: {
//               backgroundColor: "#F59706",
//             },
//           }}
//           onChange={handleChange}
//           aria-label="billing tabs"
//           className={styles.tabs}
//         >
//           <Tab label="OPD Billing" className={styles.tab} />
//           <Tab label="IPD Billing" className={styles.tab} />
//           <Tab label="All Tax Invoices" className={styles.tab} />
//         </Tabs>
//       </Box>
//       <div className={styles.container}>
//         {value !== 2 && (
//           <div className={styles.patientContainer}>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Patient's ID"
//                   variant="outlined"
//                   fullWidth
//                   required
//                   name="pID"
//                   value={patientID}
//                   onChange={handleIDChange}
//                   sx={{ mt: 2, ml: 2 }}
//                 />
//               </Grid>
//               <Grid item>
//                 <Button
//                   variant="contained"
//                   sx={{ ml: 3, mt: 3 }}
//                   onClick={handleSubmit}
//                 >
//                   Submit
//                 </Button>
//               </Grid>
//             </Grid>
//           </div>
//         )}
//       </div>
//     </Box>
//   );
// };

// export default TaxInvoice;
