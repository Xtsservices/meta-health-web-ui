import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./dashboard.module.scss";
import BarGraph from "./bargraph";
import CircularProgress from "./circular_progressbar";
import admin_styles from "./../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../src/assets/sidebar/search_icon.png";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "./../../store/user/user.selector";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch } from "react-redux";
import { setAllStaff } from "../../store/staff/staff.action";
import { selectAllStaff } from "../../store/staff/staff.selector";
import { authFetch } from "../../axios/useAuthFetch";
import {
  Role_NAME,
  Role_list,
  Role_list_Type,
  patientCategory
} from "../../utility/role";
import { useSeachStore } from "../../store/zustandstore";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../store/error/error.action";
import BarGraphWard from "./bargraphWard";
import BarGraphDoctor from "./bargraphDoctor";
import { departmentType, staffType } from "../../types";
import { capitalizeFirstLetter } from "../../utility/global";
import PopperMenu from "../../component/Popper";
import { BiSun } from "react-icons/bi";
import { MdNightlightRound } from "react-icons/md";
import {
  currentDateObj,
  dateObj,
  getCalenderOption
} from "../../utility/calender";
import doctorpng from "../../assets/Doctorsimg.png";
import nursepng from "../../assets/Nurseimg.png";
import patientspng from "../../assets/patientsimg.png";
import otherspng from "../../assets/othersimg.png";
import MyTasks from "./MyTasks";

type deviceType = {
  inPatient: number;
  outPatient: number;
  emergency: number;
};

