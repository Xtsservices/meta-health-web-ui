import styles from './dropdown-menu.module.scss';

import React, { useState } from 'react';

const DropDownListItem = ({ children }: { children: React.ReactNode }) => {
  return <li>{children}</li>;
};

const DropDownMenu = ({
  children,
  title,
  iconDark,
  iconLight,
}: {
  children: React.ReactNode;
  title: string;
  iconDark: string;
  iconLight: string;
}) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((open) => !open);

  return (
    <div className={styles.dropDownContainer}>
      <button
        className={styles.dropDownMenu}
        onClick={toggle}
        style={{
          cursor: 'pointer',
          color: open ? 'white' : '#8a8a8a',
          backgroundColor: open ? 'hsla(213, 100%, 60%, 0.56)' : 'transparent',
        }}
      >
        {open && <img src={iconLight} />}
        {!open && <img src={iconDark} />}
        <span>
          {title}
          <img src="" />
        </span>
      </button>
      {open && children}
    </div>
  );
};

const DropDownList = ({ children }: { children: React.ReactNode }) => {
  return <ul>{children}</ul>;
};

export { DropDownListItem, DropDownMenu, DropDownList };
