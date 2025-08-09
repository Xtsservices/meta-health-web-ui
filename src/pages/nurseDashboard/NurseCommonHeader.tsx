import React from "react";
import nurse_styles from "./../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../src/assets/sidebar/search_icon.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PopperMenu from "../../component/Popper";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "./../../store/user/user.selector";
import { useSeachStore } from "../../store/zustandstore";
import { useLocation } from 'react-router-dom';



function NurseCommonHeader() {
  const user = useSelector(selectCurrentUser);
  const { searchText, setSearchText } = useSeachStore();
  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
 const location = useLocation();
 const currentPath = location.pathname
    

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
    console.log("searchText",searchText)
  };

  return (
    <div className={nurse_styles.main_header}>
      <div className={nurse_styles.main_header_top}>
        <div className={nurse_styles.main_header_top_search}>
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
          className={nurse_styles.header_profile}
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
          url={`${currentPath}/profile`}
          anchorRef={anchorRef}
          color={"#c0e4ff"}
        />
      </div>
    </div>
  );
}

export default NurseCommonHeader;
