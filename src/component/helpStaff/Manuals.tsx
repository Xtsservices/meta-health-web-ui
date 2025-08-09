import React from "react";
import styles from "./Manuals.module.scss";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
// import nvCoreImage from "./../../../src/assets/nv_core.png";
import nvCoreImage from "./../../../src/assets/nv_core.png";
import vTrackImage from "./../../../src/assets/v_track.png";
import vitalsImage from "./../../../src/assets/vitals.png";
// import vitalsImage from "./../../../public"
type ManualStaffProp = {
  title: string;
  link: string;
  imageUrl: string;
};

const ManualStaff: React.FC = () => {
  const navigate = useNavigate();
  const manualData: ManualStaffProp[] = [
    {
      title: "NV CORE",
      link: "https://example.com/user-manual.pdf",
      imageUrl: nvCoreImage,
    },
    {
      title: "V TRACK",
      link: "https://example.com/installation-guide.pdf",
      imageUrl: vTrackImage,
    },
    {
      title: "Vitals",
      link: "https://example.com/troubleshooting-handbook.pdf",
      imageUrl: vitalsImage,
    },
  ];

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ marginRight: "10px" }}>
          <IconButton aria-label="delete" onClick={() => navigate("..")}>
            <ArrowBackIosIcon />
          </IconButton>
        </h3>
        <h2 style={{ flex: "1", justifyContent: "center" }}>Manuals</h2>
      </div>

      <div className={styles.manualList}>
        {manualData.map((manual, index) => (
          <div key={index} className={styles.manualItem}>
            <h3 style={{ margin: "0", textAlign: "center", flex: "1" }}>
              {manual.title}
            </h3>
            <img src={manual.imageUrl} alt={manual.title} />
            <a href={manual.link} target="_blank" rel="noopener noreferrer">
              {/* <a href={manual.link}> */}
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManualStaff;
