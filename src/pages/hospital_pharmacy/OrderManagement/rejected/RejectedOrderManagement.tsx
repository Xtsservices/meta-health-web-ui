import { useEffect, useState } from "react";
import styles from "./RejectedOrderManagement.module.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
// import { PharmacyOrder } from "../../../../utility/medicine";
import PatientOuterTable from "../OuterTable";

const RejectedOrderManagement = () => {
  const user = useSelector(selectCurrentUser);
  const [rejectedPharmacyOrder, setRejectedPharmacyOrder] = useState<
    any[]
  >([]);

  useEffect(() => {
    const getMedicineInventoryPatientsOrder = async () => {
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${
          user.hospitalID
        }/${"rejected"}/getMedicineInventoryPatientsOrder`,
        user.token
      );
      if (response.status == 200) {
        console.log(response.data);
        setRejectedPharmacyOrder(response.data);
      }
    };

    if (user.hospitalID && user.token) {
      getMedicineInventoryPatientsOrder();
    }
  }, [user.hospitalID, user.token]);

  return (
    <div className={styles.container}>
      <PatientOuterTable
        title="Rejected Orders"
        data={rejectedPharmacyOrder}
        isButton={false}
        patientOrder="patientOrder"
        isRejectReason="rejectReason"
      />
    </div>
  );
};

export default RejectedOrderManagement;
