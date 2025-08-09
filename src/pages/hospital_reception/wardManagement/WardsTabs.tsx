import React, { useEffect, useState } from "react";
import styles from "./WardTabs.module.scss";
import DynamicWardRenderer from "./DynamicWardRenderer";
import { Ward } from "../../../types";

interface WardProps {
  wards: Ward[];
}

const WardsTabs: React.FC<WardProps> = ({ wards }) => {
  const [activeTabId, setActiveTabId] = useState(wards[0]?.id || "");

  useEffect(() => {
    if (wards.length > 0) {
      setActiveTabId(wards[0].id);
    }
  }, [wards]);

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        {wards.map((ward) => {
          return (
            <button
              key={ward.id}
              className={`${activeTabId === ward.id ? styles.active : ""}`}
              onClick={() => setActiveTabId(ward.id)}
            >
              {ward.name}
            </button>
          );
        })}
      </div>
      <div className={styles.tabContent}>
        <DynamicWardRenderer activeTabId={activeTabId} wards={wards} />
      </div>
    </div>
  );
};

export default WardsTabs;
