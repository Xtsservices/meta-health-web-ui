import React, { ChangeEvent } from "react";
import styles from "./addWard.module.scss";
import admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../../src/assets/sidebar/search_icon.png";
import ward_icon from "./../../../../src/assets/wardbed.png";
import Dialog from "@mui/material/Dialog";
import { makeStyles } from "@mui/styles";
import AddWardDialog from "./AddWardDialog";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { wardType } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSeachStore } from "../../../store/zustandstore";
import MenuItems from "./MenuItem";
import PopperMenu from "../../../component/Popper";
import add_icon from "./../../../../src/assets/addstaff/add_icon.png";

const useStyles = makeStyles({
  dialogPaper: {
    // width: "600px",
    minWidth: "700px",
  },
});
function AddWard() {
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const { setSearchText, searchText } = useSeachStore();
  // const navigate = useNavigate();
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1,
  });

  const [dataTable, setDataTable] = React.useState<wardType[][]>([]);
  const [data, setData] = React.useState<wardType[]>([]);
  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };
  React.useEffect(() => {
    const getAllWard = async () => {
      // console.log("user", user);
      const response = await authFetch(`ward/${user.hospitalID}`, user.token);
      // console.log("all wards", response);
      if (response?.message == "success") {
        setData(response.wards);
      } else {
        // console.log("error occured in fetching data", response);
      }
    };
    getAllWard();
  }, [user]);
  React.useEffect(() => {
    setDataTable([]);
    const pages = Math.ceil(data.length / page.limit);
    const newArray = Array(pages).fill([]);
    newArray.forEach((_el, index) => {
      setDataTable((prev) => {
        return [
          ...prev,
          data
            .filter((el) =>
              el.name.toLowerCase().includes(searchText.toLowerCase())
            )
            .slice(index * page.limit, (index + 1) * page.limit),
        ];
      });
    });
  }, [page, data, searchText]);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          <button
            className={admin_styles.header_button}
            onClick={handleClickOpen}
            style={{
              backgroundColor: "#1977f3",
              borderRadius: "30px",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "white", // Ensures text is readable on the blue background
            }}
          >
            <img
              src={add_icon}
              alt=""
              style={{ marginRight: "5px", marginTop: "5px" }}
            />
            Add Ward
          </button>
        </div>
      </div>
      {/* ====================header top button end ======================= */}

      <div className={admin_styles.main_info_right}>
        <div className={styles.container}>
          <div className={styles.wardInfoContainer}>
            {dataTable[page?.page - 1]?.map((el) => {
              return (
                <div className={styles.wardInfoCard} key={el.id}>
                  <div className={styles.wardInfoCardTop}>
                    {new Date(el.addedOn || "")
                      .toLocaleString("en-GB")
                      .split(",")[0] ===
                    new Date().toLocaleString("en-GB").split(",")[0] ? (
                      <div className={styles.wardInfoNewTag1}>New</div>
                    ) : (
                      <div></div>
                    )}
                    <MenuItems id={el.id} setData={setData} />
                  </div>

                  <div className={styles.wardInfoIconContainer}>
                    <img
                      className={styles.wardInfoCardIcon}
                      src={ward_icon}
                      alt="department"
                    />
                  </div>
                  <div className={styles.wardInfoCardContent}>
                    <h2 className={styles.wardInfoCardTitle}>
                      {el.name.charAt(0).toUpperCase() +
                        el.name.slice(1).toLowerCase()}
                    </h2>
                    <ul
                      style={{
                        listStyleType: "none",
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      <li>Total Beds: {el.totalBeds || 0}</li>
                      <li>Available Beds: {el.availableBeds || 0}</li>
                    </ul>
                    {/* <p className={styles.wardInfoBedInfo}>Total Beds: {el.totalBeds || 0}</p>
          <p className={styles.wardInfoBedInfo}>Available Beds: {el.availableBeds || 0}</p> */}
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
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                setPage((prevValue) => {
                  return { ...prevValue, limit: Number(event.target.value) };
                });
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
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
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <AddWardDialog open={open} setOpen={setOpen} setData={setData} />
      </Dialog>
    </>
  );
}

export default AddWard;
