import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import ProtectedScopeRoute from "../../ProtectedRoute/ProtectedScopeRoute";
import Snackbars from "../../component/Snackbar";
import EmergencyGreenSidebar from "../../component/sidebar/EmergencyGreenSidebar";
import EmergencyGreenDashboard from "../../pages/dashboard_emergency_green";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import EmergencyGreenActivePatientList from "../../pages/hospital_emergency_green/ActivePatients/ActivePatientList";
import PatientProfile from "../../pages/hospital_staff/PatientProfile/PatientProfile";
import PatientEdit from "../../pages/hospital_staff/PatientEdit/PatientEdit";
import EditMedicalHistory from "../../pages/hospital_staff/PatientEdit/EditMedicalHistory";
import DischargePatientProfile from "../../pages/hospital_staff/PatientDischargeProfile/PatientProfile";
import { SCOPE_LIST } from "../../utility/role";
import HelpRoutes from "../common/HelpRoutes";
import DischargePatient from "../../pages/common/emergency/dischargePatient/DischargePatient";
import Managment from "../../component/DoctorsManagment/Managment";

const EmergencyGreenRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <ProtectedScopeRoute scope={SCOPE_LIST.emergency_green_zone}>
              <Snackbars>
                <EmergencyGreenSidebar />
              </Snackbars>
            </ProtectedScopeRoute>
          </ProtectedStaffRoute>
        }
      >
        <Route index element={<EmergencyGreenDashboard />} />
        <Route path="profile" element={<ProfileForm />} />
        <Route path="help/*" element={<HelpRoutes />} />
        <Route path="list">
          <Route
            index
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <EmergencyGreenActivePatientList />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <PatientProfile />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
          <Route
            path=":patientId/edit"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <PatientEdit />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
          <Route
            path=":patientId/edit/medicalHistory"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <EditMedicalHistory />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
        </Route>
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

export default EmergencyGreenRoutes;
