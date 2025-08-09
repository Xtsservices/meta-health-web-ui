import React, { useRef } from "react";
import styles from "./TreatmentTab.module.scss";
import search_gif from "./../../../../../src/assets/PatientProfile/search_gif.gif";
import button_arrow from "./../../../../../src/assets/PatientProfile/button_arrow_icon.svg";
import Capsule_icon_svg from "../../../../assets/reception/svgIcons/capsule_icon_svg";
import Tablet_svg from "../../../../assets/PatientProfile/tablet_svg";
import Syrups_svg from "../../../../assets/PatientProfile/syrups_svg";
import Injection_svg from "../../../../assets/PatientProfile/injection_svg";
import Frame_svg from "../../../../assets/PatientProfile/frame_svg";
import search_icon from "./../../../../../src/assets/sidebar/search_icon.png";
import DataTable from "./TreatmentTable";
import Timeline from "./Timeline";
import { useSelector } from "react-redux";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
// import AddMedicine from "./AddMedicine";
import { MedicineType } from "../../../../types";
import { medicineCategory } from "../../../../utility/medicine";
import Button from "@mui/material/Button";
type TabbuttonProp = {
  index: number;
  placeholder: string;
};

function TreatmentTab() {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  // const [isTreatment, setIsTreament] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isTimeline, setIsTimeline] = React.useState(false);
  // const [addMedicine, setAddMedicine] = React.useState(false);
  const [medicineList, setMedicineList] = React.useState<MedicineType[]>([]);
  const getAllMedicineApi = useRef(true);
  const getAllMedicine = async () => {
    const response = await authFetch(`medicine/${timeline.id}`, user.token);
    // console.log("medicine timeline", response);
    if (response.message == "success") {
      setMedicineList(response.medicines);
    }
  };
  React.useEffect(() => {
    if (user.token && timeline.id && getAllMedicineApi.current) {
      getAllMedicineApi.current = false;
      getAllMedicine();
    }
  }, [user, timeline]);
  function TabButton({ index, placeholder }: TabbuttonProp) {
    return (
      <button
        style={{
          background: `${index == tabIndex ? "#F90" : "#F0F0F0"}`,
          transition: "all 0.5s",
        }}
        onClick={() => setTabIndex(index)}
      >
        <div className={styles.button_icon}>
          {/* <img src={capsules_icon} alt="" />
           */}
          {index == 0 && (
            <Capsule_icon_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 1 && (
            <Syrups_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 2 && (
            <Tablet_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 3 && (
            <Injection_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 4 && (
            <Frame_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
        </div>
        <span style={{ color: `${index == tabIndex ? "white" : "#8A8A8A"}` }}>
          {placeholder}
        </span>
        <img src={button_arrow} alt="" className={styles.button_arrow} />
      </button>
    );
  }
  // console.log("medi", medicineList);
  return (
    <>
      {!medicineList.length ? (
        <div className={styles.container_empty}>
          <img src={search_gif} alt="" />
          <p>No treatment plan yet!</p>
        </div>
      ) : (
        ""
      )}
      {medicineList.length && !isTimeline ? (
        <div className={styles.container}>
          <div className={styles.container_header}>
            <h4>Medication History</h4>
            <Button
              variant="contained"
              onClick={() => setIsTimeline(true)}
              sx={{ ml: "auto",borderRadius: "20px" }}
            >
              View Timeline
            </Button>
          </div>
          <div className={styles.container_main}>
            <div className={styles.tab_container}>
              <TabButton index={0} placeholder={"Capsules"} />
              <TabButton index={1} placeholder={"Syrups"} />
              <TabButton index={2} placeholder={"Tablets"} />
              <TabButton index={3} placeholder={"Injections"} />
              <TabButton index={4} placeholder={"IV Line"} />
            </div>
            {tabIndex == 0 ? (
              <div className={styles.tabpanel}>
                <div className={styles.tabpanel_header}>
                  <h3>Capsules</h3>
                  <div className={styles.search}>
                    <input type="text" placeholder="Search" />
                    <img src={search_icon} alt="" />
                  </div>
                </div>
                <div className={styles.tabpanel_list}>
                  <DataTable
                    category={medicineCategory.capsules}
                    medicineList={medicineList}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            {tabIndex == 1 ? (
              <div className={styles.tabpanel}>
                <div className={styles.tabpanel_header}>
                  <h3>Syrups</h3>
                  <div className={styles.search}>
                    <input type="text" placeholder="Search" />
                    <img src={search_icon} alt="" />
                  </div>
                </div>
                <div className={styles.tabpanel_list}>
                  <DataTable
                    category={medicineCategory.syrups}
                    medicineList={medicineList}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            {tabIndex == 2 ? (
              <div className={styles.tabpanel}>
                <div className={styles.tabpanel_header}>
                  <h3>Tablets</h3>
                  <div className={styles.search}>
                    <input type="text" placeholder="Search" />
                    <img src={search_icon} alt="" />
                  </div>
                </div>
                <div className={styles.tabpanel_list}>
                  <DataTable
                    category={medicineCategory.tablets}
                    medicineList={medicineList}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            {tabIndex == 3 ? (
              <div className={styles.tabpanel}>
                <div className={styles.tabpanel_header}>
                  <h3>Injections</h3>
                  <div className={styles.search}>
                    <input type="text" placeholder="Search" />
                    <img src={search_icon} alt="" />
                  </div>
                </div>
                <div className={styles.tabpanel_list}>
                  <DataTable
                    category={medicineCategory.injections}
                    medicineList={medicineList}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            {tabIndex == 4 ? (
              <div className={styles.tabpanel}>
                <div className={styles.tabpanel_header}>
                  <h3>ivLine</h3>
                  <div className={styles.search}>
                    <input type="text" placeholder="Search" />
                    <img src={search_icon} alt="" />
                  </div>
                </div>
                <div className={styles.tabpanel_list}>
                  <DataTable
                    category={medicineCategory.ivLine}
                    medicineList={medicineList}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {medicineList.length && isTimeline ? (
        <>
          {" "}
          <div className={styles.container}>
            <div className={styles.container_header}>
              <h4>Medication Timeline</h4>
              {/* <Button
                variant="contained"
                onClick={() => setAddMedicine(true)}
                sx={{ ml: "auto" }}
              >
                Add Medicine
              </Button> */}
              <Button
                variant="contained"
                onClick={() => setIsTimeline(false)}
                sx={{ ml: "auto",borderRadius: "20px" }}
              >
                View Medicine
              </Button>
            </div>

            <Timeline />
          </div>
        </>
      ) : (
        <></>
      )}
      {/* <AddMedicine setOpen={setAddMedicine} open={addMedicine} /> */}
    </>
  );
}

export default TreatmentTab;
