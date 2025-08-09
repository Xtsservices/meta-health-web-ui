import React from "react";
import PatientOuterTable from "../../hospital_pharmacy/OrderManagement/OuterTable";

const Approved: React.FC = () => {
  return (
    <>
      <PatientOuterTable title="Alerts From OPD" data={[]} isButton={false} />
      <PatientOuterTable
        title="Alerts From IPD and Emergency"
        data={[]}
        isButton={false}
      />
    </>
  );
};

export default Approved;
