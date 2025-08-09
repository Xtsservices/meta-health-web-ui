import Dashboard from '../../component/dashboard/emergency/dashboard-template';
import { zoneType } from '../../utility/role';

function EmergencyGreenDashboard() {
  return <Dashboard zoneName="green" zoneType={zoneType.green} />;
}

export default EmergencyGreenDashboard;
