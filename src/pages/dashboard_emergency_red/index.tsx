import Dashboard from '../../component/dashboard/emergency/dashboard-template';
import { zoneType } from '../../utility/role';

function EmergencyRedDashboard() {
  return <Dashboard zoneName="red" zoneType={zoneType.red} />;
}

export default EmergencyRedDashboard;
