import React, { useEffect } from 'react';
import styles from './sidebar.module.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';

type ButtonPro = {
  linkName: string;
  name: string;
  iconLight?: string;
  iconDark: string;
  exact?: boolean;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isAlert?: boolean;
  bgColor?:string
};

export function Buttons({
  linkName,
  name,
  iconLight,
  iconDark,
  exact = false,
  setSearch,
  bgColor
}: ButtonPro): JSX.Element {
  const [isActive, setisActive] = React.useState(false);
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    setSearch('');
    if (exact) {
      if (location.pathname == linkName) {
        setisActive(true);
      } else setisActive(false);
    } else {
      if (location.pathname.includes(linkName)) {
        setisActive(true);
      } else {
        setisActive(false);
      }
    }
  }, [exact, linkName, location, setSearch, user]);

  return (
    <NavLink
      to={linkName}
      className={
        isActive
          ? styles.sidebar_button + ' ' + bgColor || styles.active
          : styles.sidebar_button
      }
    >
      <div className={styles.sidebar_button_icon}>
        {!isActive ? (
          <img src={iconDark} alt="" className="dark" />
        ) : (
          <img src={iconLight} alt="" className="light" />
        )}
      </div>
      {name}
    </NavLink>
  );
}
