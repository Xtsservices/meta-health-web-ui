import React from "react";
import styles from "./allHub.module.scss";
import admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../../src/assets/sidebar/search_icon.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
// import { data } from "./../data";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { hubType } from "../../../types";
import hubIcon from "./../../../../src/assets/allHub/device_icon.jpeg";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSeachStore } from "../../../store/zustandstore";
// import { useNavigate } from "react-router-dom";
import PopperMenu from "../../../component/Popper";
function AllHub() {
  const user = useSelector(selectCurrentUser);
  // const navigate = useNavigate();
  type data = {
    icon: string;
    name: string;
    id: number;
    status: string;
  };
  const [page, setPage] = React.useState({
    limit: 6,
    page: 1,
  });
  const [dataTable, setDataTable] = React.useState<hubType[][]>([]);
  const [data, setData] = React.useState<hubType[]>([]);
  const [filter, setFilter] = React.useState(-1);
  const { setSearchText, searchText } = useSeachStore();
  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  async function getAllHub() {
    try {
      if (!user?.hospitalID || !user?.token) {
        console.error("Missing user data:", user);
        return;
      }
      const response = await authFetch(`hub/${user.hospitalID}`, user.token);
      console.log("API response:", response);
      if (response.message === "success") {
        setData(response.hubs);
      } else {
        console.error("API failed:", response.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  }
  React.useEffect(() => {
    getAllHub();
  }, [user]);

  React.useEffect(() => {
    const filteredData = data
      .filter((hub) => {
        const search = searchText?.toLowerCase() || "";
        // Prioritize hubName if it exists; otherwise, check hubMacId or hubcode
        if (hub.hubName) {
          return hub.hubName.toLowerCase().includes(search);
        }
        return (
          hub.hubMacId?.toLowerCase().includes(search) ||
          hub.hubcode?.toLowerCase().includes(search)
        );
      });

    const pages = Math.ceil(filteredData.length / page.limit);
    const newDataTable = Array.from({ length: pages }, (_, index) =>
      filteredData.slice(index * page.limit, (index + 1) * page.limit)
    );

    setDataTable(newDataTable);
  }, [page, data, searchText, filter]);


  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };
  console.log("dataTable", dataTable)
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter(Number(e.target.value));
            }}
            value={filter}
            style={{
              backgroundColor: "#1977f3",
              color: "white",
              borderRadius: "30px",
              border: "none",
              padding: "10px 20px",
              fontWeight: "bold",
              cursor: "pointer",
              outline: "none",
              appearance: "none", // Hides the default arrow icon
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            <option
              value="-1"
              style={{ backgroundColor: "#ffffff", color: "#000000" }}
            >
              All
            </option>
            <option
              value="1"
              style={{ backgroundColor: "#ffffff", color: "#000000" }}
            >
              Online
            </option>
            <option
              value="0"
              style={{ backgroundColor: "#ffffff", color: "#000000" }}
            >
              Offline
            </option>
          </select>
        </div>
      </div>
      {/* ====================header top button end ======================= */}

      <div className={admin_styles.main_info_right}>
        <div className={styles.container}>
          <h3 style={{ alignSelf: "flex-start" }}>All Hubs</h3>

          <div className={styles.wardInfoContainer}>
            {dataTable[page.page - 1]?.map((el) => {
              return (
                <div className={styles.wardInfoCard} key={el.hubName}>
                  <div className={styles.wardInfoIconContainer}>
                    <img
                      className={styles.wardInfoCardIcon}
                      src={hubIcon} // Call the switch case function here
                      alt={el.hubName || el.hubMacId}
                    />
                  </div>

                  <div className={styles.wardInfoCardContent}>
                    <h2 className={styles.wardInfoCardTitle}>
                      {el.hubName || el.hubMacId}
                    </h2>
                    <ul
                      style={{
                        listStyleType: "none",
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      <li> {el.hubcode || el.id}</li>
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
                });
              }}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={data?.length}>All</option>

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

export default AllHub;
