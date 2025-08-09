import TriagePatientProfile from '../PatientProfile/PatientProfile';
import styles from './TriageFormsCommonLayout.module.scss';

import { Outlet } from 'react-router-dom';

const TriageFormsCommonLayout = () => {
  return (
    <div className={styles.container}>
      <div>
        <TriagePatientProfile />
      </div>
      <Outlet />
    </div>
  );
};

export default TriageFormsCommonLayout;
