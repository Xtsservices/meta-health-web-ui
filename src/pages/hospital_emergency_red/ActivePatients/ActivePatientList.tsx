import { patientStatus, zoneType } from "../../../utility/role";
import ActivePatientList from "../../common/emergency/activePatient/ActivePatientList";

const EmergencyRedActivePatientList = () => {
  return (
    <ActivePatientList
      zone={zoneType.red}
      patientStatus={patientStatus.emergency}
    />
  );
};

export default EmergencyRedActivePatientList;
