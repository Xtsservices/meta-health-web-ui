import React, { useRef } from "react";
import styles from "./Videos.module.scss";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import Total_Patients_Image from "../../assets/help/Total_Patients.png";
import Total_Inpatients_Image from "../../assets/help/Total_Inpatients.png";
import Discharge_Patients_Image from "../../assets/help/Discharge_Patients.png";
import ThisMonth_Image from "../../assets/help/ThisMonth.png";
import ThisYear_Image from "../../assets/help/ThisYear.png";
import PatientVisitByWard_Image from "../../assets/help/PatientVisitByWard.png";

const sectionsData = [
  {
    id: 1,
    heading: "Total Patient Card",
    paragraph:
      "Provides a comprehensive count of all patients currently admitted across various wards in the hospital. Quickly view the total number of inpatients and monitor ward-specific patient distribution.",
    imageUrl: Total_Patients_Image,
  },
  {
    id: 2,
    heading: "Active Patient Card",
    paragraph:
      "Displays the count of patients currently receiving active treatment, including those undergoing procedures or receiving care in various wards. Stay informed about ongoing cases in real time",
    imageUrl: Total_Inpatients_Image,
  },
  {
    id: 3,
    heading: "Discharge Patient Card",
    paragraph:
      "Shows the total count of patients recently discharged, along with key details like discharge dates, treatment summaries, and follow-up plans. Easily track completed cases for smooth post-care coordination.",
    imageUrl: Discharge_Patients_Image,
  },
  {
    id: 4,
    heading: "Month Patient Card",
    paragraph:
      "Displays the total number of patients managed during the current month, including admissions, active treatments, and discharges. Track visits across modules such as Triage, Emergency (Red, Yellow, Green), Pathology, and Radiology. Analyze monthly hospital performance and module-specific trends with ease",
    imageUrl: ThisMonth_Image,
  },
  {
    id: 5,
    heading: "Year Patient Card",
    paragraph:
      "Shows the total number of patients managed throughout the year, including admissions, active treatments, and discharges. Additionally, track visits across modules such as Triage, Emergency (Red, Yellow, Green), Pathology, and Radiology for the current year. Analyze hospital performance and module-specific trends effortlessly.",
    imageUrl: ThisYear_Image,
  },
  {
    id: 6,
    heading: "Patient Visit By Ward Card (Pie Chart)",
    paragraph:
      "Visualize patient visits across different wards using an interactive pie chart. The chart categorizes visits by week, month, and year, helping you easily identify the busiest wards and analyze trends over time.",
    imageUrl: PatientVisitByWard_Image,
  },
];

const DashboardInfo: React.FC = () => {
  const navigate = useNavigate();

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSection, setActiveSection] = React.useState<number | null>(null);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(index);
  };

  return (
    <div className={styles.container} style={{backgroundColor:"white"}}>
      <div
        style={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderBottom : "1px solid #e0e0e0"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 style={{ marginRight: "10px" }}>
            <IconButton aria-label="delete" onClick={() => navigate("..")}>
              <ArrowBackIosIcon />
            </IconButton>
          </h3>
          <h2 style={{ flex: "1", justifyContent: "center" }}>
            Understanding Your Dashboard
          </h2>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <div
          style={{
            flex: "0.7",
            marginRight: "20px",
            overflowY: "auto",
            height: "calc(100vh - 100px)", 
            scrollbarWidth: "thin", 
            scrollbarColor: "#888 #f1f1f1", 
          }}
        >
          {sectionsData.map((section, index) => (
            <div
              key={section.id}
              ref={(el) => (sectionRefs.current[index] = el)} 
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                padding: "40px 20px",
                borderBottom: "1px solid #e0e0e0", 
              }}
            >
              <div style={{ flex: "1", textAlign: "start" }}>
                <h3>{section.heading}</h3>
                <p style={{ fontWeight:"400" }}>{section.paragraph}</p>
              </div>
              <img
                src={section.imageUrl}
                alt={section.heading}
                style={{ width: "200px", height: "150px", marginLeft: "20px" }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            flex: "0.3",
            right: 0,
            top: "80px", 
            width: "30%",
            padding: "20px",
            zIndex: 999,
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, textAlign: "start" }}>
            {sectionsData.map((section, index) => (
              <li key={section.id} style={{ marginBottom: "30px" }}>
                <a
                  href={`#${section.heading}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(index);
                  }}
                  style={{
                    textDecoration: activeSection === index ? "underline" : "none",
                    textDecorationColor: activeSection === index ? "gray" : "transparent",
                    textDecorationThickness: "3px",
                    fontWeight: activeSection === index ? "bold" : "normal",
                    color: "black",
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardInfo;