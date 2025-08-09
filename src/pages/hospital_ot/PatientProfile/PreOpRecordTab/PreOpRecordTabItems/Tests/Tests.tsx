import React from "react";
import styles from "./Tests.module.scss";
import usePreOpStore from "../../../../../../store/formStore/ot/usePreOPForm";

const Tests: React.FC = () => {
  const { tests } = usePreOpStore();

  return (
    <div className={styles.testContainer}>
      <table className={styles.testTable}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Tests</th>
            <th>ICD Code</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.test}</td>
              <td>{item.ICD_Code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tests;
