import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import ProtectedScopeRoute from "../../ProtectedRoute/ProtectedScopeRoute";
import Snackbars from "../../component/Snackbar";
import EmergencyRedSidebar from "../../component/sidebar/EmergencyRedSidebar";
import EmergencyRedDashboard from "../../pages/dashboard_emergency_red";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import EmergencyRedActivePatientList from "../../pages/hospital_emergency_red/ActivePatients/ActivePatientList";
import EmergencyRedPatientProfile from "../../pages/hospital_emergency_red/PatientProfile/PatientProfile";
import PatientEdit from "../../pages/hospital_staff/PatientEdit/PatientEdit";
import EditMedicalHistory from "../../pages/hospital_staff/PatientEdit/EditMedicalHistory";
import DischargePatientProfile from "../../pages/hospital_staff/PatientDischargeProfile/PatientProfile";
import { SCOPE_LIST } from "../../utility/role";
import HelpRoutes from "../common/HelpRoutes";
import DischargePatient from "../../pages/common/emergency/dischargePatient/DischargePatient";
import Managment from "../../component/DoctorsManagment/Managment";

const EmergencyRedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <ProtectedScopeRoute scope={SCOPE_LIST.emergency_red_zone}>
              <Snackbars>
                <EmergencyRedSidebar />
              </Snackbars>
            </ProtectedScopeRoute>
          </ProtectedStaffRoute>
        }
      >
        <Route index element={<EmergencyRedDashboard />} />
        <Route path="profile" element={<ProfileForm />} />
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
        <Route path="help/*" element={<HelpRoutes />} />
        <Route path="list" element={<EmergencyRedActivePatientList />} />
        <Route path="list/:id" element={<EmergencyRedPatientProfile />} />
        <Route
          path="list/:id/edit"
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

export default EmergencyRedRoutes;