const months = [
  { value: "1", name: "January" },
  { value: "2", name: "February" },
  { value: "3", name: "March" },
  { value: "4", name: "April" },
  { value: "5", name: "May" },
  { value: "6", name: "June" },
  { value: "7", name: "July" },
  { value: "8", name: "August" },
  { value: "9", name: "September" },
  { value: "10", name: "October" },
  { value: "11", name: "November" },
  { value: "12", name: "December" }
];

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const allStaff = useSelector(selectAllStaff);
  const [nurseCount, setNurseCount] = useState<number>(0);
  const [doctorCount, setDoctorCount] = useState<number>(0);
  const [othersCount, setothersCount] = useState<number>(0);
  const [, setInpatientCount] = useState<number>(0);
  const [allPatientCount, setAllpatientCount] = useState<number>(0);
  const { searchText, setSearchText } = useSeachStore();
  const navigate = useNavigate();
  const [, setCurrentTime] = useState<string>("");
  const [barGraphFilter, setbarGraphFilter] = useState("month");
  const [deviceData, setDeviceData] = useState<deviceType | null>(null);
  const [hubData, setHubData] = useState<deviceType | null>(null);
  const [wardDurationFilter, setWardDurationFFilter] =
    useState<string>("month");
  const [subFilter, setSubFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<number>(0);
  const [doctorID, setDoctorID] = useState<number>(0);
  const [departmentID, setDepartmentID] = useState<number>(0);
  const [doctorList, setDoctorList] = useState<staffType[]>([]);
  const [departmentList, setDepartmentList] = useState<departmentType[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [doctorBarGraphYear, setDoctorBarGraphYear] = useState<string>(
    String(new Date().getFullYear())
  );

  const currentMonth = String(new Date().getMonth() + 1);

  const [doctorBarGraphMonth, setDoctorBarGraphMonth] =
    useState<string>(currentMonth);

  const today = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayName = days[today.getDay()];


  const date = today.getDate();
  const month = today.toLocaleString("default", { month: "short" }); // e.g., "Jan"

  // Get year
  const year = today.getFullYear();

  const [time24hr, setTime24hr] = useState("");
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours(); // Keep as a number
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime24hr(`${hours.toString().padStart(2, "0")}:${minutes}`);

      // Check if it's daytime (6 AM to 6 PM)
      setIsDaytime(hours >= 6 && hours < 18);
    };

    // Initial call to set time and icon
    updateTime();

    // Update time every minute
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const [filterPatientByStatus, setFilterPatientByStatus] =
    useState<dateObj>(currentDateObj);

  const anchorRef = useRef<HTMLDivElement>(null);
  const getAllDepartment = async () => {
    const data = await authFetch(`department/${user.hospitalID}`, user.token);
    console.log("deprtdata", data);

    if (data.departments.length) {
      setDepartmentList(data.departments);
    }
    const doctorResponse = await authFetch(
      `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
      user.token
    );
    console.log("doctorResponse", doctorResponse);
    if (doctorResponse.message == "success") {
      setDoctorList(doctorResponse.users);
      if (data.message == "success") {
        setDoctorID(doctorResponse.users[0].id);
        setDepartmentID(doctorResponse.users[0].departmentID);
      }
    }
  };
  const fetchAllStaff = async () => {
    dispatch(setLoading(true));
    console.log("user=============", user.hospitalID);

    const response = await authFetch(
      `user/gettallstaff/${user.hospitalID}`,
      user.token
    );
    console.log("setAllStaff===============", response);
    if (response.message == "success") {
      dispatch(setAllStaff(response.users));
    } else {
      // console.log("error in fething all staff", response);
    }

    const allpatientResponse = await authFetch(
      `patient/${user.hospitalID}/patients/count/all`,
      user.token
    );
    if (allpatientResponse.message == "success") {
      setAllpatientCount(allpatientResponse.count);
    }

    const inpatientResponse = await authFetch(
      `patient/${user.hospitalID}/patients/count/2`,
      user.token
    );
    if (inpatientResponse.message == "success") {
      setInpatientCount(inpatientResponse.count);
    }
    const deviceResponse = await authFetch(
      `patient/${user.hospitalID}/patients/devicePercentage`,
      user.token
    );
    console.log("deviceResponse", deviceResponse);
    if (deviceResponse.message == "success")
      setDeviceData({
        inPatient:
          deviceResponse.percentages.inPatient == "NaN"
            ? 0
            : deviceResponse.percentages.inPatient,
        outPatient:
          deviceResponse.percentages.outPatient == "NaN"
            ? 0
            : deviceResponse.percentages.outPatient,
        emergency:
          deviceResponse.percentages.emergency == "NaN"
            ? 0
            : deviceResponse.percentages.emergency
      });
    const hubResponse = await authFetch(
      `patient/${user.hospitalID}/patients/hubPercentage`,
      user.token
    );
    if (hubResponse.message == "success")
      setHubData({
        inPatient:
          hubResponse.percentages.inPatient == "NaN"
            ? 0
            : hubResponse.percentages.inPatient,
        outPatient:
          hubResponse.percentages.outPatient == "NaN"
            ? 0
            : hubResponse.percentages.outPatient,
        emergency:
          hubResponse.percentages.emergency == "NaN"
            ? 0
            : hubResponse.percentages.emergency
      });
    dispatch(setLoading(false));
  };

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    if (user.token) {
      fetchAllStaff();
      getAllDepartment();
    }
  }, [user]);
  useEffect(() => {
    if (searchText) {
      navigate("/inpatient/admin/addstaff");
    }
  }, [searchText]);

  useEffect(() => {
    if (allStaff.length) {
      let docCount = 0;
      let nurCount = 0;
      let othersCount = 0;
      allStaff.forEach((staff) => {
        const role = Role_list[staff.role as keyof Role_list_Type];
        if (role == "doctor") docCount += 1;
        if (role == "nurse") nurCount += 1;
        if (role !== "nurse" && role !== "doctor") othersCount += 1;
      });
      setDoctorCount(docCount);
      setNurseCount(nurCount);
      setothersCount(othersCount);
      // allStaff.forEach((el))
    }
  }, [allStaff]);

  useEffect(() => {
    setSubFilter(currentDateObj[wardDurationFilter as keyof dateObj]);
  }, [wardDurationFilter]);

  const getCurrentTime = (): string => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    };

    const currentTime = new Date().toLocaleTimeString(
      "en-US",
      options as Intl.DateTimeFormatOptions
    );
    return currentTime;
  };
  useEffect(() => {
    setCurrentTime(getCurrentTime());
    setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000 * 60);
  }, []);


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
            className={admin_styles.header_profile}
            // onClick={() => navigate("/inpatient/admin/profile")}
            ref={anchorRef}
            onClick={handleToggle}
          >
            {user.imageURL ? (
              <img src={user.imageURL} alt="" className="" />
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
            {/* <img src={profile_pic} alt="" className="" /> */}
          </div>
          <PopperMenu
            setOpen={setOpenMenu}
            open={openMenu}
            url={"/inpatient/admin/profile"}
            anchorRef={anchorRef}
            color={"#c0e4ff"}
          />
        </div>
      </div>

      <div className={admin_styles.adminwelcomecontainer}>
        <h1 style={{ paddingLeft: "10px" }}>
          Welcom to Admin <br />
          Dashboard
        </h1>
        <div className={admin_styles.adminsidetimecontainer}>
          <div className={admin_styles.admintimecontainer}>
            <h1 className={admin_styles.time}>{time24hr}</h1>
            {isDaytime ? (
              <BiSun
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginTop: "8px",
                  marginLeft: "2px"
                }}
              />
            ) : (
              <MdNightlightRound
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginTop: "8px",
                  marginLeft: "2px"
                }}
              />
            )}
          </div>
          <ul className={admin_styles.ul}>
            <li>{dayName}</li>
            <li>{`${date} ${month}`}</li>
            <li>{year}</li>
          </ul>
        </div>
      </div>

      <div className={admin_styles.main_info_right}>
        <div className={styles.container}>
          <div className={styles.container_cards}>
            {/* =========doctors======= */}
            <div
              className={`${styles.container_cards_item}`}
              style={{
                backgroundImage: `url(${doctorpng})`,
                backgroundSize: "cover", // Adjusts the image to cover the container
                backgroundPosition: "center", // Centers the image
                backgroundRepeat: "no-repeat" // Prevents image repetition
              }}
            >
              <ul className={admin_styles.ul}>
                <li className={admin_styles.listitemdoc}>Doctors</li>
                <li className={admin_styles.listitemcount}>{doctorCount}</li>
              </ul>
              {/* <p className={admin_styles.maintext}>Doctor</p>
              <h1 style={{fontSize:'40px'}}>{doctorCount}</h1> */}
            </div>

            {/* ========Nurses========== */}
            <div
              className={`${styles.container_cards_item}`}
              style={{
                backgroundImage: `url(${nursepng})`,
                backgroundSize: "cover", // Adjusts the image to cover the container
                backgroundPosition: "center", // Centers the image
                backgroundRepeat: "no-repeat" // Prevents image repetition
              }}
            >
              <ul className={admin_styles.ul}>
                <li className={admin_styles.listitemdoc}>Nurses</li>
                <li className={admin_styles.listitemcount}>{nurseCount}</li>
              </ul>
            </div>

            {/* ==========patients========= */}

            <div
              className={`${styles.container_cards_item}`}
              style={{
                backgroundImage: `url(${patientspng})`,
                backgroundSize: "cover", // Adjusts the image to cover the container
                backgroundPosition: "center", // Centers the image
                backgroundRepeat: "no-repeat" // Prevents image repetition
              }}
            >
              <ul className={admin_styles.ul}>
                <li className={admin_styles.listitemdoc}>Patients</li>
                <li className={admin_styles.listitemcount}>
                  {allPatientCount}
                </li>
              </ul>
            </div>

            {/* ==========others========= */}

            <div
              className={`${styles.container_cards_item}`}
              style={{
                backgroundImage: `url(${otherspng})`,
                backgroundSize: "cover", // Adjusts the image to cover the container
                backgroundPosition: "center", // Centers the image
                backgroundRepeat: "no-repeat" // Prevents image repetition
              }}
            >
              <ul className={admin_styles.ul}>
                <li className={admin_styles.listitemdoc}>Others</li>
                <li className={admin_styles.listitemcount}>{othersCount}</li>
              </ul>
            </div>
          </div>

          <div className={styles.container_graphs}>
            <div className={styles.bargraph}>
              <div className={styles.bargraph_header}>
                <h3 className="">
                  {barGraphFilter[0].toUpperCase() +
                    barGraphFilter.slice(1).toLowerCase() +
                    "ly" +
                    " "}
                  Summary
                </h3>
                <div>

                  <select
                    name="filter"
                    id=""
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setbarGraphFilter(e.target.value)
                    }
                    value={barGraphFilter}
                    className={styles.margin_left_auto}
                    style={{ marginTop: "1rem" }}
                  >
                    {/* <option value="week">Week</option> */}
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                  <select
                    style={{ marginTop: "1rem" }}
                    name="filter"
                    id=""
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFilterPatientByStatus((state) => {
                        state[barGraphFilter as keyof dateObj] = e.target.value;
                        return { ...state };
                      })
                    }
                    value={
                      filterPatientByStatus[barGraphFilter as keyof dateObj] || ""
                    }
                  >
                    {getCalenderOption[barGraphFilter].map((el) => (
                      <option value={el.value}>{el.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <BarGraph
                filter={barGraphFilter}
                filterPatientByStatus={filterPatientByStatus}
              />
            </div>

            <div className={styles.piechart}>
              <MyTasks />
            </div>

          </div>

          {/* =============ward=============== */}
          <div className={styles.container_graphs} id="ward_stat">
            <div className={styles.bargraph}>
              <div className={styles.bargraph_header}>
                <h3 className="">
                  {wardDurationFilter[0].toUpperCase() +
                    wardDurationFilter.slice(1).toLowerCase() +
                    "ly" +
                    " "}
                  Summary of Ward
                </h3>
                <div>


                  <select
                    style={{ marginTop: "1rem" }}
                    name="filter"
                    id=""
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setWardDurationFFilter(e.target.value)
                    }
                    value={wardDurationFilter}
                    className={styles.margin_left_auto}
                  >
                    {/* <option value="week">Week</option> */}
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                  <select
                    style={{ marginTop: "1rem" }}
                    name="filter"
                    id=""
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSubFilter(e.target.value)
                    }
                    value={subFilter || ""}
                  >
                    {getCalenderOption[wardDurationFilter]?.map((el) => {
                      return <option value={el.value}>{el.name}</option>;
                    })}
                  </select>
                  <select
                    style={{ marginTop: "1rem" }}
                    name="filter"
                    id=""
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setCategoryFilter(Number(e.target.value))
                    }
                    value={categoryFilter}
                    className="custom-select"
                  >
                    <option value="0">All Patients</option>
                    <option value={patientCategory.neonate}>Neonate</option>
                    <option value={patientCategory.child}>Child</option>
                    <option value={patientCategory.adult}>Adult</option>
                  </select>
                </div>
              </div>
              <BarGraphWard
                filter={wardDurationFilter}
                category={categoryFilter}
                filterValue={subFilter || ""}
              />
            </div>
          </div>

          {/* ============doctor============= */}
          <div
            className={styles.container_graphs + " " + styles.height_small}
            id="doctor_stat"
          >
            <div className={styles.bargraph}>
              <div className={styles.bargraph_header}>
                <h3 className="">
                  {/* {wardDurationFilter[0].toUpperCase() +
                    wardDurationFilter.slice(1).toLowerCase() +
                    "ly" +
                    " "} */}
                  Number of patients treated by a doctor
                </h3>
                <div>

                  <select
                    style={{ marginTop: "1rem" }}
                    name="filter"
                    id=""
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setDepartmentID(Number(e.target.value));
                      const id = doctorList?.find(
                        (doctor) => doctor.departmentID == Number(e.target.value)
                      )?.id;
                      setDoctorID(id || 0);
                    }}
                    value={departmentID}
                    className={styles.margin_left_auto}
                  >
                    {departmentList.map((department) => (
                      <option value={department.id}>
                        {capitalizeFirstLetter(department.name)}
                      </option>
                    ))}
                  </select>
                  <select
                    style={{ marginTop: "1rem" }}
                    name="filter"
                    id=""
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setDoctorID(Number(e.target.value))
                    }
                    value={doctorList.length ? doctorID : "0"}
                  >
                    {doctorList.length ? (
                      doctorList
                        .filter((doctor) => doctor.departmentID == departmentID)
                        .map((doctor) => (
                          <option value={doctor.id}>
                            {capitalizeFirstLetter(doctor.firstName || " ") +
                              " " +
                              capitalizeFirstLetter(doctor.lastName || " ")}
                          </option>
                        ))
                    ) : (
                      <option value="0">No Doctor</option>
                    )}
                    {/* <option value={patientCategory.adult}>Adult</option> */}
                  </select>
                  <select
                    style={{ marginTop: "1rem" }}
                    name="filter"
                    id=""
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setDoctorBarGraphYear(e.target.value)
                    }
                    value={doctorBarGraphYear}
                  >
                    {getCalenderOption.year.map((el) => (
                      <option value={el.value}>{el.name}</option>
                    ))}
                  </select>
                  <select
                    style={{ marginTop: "1rem" }}
                    name="filter"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setDoctorBarGraphMonth(e.target.value)
                    }
                    value={doctorBarGraphMonth}
                  >
                    {months.map((el) => (
                      <option key={el.value} value={el.value}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <BarGraphDoctor
                doctorID={doctorID}
                year={doctorBarGraphYear}
                month={doctorBarGraphMonth}
              />
            </div>

          </div>

          {/* =================devices=============== */}
          <div className={styles.container_stats}>
            <div className={styles.container_stats_progressbar}>
              <h4 style={{ marginBottom: "20px" }}>
                Percentage usage of Devices
              </h4>
              <div className={styles.container_stats_progressbar_circular}>
                <CircularProgress
                  percentage1={deviceData?.outPatient || 0}
                  percentage2={deviceData?.inPatient || 0}
                  percentage3={deviceData?.emergency || 0}
                />
                <div className={styles.label_container}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <div
                      className={styles.label + " " + styles.label_outpatient}
                    ></div>
                    Outpatient ({deviceData?.outPatient || 0}%)
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <div
                      className={styles.label + " " + styles.label_inpatient}
                    ></div>
                    Inpatient ({deviceData?.inPatient || 0}%)
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <div
                      className={styles.label + " " + styles.label_emergency}
                    ></div>
                    Emergency ({deviceData?.emergency || 0}%)
                  </div>
                </div>
              </div>
              {/* <CircularProgress percentage={60} name={"Emergency"} />
              <CircularProgress percentage={80} name={"Inpatient"} />
              <CircularProgress percentage={30} name={"Out Patient"} /> */}
            </div>

            <div className={styles.container_stats_progressbar}>
              <h4 style={{ marginBottom: "20px" }}>Percentage usage of Hubs</h4>
              {/* <CircularProgress percentage={60} name={"Emergency"} />
              <CircularProgress percentage={80} name={"Inpatient"} />
              <CircularProgress percentage={30} name={"Out Patient"} /> */}
              <div className={styles.container_stats_progressbar_circular}>
                <CircularProgress
                  percentage1={hubData?.outPatient || 0}
                  percentage2={hubData?.inPatient || 0}
                  percentage3={hubData?.emergency || 0}
                />
                <div className={styles.label_container}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <div
                      className={styles.label + " " + styles.label_outpatient}
                    ></div>
                    Outpatient ({hubData?.outPatient || 0}%)
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <div
                      className={styles.label + " " + styles.label_inpatient}
                    ></div>
                    Inpatient ({hubData?.inPatient || 0}%)
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <div
                      className={styles.label + " " + styles.label_emergency}
                    ></div>
                    Emergency ({hubData?.emergency || 0}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
