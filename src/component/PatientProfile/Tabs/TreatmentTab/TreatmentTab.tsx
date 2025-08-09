import React, { useRef } from "react";
import styles from "./TreatmentTab.module.scss";
import searchGif from "./../../../../../src/assets/PatientProfile/search_gif.gif";
import addIcon from "./../../../../../src/assets/addstaff/add_icon.png";
import buttonArrow from "./../../../../../src/assets/PatientProfile/button_arrow_icon.svg";
import Capsule_icon_svg from "../../../../assets/reception/svgIcons/capsule_icon_svg";
import TabletSvg from "../../../../assets/PatientProfile/tablet_svg";
import TopicalSvg from "../../../../assets/PatientProfile/topical_svg";
import TubeSvg from "../../../../assets/PatientProfile/tube_svg";
import SpraySvg from "../../../../assets/PatientProfile/spray_svg";
import DropSvg from "../../../../assets/PatientProfile/drops_sv";
import SyrupsSvg from "../../../../assets/PatientProfile/syrups_svg";
import InjectionSvg from "../../../../assets/PatientProfile/injection_svg";
import FrameSvg from "../../../../assets/PatientProfile/frame_svg";
import Ventilator_svg from "../../../../assets/ventilator";

// Import images for procedures
import VentilatorIcon from "../../../../assets/treatmentPlan/procedures/ventilator/ventilator_management.png";
import CentralLineIcon from "../../../../assets/treatmentPlan/procedures/ventilator/central_line_icon.png";
import CPRIcon from "../../../../assets/treatmentPlan/procedures/ventilator/cpr_icon.png";

import searchIcon from "./../../../../../src/assets/sidebar/search_icon.png";
import DataTable from "./TreatmentTable";
import Timeline from "./Timeline";
import { useSelector } from "react-redux";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import AddMedicine from "./AddMedicine/AddMedicine";
import { medicineCategory } from "../../../../utility/medicine";
import Button from "@mui/material/Button";
import { useMedicineListStore } from "../../../../store/zustandstore";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

type TabButtonProps = {
  index: number;
  placeholder: string;
};

type ProcedureButtonProps = {
  placeholder: string;
  icon: string; // Path to the icon/image
  isActive: boolean;
  onClick: () => void;
  bgColor?:string;
  textColor?:string
};

type User = {
  token: string;
};

type Timeline = {
  id: string;
};

