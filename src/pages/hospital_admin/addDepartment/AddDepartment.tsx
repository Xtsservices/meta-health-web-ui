import React, { ChangeEvent } from "react";
import styles from "./addDepartment.module.scss";
import admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../../src/assets/sidebar/search_icon.png";
import add_icon from "./../../../../src/assets/addstaff/add_icon.png";
import Dialog from "@mui/material/Dialog";
import { makeStyles } from "@mui/styles";
import AddDepartmentDialog from "./AddDepartmentDialog";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { departmentType } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSeachStore } from "../../../store/zustandstore";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EditDepartment from "./EditDepartment";
import PopperMenu from "../../../component/Popper";
import anesthesia from "../../../assets/department/anesthesia.png";
import burn from "../../../assets/department/Burn.png";
import cardialogy from "../../../assets/department/Cardialogy.png";
import clinical from "../../../assets/department/Clincal.png";
import dermatology from "../../../assets/department/Dermatology.png";
import emergency from "../../../assets/department/Emergecny.png";
import endocrinology from "../../../assets/department/endocrinology.png";
import ent from "../../../assets/department/ENT.png";
import finance from "../../../assets/department/Finance.png";
import gastroenterology from "../../../assets/department/gastroenterology.png";
import generalsurgery from "../../../assets/department/Generalsurgery.png";
import hr from "../../../assets/department/HR.png";
import icu from "../../../assets/department/ICU.png";
import medicalcare from "../../../assets/department/Medicalcare.png";
import nicu from "../../../assets/department/NICU.png";
import obstetricsandgynaecology from "../../../assets/department/obstetricsandgynaecology.png";
import opthamology from "../../../assets/department/Opthamology.png";
import orthopedic from "../../../assets/department/Orthopedic.png";
import pathology from "../../../assets/department/Pathology.png";
import pediatrician from "../../../assets/department/Pediatrician.png";
import pharmacy from "../../../assets/department/Pharmacy.png";
import phisiotherapy from "../../../assets/department/Phisiotherapy.png";
import physiotherapyandRehabilitation from "../../../assets/department/PhysiotherapyandRehabitation.png";
import radiology from "../../../assets/department/Radialogy.png";
import reception from "../../../assets/department/Reception.png";
import trauma from "../../../assets/department/Trauma.png";
import urology from "../../../assets/department/urology.png";
import defaultIcon from "../../../assets/department/Emergecny.png";

const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px",
  },
});
function AddDepartment() {
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const { setSearchText, searchText } = useSeachStore();
  const [openEditDep, setOpenEditDep] = React.useState(false);
  const [currentDep, setCurrentDep] = React.useState({});
  const [nameChanged, setNameChanged] = React.useState(false);

  // Define a function to get the image based on department name
  const getDepartmentImage = (departmentName: string): string => {
    console.log("departmentName", departmentName);
    switch (departmentName.toLowerCase()) {
      case "anesthesiology":
        return anesthesia;
      case "burn":
        return burn;
      case "cardiology":
        return cardialogy;
      case "clinical":
        return clinical;
      case "dermatology":
        return dermatology;
      case "emergency department":
        return emergency;
      case "endocrinology":
        return endocrinology;
      case "ent":
        return ent;
      case "finance":
        return finance;
      case "gastroenterology":
        return gastroenterology;
      case "general surgery":
        return generalsurgery;
      case "hr":
        return hr;
      case "icu":
        return icu;
      case "medical care":
        return medicalcare;
      case "nicu":
        return nicu;
      case "obstetrics and gynecology":
        return obstetricsandgynaecology;
      case "ophthalmology":
        return opthamology;
      case "orthopedics":
        return orthopedic;
      case "pathology":
        return pathology;
      case "pediatrics":
        return pediatrician;
      case "pharmacy":
        return pharmacy;
      case "physical therapy":
        return phisiotherapy;
      case "physiotherapy and rehabilitation":
        return physiotherapyandRehabilitation;
      case "radiology":
        return radiology;
      case "reception":
        return reception;
      case "trauma":
        return trauma;
      case "urology":
        return urology;
      default:
        return defaultIcon;
    }
  };

  // const navigate = useNavigate();
  const [page, setPage] = React.useState({
    limit: 10,
    page: 1,
  });
  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  React.useEffect(() => {
    const getAllDepartment = async () => {
      const response = await authFetch(
        `department/${user.hospitalID}`,
        user.token
      );
      if (response?.message == "success") {
        setData(response.departments);
      } else {
        // console.log("error occured in fetching data", response);
      }
    };
    getAllDepartment();
    if (nameChanged) {
      getAllDepartment();
    }
  }, [nameChanged, user]);

  const [dataTable, setDataTable] = React.useState<departmentType[][]>([]);
  const [data, setData] = React.useState<departmentType[]>([]);
  React.useEffect(() => {
    setDataTable([]);
    const pages = Math.ceil(data.length / page.limit);
    const newArray = Array(pages).fill([]);
    newArray.forEach((index) => {
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

  const handleOpenDepDialog = (e1: any) => {
    setNameChanged(false);
    setCurrentDep(e1);
    setOpenEditDep(true);
  };

  const handleCloseDepDialog = () => {
    setOpenEditDep(false);
  };

  console.log(dataTable, "dataTable");

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
              cursor: "pointer",
              padding: "10px 20px",
              fontWeight: "bold",
              color: "white", // Ensures text is readable on the blue background
            }}
          >
            <img
              src={add_icon}
              alt=""
              style={{ marginRight: "5px", marginTop: "5px" }}
            />
            Add Department
          </button>
        </div>
      </div>
      {/* ====================header top button end ======================= */}

      <div className={admin_styles.main_info_right}>
        <div className={styles.container}>
          <div className={styles.wardInfoContainer}>
            {dataTable[page.page - 1]?.map((el) => {
              return (
                <div className={styles.wardInfoCard} key={el.name}>
                  {new Date(el.addedOn || "")
                    .toLocaleString("en-GB")
                    .split(",")[0] ===
                  new Date().toLocaleString("en-GB").split(",")[0] ? (
                    <div className={styles.wardInfoNewTag1}>New</div>
                  ) : (
                    <div></div>
                  )}
                  <div
                    className={styles.edit}
                    onClick={() => handleOpenDepDialog(el)}
                  >
                    <EditRoundedIcon style={{ margin: "10px" }} />
                  </div>

                  <div className={styles.wardInfoIconContainer}>
                    <img
                      className={styles.wardInfoCardIcon}
                      src={getDepartmentImage(el.name)} // Call the switch case function here
                      alt={el.name}
                    />
                  </div>

                  <div className={styles.wardInfoCardContent}>
                    <h2 className={styles.wardInfoCardTitle}>{el.name}</h2>
                    <ul
                      style={{
                        listStyleType: "none",
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      <li>Staff: {el.count}</li>
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
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                setPage((prevValue) => {
                  return { ...prevValue, limit: Number(event.target.value) };
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
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <AddDepartmentDialog open={open} setOpen={setOpen} setData={setData} />
      </Dialog>

      <Dialog
        open={openEditDep}
        onClose={handleCloseDepDialog}
        classes={{ paper: classes.dialogPaper }}
      >
        <EditDepartment
          setOpen={setOpenEditDep}
          currentDep={currentDep}
          setNameChanged={setNameChanged}
        />
      </Dialog>
    </>
  );
}

export default AddDepartment;
