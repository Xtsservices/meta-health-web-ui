import { patientStatus, zoneType } from "../../../utility/role";
import ActivePatientList from "../../common/emergency/activePatient/ActivePatientList";

const EmergencyGreenActivePatientList = () => {
  return (
    <ActivePatientList
      zone={zoneType.green}
      patientStatus={patientStatus.emergency}
    />
  );
};

export default EmergencyGreenActivePatientList;
