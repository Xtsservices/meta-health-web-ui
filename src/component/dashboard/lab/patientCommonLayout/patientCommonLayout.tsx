import styles from './patientCommonLayout.module.scss';
import LabPatientProfile from '../patientProfile/patientProfileCard';

import { Outlet } from 'react-router-dom';

const LabPatientCommonLayout = () => {
  return (
    <div className={styles.container}>
      <div>
        <LabPatientProfile />
      </div>
      <Outlet />
    </div>
  );
};

export default LabPatientCommonLayout;
