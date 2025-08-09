import styles from "./Header.module.scss";
import { FaSearch, FaUserCircle } from "react-icons/fa";

import yantramLogo from "../../../assets/reception/circlemeta.jpg";

function Header() {
  return (
    <header className={styles.header}>
      <div>
        <img src={yantramLogo} alt="Logo" className={styles.logo__img} />
      </div>
      <div className={styles.search__bar}>
        <FaSearch className={styles.search__icon} />
        <input type="text" placeholder="Search..." />
      </div>
      <div className={styles.profile}>
        <FaUserCircle className={styles.profile__icon} />
        <div className={styles.username}>Username</div>
      </div>
    </header>
  );
}

export default Header;
