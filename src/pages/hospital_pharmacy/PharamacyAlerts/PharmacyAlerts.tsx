import { useEffect, useState } from "react";
import styles from "./Alerts.module.scss";
import PatientOuterTable from "../OrderManagement/OuterTable";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { PharmacyOrder } from "../../../utility/medicine";

const PharmacyAlerts = () => {
  const user = useSelector(selectCurrentUser);
  // const [pharmacyOrder, setPharmacyOrder] = useState<PharmacyOrder[]>([]);
  const [opdOrders, setOpdOrders] = useState<PharmacyOrder[]>([]);
  const [ipdEmergencyOrders, setIpdEmergencyOrders] = useState<PharmacyOrder[]>(
    []
  );

  useEffect(() => {
    const getMedicineInventoryPatientsOrder = async () => {
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${
          user.hospitalID
        }/${"pending"}/getMedicineInventoryPatientsOrder`,
        user.token
      );
      console.log(response, "pharmacyOrder");

      if (response.status == 200) {
        console.log(response.data);
        const opdData = response.data.filter(
          (order: PharmacyOrder) => order.departmemtType === 1
        );
        const ipdEmergencyData = response.data.filter(
          (order: PharmacyOrder) =>
            order.departmemtType === 2 || order.departmemtType === 3
        );

        setOpdOrders(opdData);
        setIpdEmergencyOrders(ipdEmergencyData);
      }
    };

    if (user.hospitalID && user.token) {
      getMedicineInventoryPatientsOrder();
    }
  }, [user.hospitalID, user.token]);

  return (
    <div className={styles.container}>
      <div className={styles.button_container}>
       <button className={styles.button_border_color}> Pharmacy Alerts</button>
      </div>
      <PatientOuterTable
        title="Alerts From IPD and Emergency"
        data={ipdEmergencyOrders}
        isButton={true}
         alertFrom="Pharmacy"
      />
      <PatientOuterTable
        // title="Alerts From Doctor",
        title="Alerts From OPD"
        data={opdOrders}
        isButton={true}
        alertFrom="Pharmacy"
      />
      
    </div>
  );
};

export default PharmacyAlerts;
