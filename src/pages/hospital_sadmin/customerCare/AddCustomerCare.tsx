import React from "react";
import styles from "../../hospital_admin/AddStaff/AddStaff.module.scss";
import admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../../src/assets/sidebar/search_icon.png";
import add_icon from "./../../../../src/assets/addstaff/add_icon.png";

import Dialog from "@mui/material/Dialog";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch } from "react-redux/es/exports";


import { authFetch } from "../../../axios/useAuthFetch";
import { useSeachStore } from "../../../store/zustandstore";
import {
  setLoading,
} from "../../../store/error/error.action";
import PopperMenu from "../../../component/Popper";
// import {
//   setAllStaff,
//   setMultipleStaff,
// } from "../../../store/staff/staff.action";
// import { departmentType, staffType } from "../../../types";
// import * as XLSX from "xlsx";
// import { authPost } from "../../../axios/useAuthPost";
import { CustomerCareUser } from "../../../utility/formTypes";
// import Tooltip from "@mui/material/Tooltip";
// import image from "./../../../../src/assets/addstaff/image.png";
// import { SCOPE_LIST } from "../../../utility/role";

import AddStaffForm from "../../hospital_admin/AddStaff/AddStaffForm";
import CustomerCareTable from "./CustomerCareTable";

const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
  },
});

function AddCustomerCare() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [open, setOpen] = React.useState(false);

  const [customerCareUsers, setCustomerCareUsers] = React.useState<
    CustomerCareUser[]
  >([]);

  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const { setSearchText } = useSeachStore();
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getAllCustomerCareUsers = async () => {
    dispatch(setLoading(true));

    const response = await authFetch(
      "user/getAllCustomerCareUsers",
      user.token
    );
    console.log("response", response);
    if (response.message == "success") {
      if (response?.users) {
        setCustomerCareUsers(response.users);
      }
    }
    dispatch(setLoading(false));
  };

  React.useEffect(() => {
    if (user.token) getAllCustomerCareUsers();
  }, [user]);

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
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
            ref={anchorRef}
            onClick={handleToggle}
          >
            {user.imageURL ? (
              <img src={user.imageURL} alt="" className="" />
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
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

      <div className={admin_styles.adminwelcomecontainer}>
        <h1 style={{ paddingLeft: "10px" }}></h1>

        <div style={{ display: "flex" }}>
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
                color: "white",
              }}
            >
              <img
                src={add_icon}
                alt=""
                style={{ marginRight: "5px", marginTop: "5px" }}
              />
              Add Customer Care Executive
            </button>
          </div>
        </div>
      </div>
      {/* ====================header top button end ======================= */}

      <div className={admin_styles.main_info_right}>
        <div className={styles.container}>
          <div className={styles.container_header}>
            Customer Care Executive Details
          </div>
          <div className={styles.container_table}>
            <CustomerCareTable data={customerCareUsers} onSuccess={getAllCustomerCareUsers}/>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        classes={{ paper: classes.dialogPaper }}
      >
        <AddStaffForm
          open={open}
          setOpen={setOpen}
          type={"customercare"}
          onSuccess={getAllCustomerCareUsers}
        />
      </Dialog>
    </>
  );
}

export default AddCustomerCare;
