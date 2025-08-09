import React, { useState } from "react";
import styles from "./WardBeds.module.scss";
import WardBedPopup from "./WardBedPopup";
import { Bed } from "../../../types";
import red_bed from "../../../assets/reception/red_bed.png"
import green_bed from "../../../assets/reception/green_bed.png"

interface WardBedProps {
  beds: Bed[];
}

const WardBeds: React.FC<WardBedProps> = ({ beds }) => {
  const [isWardBedPopupOpen, setIsWardBedPopupOpen] = useState(false);
  const onBedClick = () => {
    setIsWardBedPopupOpen(true);
  };
  const handleWardBedPopupClose = () => {
    setIsWardBedPopupOpen(false);
  };
  return (
    <div className={styles.bedsContainer}>
      {beds.map((bedData) => (
        <div key={bedData.id} className={styles.bedItem}>
          {bedData.status ==="occupied"? (
            <img src = {green_bed}  style ={{background:"#C1F1BC", padding:"8px",width:"55px", height:"40px",borderRadius:"8px"}} onClick={onBedClick}/>
          ) : ( <img src = {red_bed} style ={{background:"#FFD8D8",  padding:"8px",width:"55px", height:"40px",borderRadius:"8px"}}  onClick={onBedClick} /> ) }
          {/* <LocalHotelIcon
            onClick={onBedClick}
            className={styles.bedIcon}
            style={{width:"60px", height:"40px", borderRadius:"8px" ,color: bedData.status === "occupied" ? "green" : "red", background:bedData.status==="occupied"? "#C1F1BC" : "#FFD8D8" }}
          /> */}
          <div className={styles.bedName}>{bedData.name}</div>
        </div>
      ))}
      <WardBedPopup
        open={isWardBedPopupOpen}
        onClose={handleWardBedPopupClose}
      />
    </div>
  );
};

export default WardBeds;
