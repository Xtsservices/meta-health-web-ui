import { useEffect, useState } from "react";
import { LabTestOrder, PharmacyOrder } from "../../../../utility/medicine";
import PatientOuterTable from "../OuterTable";
import styles from "./OpdOrderManagement.module.scss";
import { authFetch } from "../../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useSelector } from "react-redux";

const OpdOrderManagement = () => {
  const user = useSelector(selectCurrentUser);
  const [opdPharmacyOrder, setOpdPharmacyOrder] = useState<
    PharmacyOrder[] | LabTestOrder[]
  >([]);

  const isLabBilling =
    location.pathname.includes("radiology") ||
    location.pathname.includes("pathology");

    const getMedicineInventoryPatientsOrderWithType = async () => {
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${
          user.hospitalID
        }/${"completed"}/1/getMedicineInventoryPatientsOrderWithType`,
        user.token
      );
      if (response.status == 200) {
        setOpdPharmacyOrder(response.data);
      }
    };


    const getPatientBillingData = async () => {
      try {
        const response = await authFetch(
          `/test/${user.roleName}/${user.hospitalID}/${"approved"}/getBillingData`,
          user.token
        );
        
        if (response.message === "success" && Array.isArray(response.billingData)) {
          const filterData = response.billingData.filter(
            (each: LabTestOrder) => each.ptype === 21
          );
          setOpdPharmacyOrder(filterData);
        }
      } catch (error) {
        console.error("Error fetching patient billing data:", error);
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

  console.log(opdPharmacyOrder, "pharmacy_data")

  return (
    <div className={styles.container}>
      <PatientOuterTable
        title="OPD Orders"
        data={opdPharmacyOrder}
        isButton={false}
        patientOrder="patientOrder"
        patientOrderOpd="patientOrderOpd"
      />
    </div>
  );
};

export default OpdOrderManagement;
