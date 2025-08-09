import Dashboard from "../../component/dashboard/emergency/dashboard-template";
import { zoneType } from "../../utility/role";

function EmergencyYellowDashboard() {
  return <Dashboard zoneName="yellow" zoneType={zoneType.yellow} />;
}

export default EmergencyYellowDashboard;
