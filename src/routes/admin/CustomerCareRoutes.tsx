import { Route, Routes } from "react-router-dom";
import Snackbars from "../../component/Snackbar";
import React from "react";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import HelpRoutes from "../common/HelpRoutes";
import NurseAlerts from "../../pages/nurseDashboard/NurseAlerts/NurseAlerts";
import ProtectedAdminRoute from "../../ProtectedRoute/ProtectedAdminRoute";
import CustomerCareSidebar from "../../component/sidebar/CustomerCareSidebar";
import CustomerCareDashoard from "../../pages/CustomerCare/CustomerCareDashoard";
import EmergencyRedPatientProfile from "../../pages/hospital_emergency_red/PatientProfile/PatientProfile";

const CustomerCareRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedAdminRoute>
            <CustomerCareSidebar />
          </ProtectedAdminRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedAdminRoute>
              <CustomerCareDashoard />
            </ProtectedAdminRoute>
          }
        />


        <Route path="alerts">
          <Route
            index
            element={
              <ProtectedAdminRoute>
              <Snackbars>
                <NurseAlerts />
              </Snackbars>
            </ProtectedAdminRoute>
            }
          />
          <Route
            path="patient/:id"
            element={
              <EmergencyRedPatientProfile />
            }
          />
        </Route>

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

export default CustomerCareRoutes
