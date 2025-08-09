import { patientStatus, zoneType } from "../../../utility/role";
import ActivePatientList from "../../common/emergency/activePatient/ActivePatientList";

const EmergencyYellowActivePatientList = () => {
  return (
    <ActivePatientList
      zone={zoneType.yellow}
      patientStatus={patientStatus.emergency}
    />
  );
};

export default EmergencyYellowActivePatientList;
