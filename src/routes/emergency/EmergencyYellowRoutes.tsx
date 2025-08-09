import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import ProtectedScopeRoute from "../../ProtectedRoute/ProtectedScopeRoute";
import Snackbars from "../../component/Snackbar";
import EmergencyYellowSidebar from "../../component/sidebar/EmergencyYellowSidebar";
import EmergencyYellowDashboard from "../../pages/dashboard_emergency_yellow";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import EmergencyYellowActivePatientList from "../../pages/hospital_emergency_yellow/ActivePatients/ActivePatientList";
import EmergencyYellowPatientProfile from "../../pages/hospital_emergency_yellow/PatientProfile/PatientProfile";
import PatientEdit from "../../pages/hospital_staff/PatientEdit/PatientEdit";
import EditMedicalHistory from "../../pages/hospital_staff/PatientEdit/EditMedicalHistory";
import DischargePatient from "../../pages/common/emergency/dischargePatient/DischargePatient";
import DischargePatientProfile from "../../pages/hospital_staff/PatientDischargeProfile/PatientProfile";
import { SCOPE_LIST } from "../../utility/role";
import HelpRoutes from "../common/HelpRoutes";
import Managment from "../../component/DoctorsManagment/Managment";

const EmergencyYellowRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <ProtectedScopeRoute scope={SCOPE_LIST.emergency_yellow_zone}>
              <Snackbars>
                <EmergencyYellowSidebar />
              </Snackbars>
            </ProtectedScopeRoute>
          </ProtectedStaffRoute>
        }
      >
        <Route index element={<EmergencyYellowDashboard />} />
        <Route path="profile" element={<ProfileForm />} />
        <Route path="help/*" element={<HelpRoutes />} />
        <Route path="list" element={<EmergencyYellowActivePatientList />} />
        <Route path="list/:id" element={<EmergencyYellowPatientProfile />} />
        <Route
          path="Managment"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <Managment />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="list/:patientId/edit"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <PatientEdit />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="list/:patientId/edit/medicalHistory"
          element={<EditMedicalHistory />}
        />
        <Route path="dischargepatient">
          <Route index element={<DischargePatient />} />
          <Route
            path=":id"
            element={
              <Snackbars>
                <DischargePatientProfile />
              </Snackbars>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default EmergencyYellowRoutes;
