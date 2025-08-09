import { Route, Routes } from "react-router-dom";
import Snackbars from "../../component/Snackbar";
import React from "react";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import HelpRoutes from "../common/HelpRoutes";
import NurseSidebar from "../../component/sidebar/NurseSidebar";
import NurseDashboard from "../../pages/nurseDashboard/NurseDashboard";
import NurseAlerts from "../../pages/nurseDashboard/NurseAlerts/NurseAlerts";
import NursePatientsList from "../../pages/nurseDashboard/NursePatientsList/NursePatientsList";
import Managment from "../../pages/nurseDashboard/NurseManagment/Managment";
import ProtectedAdminRoute from "../../ProtectedRoute/ProtectedAdminRoute";
import EmergencyRedPatientProfile from "../../pages/hospital_emergency_red/PatientProfile/PatientProfile";
import PatientEdit from "../../pages/hospital_staff/PatientEdit/PatientEdit";
import EditMedicalHistory from "../../pages/hospital_staff/PatientEdit/EditMedicalHistory";

const NurseRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedAdminRoute>
            <NurseSidebar />
          </ProtectedAdminRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedAdminRoute>
              <NurseDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route path="patientsList">
          <Route
            index
            element={
              <ProtectedAdminRoute>
                <Snackbars>
                  <NursePatientsList />
                </Snackbars>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedAdminRoute>
                <Snackbars>
                  <EmergencyRedPatientProfile />
                </Snackbars>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path=":patientId/edit"
            element={
              <ProtectedAdminRoute>
                <Snackbars>
                  <PatientEdit />
                </Snackbars>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path=":patientId/edit/medicalHistory"
            element={
              <ProtectedAdminRoute>
                <Snackbars>
                  <EditMedicalHistory />
                </Snackbars>
              </ProtectedAdminRoute>
            }
          />
        </Route>
        <Route
          path="alerts"
          element={
            <ProtectedAdminRoute>
              <Snackbars>
                <NurseAlerts />
              </Snackbars>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="managment"
          element={
            <ProtectedAdminRoute>
              <Snackbars>
                <Managment />
              </Snackbars>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedAdminRoute>
              <Snackbars>
                <ProfileForm />
              </Snackbars>
            </ProtectedAdminRoute>
          }
        />

        <Route path="help/*" element={<HelpRoutes />} />
      </Route>
    </Routes>
  );
};
export default NurseRoutes;



