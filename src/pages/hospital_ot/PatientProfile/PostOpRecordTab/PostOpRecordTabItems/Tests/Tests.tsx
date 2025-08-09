import React from "react";
// import { Button, TextField } from '@mui/material';
import styles from "./Tests.module.scss";
import usePostOPStore from "../../../../../../store/formStore/ot/usePostOPForm";

// interface Test {
//   test: string;
//   ICD_Code: string;
// }

const Tests: React.FC = () => {
  const { tests } = usePostOPStore();
  // const [newTest, setNewTest] = useState<Test>({ test: '', ICD_Code: '' });

  // const handleAddTest = () => {
  //   if (newTest.test && newTest.ICD_Code) {
  //     addTest(newTest);
  //     setNewTest({ test: '', ICD_Code: '' });
  //   }
  // };

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   field: keyof Test
  // ) => {
  //   setNewTest({ ...newTest, [field]: e.target.value });
  // };
 
  console.log("alm",tests)
  console.log("alm",0)
  return (
    <div className={styles.testContainer}>
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
    </div>
  );
};

export default Tests;
