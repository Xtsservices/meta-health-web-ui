import { Box, Collapse, IconButton } from "@mui/material";
import styles from "./Dropdown.module.scss";
import { useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowDown";
// import InnerTable from "../../hospital_pharmacy/OrderManagement/InnerTables";
// import WardTabs from "../../pages/wardManagement/WardsTabs";

interface FloorsProps {
  title: string;
  wards: unknown;
}

const Dropdown: React.FC<FloorsProps> = ({ title }) => {
  const [expandedRow, setExpandedRow] = useState(false);
  const onClick = () => {
    setExpandedRow(!expandedRow);
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerDropdown} onClick={onClick}>
        <p className={styles.containerDropdown__name}>{title}</p>
        <IconButton size="small" className={styles.arrow}>
          {expandedRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </div>
      <Collapse in={expandedRow} timeout="auto" unmountOnExit>
        <Box margin={1}>
          {/* <WardTabs wards={wards} /> */}
          {/* <InnerTable data={[]} /> */}
        </Box>
      </Collapse>
    </div>
  );
};

export default Dropdown;