const TreatmentTab: React.FC = () => {
  const user = useSelector(selectCurrentUser) as User;
  const timeline = useSelector(selectTimeline);
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const [procedureTabIndex, setProcedureTabIndex] = React.useState<number>(0); // State for procedure tab
  const [isTimeline, setIsTimeline] = React.useState<boolean>(false);
  const [addMedicine, setAddMedicine] = React.useState<boolean>(false);
  const [initialSection, setInitialSection] = React.useState<"addmedicine" | "procedure">();
  const { medicineList, setMedicineList } = useMedicineListStore();
  const getAllMedicineApi = useRef(true);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isProcedureExpanded, setIsProcedureExpanded] = React.useState(false);
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");


  const toggleExpand = () => {
    setIsExpanded((prev)=> !prev);
    setIsProcedureExpanded(false)
  };

  const toggleProcedureExpand = () => {
    setIsProcedureExpanded((prev)=>!prev);
    setIsExpanded(false)
  };

  const getAllMedicine = async () => {
    const response = await authFetch(`medicine/${timeline.id}`, user.token);
    if (response.message === "success") {
      setMedicineList(response.medicines);
    }
  };

  const isNurseRoute = window.location.pathname.includes("nurse");

  React.useEffect(() => {
    if (user.token && timeline.id && getAllMedicineApi.current) {
      getAllMedicineApi.current = false;
      getAllMedicine();
    }
  }, [user, timeline]);

  React.useEffect(() => {
    console.log("Updated initialSection:", initialSection);
  }, [initialSection]);

  console.log("medicineList2", medicineList);

  const TabButton: React.FC<TabButtonProps> = ({ index, placeholder }) => {
    return (
      <button
        style={{
          background: `${index === tabIndex ? "#F90" : "#F0F0F0"}`,
          transition: "all 0.5s",
          width: "100%",
          marginBottom: "6px",
        }}
        onClick={() => setTabIndex(index)}
      >
        <div className={styles.button_icon}>
          {index === 0 && (
            <Capsule_icon_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 1 && (
            <SyrupsSvg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 2 && (
            <TabletSvg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 3 && (
            <InjectionSvg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 5 && (
            <TubeSvg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 6 && (
            <TopicalSvg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 7 && (
            <DropSvg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 8 && (
            <SpraySvg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 4 && (
            <FrameSvg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 9 && (
            <Ventilator_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
        </div>
        <span style={{ color: `${index === tabIndex ? "white" : "#8A8A8A"}` }}>
          {placeholder}
        </span>
        <img src={buttonArrow} alt="" className={styles.button_arrow} />
      </button>
    );
  };

  const ProcedureButton: React.FC<ProcedureButtonProps> = ({ placeholder, icon, isActive, onClick,bgColor,textColor }) => {
    return (
      <button
        style={{
          background: `${isActive ? bgColor : "#F0F0F0"}`,
          transition: "all 0.5s",
          width: "100%",
          marginBottom: "6px",
          display: "flex",
          alignItems: "center",
          padding: "8px",
        }}
        onClick={onClick}
      >
        <div className={styles.button_icon} style = {{display:"flex", alignItems:"center"}} >
          <img src={icon} alt={placeholder} style={{ width: "24px", height: "24px" }} />
          <span style={{ color: `${ isActive ?  textColor : "#8A8A8A"}`, width:"85%", textAlign:"left"}}>
          {placeholder}
        </span>
       
        </div>
        <img src={buttonArrow} alt=""  style = {{marginLeft:"auto",color: `${ isActive ?  textColor : "#8A8A8A"}`}} />
       
      </button>
    );
  };

  const renderTabPanel = (category: number, title: string) => (
    <div className={styles.tabpanel}>
      <div className={styles.tabpanel_header}>
        <h3>{title}</h3>
        <div className={styles.search}>
          <input type="text" placeholder="Search" />
          <img src={searchIcon} alt="" />
        </div>
      </div>
      <div className={styles.tabpanel_list}>
        <DataTable category={category} medicineList={medicineList} />
      </div>
    </div>
  );

  const renderProcedureTabPanel = ( title: string) => (
    <div className={styles.tabpanel}>
      <div className={styles.tabpanel_header}>
        <h3>{title}</h3>
        <div className={styles.search}>
          <input type="text" placeholder="Search" />
          <img src={searchIcon} alt="" />
        </div>
      </div>
      <div className={styles.tabpanel_list}>
        {/* Replace this with your procedure-specific data table */}
        <p>Data table for {title} will go here.</p>
      </div>
    </div>
  );

  return (
    <>
      {!medicineList.length ? (
        <div className={styles.container_empty}>
          <img src={searchGif} alt="" />
          <div style={{ display: "flex", width: "50%", height: "300px", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>No treatment plan yet!</p>
              {!isNurseRoute && !isCustomerCare && <button onClick={() => { setAddMedicine(true); setInitialSection("addmedicine"); }}> 
                <img src={addIcon} alt="" />
                MEDICATION
              </button>}
            </div>
            <div style={{ borderRight: "1px solid #ccc", height: "150px" }}></div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>No treatment plan yet!</p>
              {!isNurseRoute && !isCustomerCare && <button onClick={() => { setAddMedicine(true); setInitialSection("procedure"); }}>
                <img src={addIcon} alt="" />
                PROCEDURE
              </button>}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {medicineList.length && !isTimeline ? (
        <div className={styles.container}>
          <div className={styles.container_header}>
            {/* <h4>Select Medication</h4> */}
            <div style={{ width: "300px", marginLeft: "auto" }}>
              
              {!isCustomerCare && <Button
                variant="contained"
                onClick={() => { setAddMedicine(true); setInitialSection("addmedicine"); }}
                sx={{ ml: "auto", borderRadius: "20px",display:isExpanded?"inLine": "none"}}
              >
                Add Medicine
              </Button>}
              
              {!isCustomerCare && <Button
                variant="contained"
                onClick={() => { setAddMedicine(true); setInitialSection("procedure"); }}
                sx={{ ml: "auto", borderRadius: "20px" , display:isProcedureExpanded? "inLine": "none" }}
              >
                +Procedure
              </Button>}
              {<Button variant="contained" onClick={() => setIsTimeline(true)} sx={{ borderRadius: "20px" }}>
                View Timeline
              </Button>}
            </div>
          </div>
          <div className={styles.container_main}>
            {/* Medication Collapsible Section */}
           
            <div className={styles.tab_container}>
              <ListItemButton onClick={toggleExpand}>
                <ListItemText primary="Medication" />
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {[
                    "Capsules",
                    "Syrups",
                    "Tablets",
                    "Injections",
                    "IV Line",
                    "Tubing",
                    "Topical",
                    "Drops",
                    "Spray",
                    "Ventilator",
                  ].map((placeholder, index) => (
                    <TabButton key={index} index={index} placeholder={placeholder} />
                  ))}
                </List>
              </Collapse>
              <ListItemButton onClick={toggleProcedureExpand}>
                <ListItemText primary="Procedure" />
                {isProcedureExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={isProcedureExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ProcedureButton    
                    placeholder="Ventilator Management"
                    bgColor = "#E7DEFF"
                    textColor="#452993"
                    icon={VentilatorIcon}
                    isActive={procedureTabIndex === 0}
                    onClick={() => setProcedureTabIndex(0)}
                  />
                  <ProcedureButton
                    placeholder="Cardiopulmonary Resuscitation (CPR)"
                    icon={CPRIcon}
                    bgColor="#FDBCCD"
                    textColor="#FF2A62"
                    isActive={procedureTabIndex === 1}
                    onClick={() => setProcedureTabIndex(1)}
                  />
                  <ProcedureButton
                    placeholder="Central Line Insertion"
                    icon={CentralLineIcon}
                    bgColor = "#FEE4BE"
                    textColor="#FF9900"
                    isActive={procedureTabIndex === 2}
                    onClick={() => setProcedureTabIndex(2)}
                  />
                  
                  <ProcedureButton 
                    placeholder="Urinary Catheter Insertion"
                    icon={CPRIcon}
                    bgColor="#D2F5FE"
                    textColor="#2BACCC"
                    isActive={procedureTabIndex === 3}
                    onClick={() => setProcedureTabIndex(3)}
                  />
                </List>
              </Collapse>
            </div>
            {/* Render Medication or Procedure Tab Panel */}
            {isProcedureExpanded ? (
              <>
                {procedureTabIndex === 0 && renderProcedureTabPanel( "Ventilator Management")}
                {procedureTabIndex === 1 && renderProcedureTabPanel( "Cardiopulmonary Resuscitation (CPR)")}
                {procedureTabIndex === 2 && renderProcedureTabPanel( "Central Line Insertion")}
                {procedureTabIndex === 3 && renderProcedureTabPanel( "Central Line Insertion")}
              
              </>
            ) : (
              <>
                {tabIndex === 0 && renderTabPanel(medicineCategory.capsules, "Capsules")}
                {tabIndex === 1 && renderTabPanel(medicineCategory.syrups, "Syrups")}
                {tabIndex === 2 && renderTabPanel(medicineCategory.tablets, "Tablets")}
                {tabIndex === 3 && renderTabPanel(medicineCategory.injections, "Injections")}
                {tabIndex === 4 && renderTabPanel(medicineCategory.ivLine, "IV Line")}
                {tabIndex === 5 && renderTabPanel(medicineCategory.Tubing, "Tubing")}
                {tabIndex === 6 && renderTabPanel(medicineCategory.Topical, "Topical")}
                {tabIndex === 7 && renderTabPanel(medicineCategory.Drops, "Drops")}
                {tabIndex === 8 && renderTabPanel(medicineCategory.Spray, "Spray")}
                {tabIndex === 9 && renderTabPanel(medicineCategory.Ventilator, "Ventilator")}
              </>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {medicineList.length && isTimeline ? (
        <div className={styles.container}>
          <div className={styles.container_header}>
            <h4>Medication Timeline</h4>
            {!isCustomerCare && <Button
              variant="contained"
              onClick={() => setAddMedicine(true)}
              sx={{ ml: "auto", borderRadius: "20px" }}
            >
              Add Medicine
            </Button>}
            {!isCustomerCare && <Button variant="contained" onClick={() => setIsTimeline(false)} sx={{ borderRadius: "20px", backgroundColor: "#ff9900" }}>
              View Medicine
            </Button>}
          </div>
          <Timeline />
        </div>
      ) : (
        <></>
      )}
      <AddMedicine
        setOpen={setAddMedicine}
        open={addMedicine}
        setIsTimeline={setIsTimeline}
        initialSection={initialSection}
      />
    </>
  );
};

export default TreatmentTab;