import styles from "./Sale.module.scss";
import PharmacyMedicine from "./PharmacyMedicine ";

const PharmacySale = () => {
  return (
    <div className={styles.container}>
      <PharmacyMedicine />
    </div>
  );
};

export default PharmacySale;
