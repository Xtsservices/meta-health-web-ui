import { useEffect, useState } from "react";
import styles from "./IpdOrderManagement.module.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { LabTestOrder, PharmacyOrder } from "../../../../utility/medicine";
import { authFetch } from "../../../../axios/useAuthFetch";
import PatientOuterTable from "../OuterTable";

const IpdOrderManagement = () => {
  const user = useSelector(selectCurrentUser);
  const [ipdPharmacyOrder, setIpdPharmacyOrder] = useState<PharmacyOrder[] | LabTestOrder[]>([]);
console.log(ipdPharmacyOrder, "ipdPharmacy")
  const isLabBilling =
    location.pathname.includes("radiology") ||
    location.pathname.includes("pathology");


    const getPatientBillingData = async () => {
      try {
        const response = await authFetch(
          `/test/${user.roleName}/${user.hospitalID}/${"approved"}/getBillingData`,
          user.token
        );
         //TODO: use this for rejecred tab api in radiology and pathology 
        // const response = await authFetch(
        //   `/test/${user.roleName}/${user.hospitalID}/${"rejected"}/getBillingData`,
        //   user.token
        // );
        
        if (response.message === "success" && Array.isArray(response.billingData)) {
          const filterData = response.billingData.filter(
            (each: LabTestOrder) => each.ptype === 2 || each.ptype === 3
          );
          setIpdPharmacyOrder(filterData);
        }
      } catch (error) {
        console.error("Error fetching patient billing data:", error);
      }
    };

    const getMedicineInventoryPatientsOrderWithType = async () => {
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${
          user.hospitalID
        }/${"completed"}/2/getMedicineInventoryPatientsOrderWithType`,
        user.token
      );
      if (response.status == 200) {
        setIpdPharmacyOrder(response.data);
      }
    };


  useEffect(() => {
    if (!user.hospitalID || !user.token) return;
  if (isLabBilling) {
    getPatientBillingData();
  } else {
    getMedicineInventoryPatientsOrderWithType();
  }
  }, [user.hospitalID, user.token, isLabBilling]);

  console.log(ipdPharmacyOrder, "ipd_order")
  return (
    <div className={styles.container}>
      <PatientOuterTable
        title="IPD Orders"
        data={ipdPharmacyOrder}
        isButton={false}
        patientOrder="patientOrder"
        patientOrderPay="patientOrderPay"
      />
    </div>
  );
};

export default IpdOrderManagement;
