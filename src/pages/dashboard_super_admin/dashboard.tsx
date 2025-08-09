import styles from "./dashboard.module.scss";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import total_hospital_icon from "./../../../src/assets/sadmin/total_hospital.png";
import total_patient_icon from "./../../../src/assets/sadmin/total_staff.png";
import total_staff_icon from "./../../../src/assets/sadmin/total_patient_icon.png";
import hospitals_icon from "./../../../src/assets/sadmin/hospitals.png";
import super_admin_styles from "./../../component/sidebar/super_admin_styles.module.scss";
import admin_styles from "./../../component/sidebar/admin_styles.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import { capitalizeFirstLetter } from "./../../utility/global";
import PopperMenu from "../../component/Popper";
import search_icon from "./../../../src/assets/sidebar/search_icon.png";
import { useSeachStore } from "../../store/zustandstore";
import { useNavigate } from "react-router-dom";

interface Count {
  tables: string;
  Count: number;
}

interface Hospital {
  id: number;
  name: string;
  city: string;
  state: string;
  addedOn: string;
}

function SuperAdminDashboard() {
  const user = useSelector(selectCurrentUser);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [totalHospitals, setTotalHospitals] = useState<number>(0);
  const [totalStaffs, setTotalStaffs] = useState<number>(0);
  const [recentHospitals, setRecentHospitals] = useState<Hospital[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { setSearchText } = useSeachStore();
  const navigate = useNavigate();

  const getAllData = async () => {
    try {
      const response = await authFetch(`/hospital/count`, user.token);
      if (response && response.message === "success" && response.count) {
        response.count.forEach((item: Count) => {
          if (item.tables === "Hospitals") {
            setTotalHospitals(item.Count);
          } else if (item.tables === "Users") {
            setTotalStaffs(item.Count);
          } else if (item.tables === "Patients") {
            setTotalPatients(item.Count);
          }
        });
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchRecentHospitals = async () => {
    try {
      const response = await authFetch(`/hospital/recent`, user.token);
      if (response && response.message === "success" && response.hospitals) {
        // Sort hospitals by the 'addedOn' timestamp in descending order
        const sortedHospitals = response.hospitals.sort(
          (a: Hospital, b: Hospital) =>
            new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime()
        );

        // Get the first five hospitals
        // const recentHospitals = sortedHospitals.slice(0, 5);
        setRecentHospitals(sortedHospitals);
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user.token) {
      getAllData();
      fetchRecentHospitals();
    }
  }, [user.token]);


  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };
  return (
    <>

      <div className={admin_styles.main_header}>
        <div className={admin_styles.main_header_top}>
          <div className={admin_styles.main_header_top_search}>
            <img src={search_icon} alt="" className="" />
            <input
              type="text"
              className="input_search"
              placeholder="Search"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setSearchText(event.target.value);
              }}
            />
          </div>

          <div
            className={super_admin_styles.header_profile}
            onClick={() => navigate("/sadmin")}
          >
            <div className={super_admin_styles.header_profile_name}>
              {user.firstName || "Unknown"}
              <p style={{ color: "#1977F3" }}>SuperAdmin</p>
            </div>
            <div ref={anchorRef} onClick={handleToggle} style={{ cursor: "pointer" }}>
              {user.imageURL ? (
                <img
                  src={user.imageURL}
                  alt="Profile"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              ) : (
                <AccountCircleIcon fontSize="large" />
              )}
            </div>
          </div>
          <PopperMenu
            setOpen={setOpenMenu}
            open={openMenu}
            url={"/sadmin/profile"}
            anchorRef={anchorRef}
            color={"#c0e4ff"}
          />
        </div>
      </div>

      <div className={super_admin_styles.main_header}>

        <div className={super_admin_styles.main_header_bottom}>
          <div className={super_admin_styles.welcome}>
            <h1 className={super_admin_styles.header_heading}>
              Welcome {user.firstName}
            </h1>
          </div>
        </div>
      </div>
      <div className={super_admin_styles.main_info_right}>
        <div className={styles.container}>
          <div className={styles.container_cards}>
            <div
              className={styles.container_cards_item + " " + styles.card_pink}
            >
              <img src={total_hospital_icon} alt="" className="" />
              <h2 className="">{totalHospitals}</h2>
              <p className="">Total Hospitals</p>
            </div>
            <div
              className={styles.container_cards_item + " " + styles.card_violet}
            >
              <img src={total_patient_icon} alt="" className="" />
              <h2 className="">{totalPatients}</h2>
              <p className="">Total patients</p>
            </div>
            <div
              className={styles.container_cards_item + " " + styles.card_orange}
            >
              <img src={total_staff_icon} alt="" className="" />
              <h2 className="">{totalStaffs}</h2>
              <p className="">Total Staffs</p>
            </div>
          </div>
          <div className={styles.container_title}>
            Recently Added Hospitals
            {/* <br /> */}
            <div className={styles.recent_container}>
              {recentHospitals.map((element, index) => (
                <div
                  key={index}
                  className={`${styles.container_widz} ${styles[`container_widz_${index}`]
                    }`}
                >
                  <img src={hospitals_icon} alt="" className="" />
                  <h2 className="">{capitalizeFirstLetter(element?.name)}</h2>
                  <p className="">{`${capitalizeFirstLetter(
                    element.city
                  )}, ${capitalizeFirstLetter(element.state)}`}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
        <PopperMenu
            setOpen={setOpenMenu}
            open={openMenu}
            url={"/sadmin/profile"}
            anchorRef={anchorRef}
            color={"#c0e4ff"}
          />
      </div>
    </>
  );
}

export default SuperAdminDashboard;
