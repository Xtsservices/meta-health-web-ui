import React from "react";
import styles from "./AllDevices.module.scss";
import admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../../src/assets/sidebar/search_icon.png";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { authFetch } from "../../../axios/useAuthFetch";
import { deviceType, hubType } from "../../../types";
import cardiology_icon from "./../../../../src/assets/cardiology_icon.png";
import { useSeachStore } from "../../../store/zustandstore";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/error/error.action";
import PopperMenu from "../../../component/Popper";

function AllDevices() {
  const user = useSelector(selectCurrentUser);
  type data = {
    icon: string;
    name: string;
    id: number;
    status: string;
  };
  const [data, setData] = React.useState<deviceType[]>([]);
  const [Allhub, setAllHub] = React.useState<hubType[]>([]);
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1,
  });
  const [selectedHub, setSelectedHub] = React.useState<number>(0);
  const [dataTable, setDataTable] = React.useState<deviceType[][]>([]);
  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const { setSearchText, searchText } = useSeachStore();
  const dispatch = useDispatch();
  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };
  React.useEffect(() => {
    const filteredData = data.filter((device) => {
      const search = searchText?.toLowerCase() || "";
      // Filter by macId or code
      return (
        device.macId?.toLowerCase().includes(search) ||
        device.code?.toLowerCase().includes(search)
      );
    });

    const pages = Math.ceil(filteredData.length / page.limit);
    const newDataTable = Array.from({ length: pages }, (_, index) =>
      filteredData.slice(index * page.limit, (index + 1) * page.limit)
    );

    setDataTable(newDataTable);
  }, [page, data, searchText]);

  async function getAllHub() {
    try {
      const response = await authFetch(`hub/${user.hospitalID}`, user.token);
      console.log("Hub API response:", response);
      if (response.message === "success") {
        setAllHub(response.hubs);
      }
    } catch (error) {
      console.error("Hub API error:", error);
    }
  }

  async function getAllDevices() {
    dispatch(setLoading(true));
    if (selectedHub) {
      const response = await authFetch(`device/${selectedHub}`, user.token);
      if (response.message == "success") {
        setData(response.devices);
      }
    }
    if (!selectedHub) {
      const response = await authFetch(
        `device/hospital/${user.hospitalID}/all`,
        user.token
      );
      if (response.message == "success") {
        setData(response.devices);
      }
    }
    dispatch(setLoading(false));
  }
  React.useEffect(() => {
    getAllHub();
  }, [user]);
  React.useEffect(() => {
    getAllDevices();
  }, [selectedHub, user]);
  return (
    <>
      {/* ====================header top button start======================= */}
      <div className={admin_styles.main_header}>
        <div className={admin_styles.main_header_top}>
          <div className={admin_styles.main_header_top_search}>
            <img src={search_icon} alt="" className="" />
            <input
              type="text"
              className="input_search"
              placeholder="Search"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
        <h1 style={{ paddingLeft: "10px" }}></h1>

        <div className={admin_styles.buttons}>
          <select
            name="filter"
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedHub(Number(event.target.value));
            }}
            style={{
              backgroundColor: "#1977f3",
              color: "white",
              borderRadius: "30px",
              border: "none",
              padding: "10px 20px",
              fontWeight: "bold",
              cursor: "pointer",
              outline: "none",
              appearance: "none", // Removes the default dropdown arrow icon
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            <option
              value={0}
              style={{ backgroundColor: "#ffffff", color: "#000000" }}
            >
              All Devices
            </option>
            {Allhub.map((hub) => (
              <option
                key={hub.id}
                value={hub.id}
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
              >
                {hub.hubcode || hub.hubName}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* ====================header top button end ======================= */}

      <div className={admin_styles.main_info_right}>
        <div className={styles.container}>
          <h3 style={{ alignSelf: "flex-start" }}>All Devices</h3>

          <div className={styles.wardInfoContainer}>
            {dataTable[page.page - 1]?.map((el) => {
              return (
                <div className={styles.wardInfoCard} key={el.deviceName}>
                  <div className={styles.wardInfoIconContainer}>
                    <img
                      className={styles.wardInfoCardIcon}
                      src={cardiology_icon} // Call the switch case function here
                      alt={el.deviceName || el.code}
                    />
                  </div>

                  <div className={styles.wardInfoCardContent}>
                    <h2 className={styles.wardInfoCardTitle}>
                      {el.code || el.deviceName}
                    </h2>
                    <ul
                      style={{
                        listStyleType: "none",
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      <li> {el.deviceAddress}</li>
                      {el?.macId && <li>Mac ID: {el.macId}</li>}
                      <li>Hub ID: {el?.hubID || "N/A"}</li>
                      <li>Invoice No: {el?.invoiceNumber || "N/A"}</li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {data?.length >= 10 && (
          <div className={styles.page_navigation}>
            Results Per Page
            <select
              name="filter"
              id=""
              style={{ width: "5%" }}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setPage((prevValue) => {
                  return { ...prevValue, limit: Number(event.target.value) };
                  // });
                });
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={data.length}>All</option>

              {/* <option value="Year">Year</option> */}
            </select>
            <IconButton
              aria-label="delete"
              disabled={page.page == 1}
              onClick={() => {
                setPage((prevValue) => {
                  return { ...prevValue, page: prevValue.page - 1 };
                });
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              disabled={Math.ceil(data.length / page.limit) == page.page}
              onClick={() => {
                setPage((prevValue) => {
                  return { ...prevValue, page: prevValue.page + 1 };
                });
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        )}
      </div>
    </>
  );
}

export default AllDevices;
