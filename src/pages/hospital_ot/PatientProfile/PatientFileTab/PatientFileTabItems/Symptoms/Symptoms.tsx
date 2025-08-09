import styles from "./Symptoms.module.scss";
import usePatientFileStore from "../../../../../../store/formStore/ot/usePatientFileForm";

const SymptomsOT = () => {
  const { symptoms } = usePatientFileStore();

  return (
    <div className={styles.symptomsContainer}>
      <table className={styles.symptomsTable}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Symptoms</th>
            <th>Duration</th>
            <th>Time and Date of Symptom</th>
            <th>Updated by</th>
          </tr>
        </thead>
        <tbody>
          {symptoms?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.symptom}</td>
              <td>{item.duration}</td>
              <td>{item.time}</td>
              <td>{item.updatedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SymptomsOT;
