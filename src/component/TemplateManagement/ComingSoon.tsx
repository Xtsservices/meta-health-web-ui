import admin_styles from "./../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../assets/sidebar/search_icon.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";
import { useSelector } from "react-redux";
import { useSeachStore } from "../../store/zustandstore";
import { selectCurrentUser } from "../../store/user/user.selector";
import PopperMenu from "../Popper";

function ComingSoon() {
    const { setSearchText, searchText } = useSeachStore();
  const [openMenu, setOpenMenu] = React.useState(false);
  const user = useSelector(selectCurrentUser);
  const anchorRef = React.useRef<HTMLDivElement>(null);

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
              value={searchText}
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        backgroundColor: "white",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "25px",
      }}
    >
      <h1 style={{ color: "grey", fontSize: "3rem", fontWeight: "bold" }}>
        Coming Soon
      </h1>
    </div>
    </>
  );
}

export default ComingSoon;
