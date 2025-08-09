import { Box, Collapse, IconButton } from "@mui/material";
import styles from "./Dropdown.module.scss";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import WardTabs from "../../hospital_reception/wardManagement/WardsTabs";

interface FloorsProps {
  title: string;
  wards: any;
}

const Dropdown: React.FC<FloorsProps> = ({ title, wards }) => {
  const [expandedRow, setExpandedRow] = useState(false);
  const onClick = () => {
    setExpandedRow(!expandedRow);
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerDropdown} onClick={onClick}>
        <p className={styles.containerDropdown__name}>{title}</p>
        <IconButton size="small" className={styles.arrow}>
          {expandedRow ? <FaChevronUp color="white"/> : <FaChevronDown color="white"/>}
        </IconButton>
      </div>
      <Collapse in={expandedRow} timeout="auto" unmountOnExit>
        <Box margin={1}>
          <WardTabs wards={wards} />
        </Box>
      </Collapse>
    </div>
  );
};

export default Dropdown;
