import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { DischargeOrder, PharmacyOrder } from "../../../utility/medicine";
import { useEffect, useState } from "react";
import { authFetch } from "../../../axios/useAuthFetch";
import PatientOuterTable from "../../hospital_pharmacy/OrderManagement/OuterTable";




const dischargeData:DischargeOrder[] = [
  {
    id: 1,
    patientID: "P12345",
    pName: "John Doe",
    dept: "Neurology",
    firstName: "Dr. Emily",
    lastName: "Johnson",
    date: "2024-12-25",
    action: "Pending",
    addedOn: "2024-12-22T14:00:00Z",
  },
  {
    id: 2,
    patientID: "P54321",
    pName: "Jane Smith",
    dept: "Pediatrics",
    firstName: "Dr. Sarah",
    lastName: "Miller",
    date: "2024-12-26",
    action: "Pending",
    addedOn: "2024-12-22T14:00:00Z",
  },
];

const Alerts = () => {
  const user = useSelector(selectCurrentUser);

  const [opdData, setOpdData] = useState<PharmacyOrder[]>([]);
  const [ipdData, setIpdData] = useState<PharmacyOrder[]>([]);
  
  useEffect(() => {
    const getMedicineInventoryPatientsOrder = async () => {
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${user.hospitalID}/pending/getMedicineInventoryPatientsOrder`,
        user.token
      );

      if (response.status === 200 && response.data) {
        const data: PharmacyOrder[] = response.data;
        // Separate OPD and IPD data
        setOpdData(data.filter((order) => order.departmemtType === 1));
        setIpdData(data.filter((order) => order.departmemtType !== 1));
      } else {
        console.error("Failed to fetch pharmacy orders:", response);
      }
    };

    if (user.hospitalID && user.token) {
      getMedicineInventoryPatientsOrder();
    }
  }, [user.hospitalID, user.token]);

 
console.log(opdData, "opd data rece")
  

  return (
    <>
      <PatientOuterTable
        title="Alerts From OPD"
        data={opdData}
        isButton={true}
        reception="alert from reception"
      />
      <PatientOuterTable
        title="Alerts From IPD and Emergency"
        data={ipdData}
        isButton={true}
         reception="alert from reception"
      />
      <PatientOuterTable
        title="Discharged Patients"
        data={dischargeData}
        isButton={true}
      />
    </>
  );
};

export default Alerts;
