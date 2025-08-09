import { useEffect, useState } from "react";
import styles from "./EmergencyOrderManagement.module.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
// import { PharmacyOrder } from "../../../../utility/medicine";
import { authFetch } from "../../../../axios/useAuthFetch";
import PatientOuterTable from "../OuterTable";

const EmergencyOrderManagement = () => {
  const user = useSelector(selectCurrentUser);
  const [opdPharmacyOrder, setOpdPharmacyOrder] = useState<any[]>([]);

  // useEffect(() => {
  //   const getMedicineInventoryPatientsOrderWithType = async () => {
  //     const response = await authFetch(
  //       `/medicineInventoryPatientsOrder/${
  //         user.hospitalID
  //       }/${"completed"}/3/getMedicineInventoryPatientsOrderWithType`,
  //       user.token
  //     );
  //     if (response.status == 200) {
  //       console.log(response.data);
  //       setOpdPharmacyOrder(response.data);
  //     }
  //   };

  //   if (user.hospitalID && user.token) {
  //     getMedicineInventoryPatientsOrderWithType();
  //   }
  // }, [user.hospitalID, user.token]);


  useEffect(() => {
    const getMedicineInventoryPatientsOrderCompletedWithoutReg = async () => {
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${user.hospitalID}/getMedicineInventoryPatientsOrderCompletedWithoutReg`,
        user.token
      );
      if (response.status === 200) {
        setOpdPharmacyOrder(response.data);
      }
    };

    if (user.hospitalID && user.token) {
      getMedicineInventoryPatientsOrderCompletedWithoutReg();
    }
  }, [user.hospitalID, user.token]);

  return (
    <div className={styles.container}>
      <PatientOuterTable
        title="Walk-In Orders"
        data={opdPharmacyOrder}
        isButton={false}
        patientOrder="patientOrder"
        sale="sale"
      />
    </div>
  );
};

export default EmergencyOrderManagement;
