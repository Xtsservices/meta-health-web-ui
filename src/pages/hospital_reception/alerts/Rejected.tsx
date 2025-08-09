import React from "react";
import PatientOuterTable from "../../hospital_pharmacy/OrderManagement/OuterTable";

const Rejected: React.FC = () => {
  return (
    <>
      <PatientOuterTable title="Alerts From OPD" data={[]} isButton={false} />
    </>
  );
};

export default Rejected;
