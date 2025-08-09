import { useRef, useState } from "react";
import styles from "./Header.module.scss";
import { FaSearch } from "react-icons/fa";
import PopperMenu from "../../common/popper/Popper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectCurrentUser } from "../../../store/user/user.selector";
import yantramLogo from "../../../../src/assets/cross_logo.png";

function Header({ searchHandler, search }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };
  return (
    <header className={styles.header}>
      <div onClick={() => navigate(`/hospital-dashboard`)}>
        <img src={yantramLogo} alt="Logo" className={styles.logo__img} />
      </div>
      <div className={styles.search__bar}>
        <FaSearch className={styles.search__icon} />
        <input
          type="text"
          placeholder="Search Patient by Mobile Number"
          value={search}
          onChange={searchHandler}
        />
      </div>

      <div
        className={styles.header_profile}
        ref={anchorRef}
        onClick={handleToggle}
      >
        {user.imageURL && <img src={user.imageURL} alt="" className="" />}
        {/* {!user.imageURL && <AccountCircleIcon />} */}
        {!user.imageURL && (
          <div
            className={styles.header_profile_name}
            style={{
              backgroundColor: "#023f80", // change to the desired background color
              borderRadius: "50%", // makes the element circular
              width: "40px", // specify a width
              height: "40px", // specify a height
              display: "flex", // center the text
              alignItems: "center", // vertically center the text
              justifyContent: "center", // horizontally center the text
              color: "#fff", // change to the desired text color
              fontSize: "20px", // change to the desired font size
              fontWeight: "bold", // change to the desired font weight
            }}
          >
            {user.firstName ? user.firstName.charAt(0).toUpperCase() : ""}
          </div>
        )}
      </div>
      {open && (
        <PopperMenu
          setOpen={setOpen}
          open={open}
          url={"/hospital-dashboard/labs/profile"}
          anchorRef={anchorRef}
        />
      )}
    </header>
  );
}

export default Header;
