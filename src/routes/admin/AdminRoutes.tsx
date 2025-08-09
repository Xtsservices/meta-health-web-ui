import { Route, Routes } from "react-router-dom";
import Snackbars from "../../component/Snackbar";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import SimpleBackdrop from "../../component/BackDropLoading/BackDropLoading";
import ProtectedAdminRoute from "../../ProtectedRoute/ProtectedAdminRoute";
import Admin_sidebar from "../../component/sidebar/AdminSidebar";
import AdminDashboard from "../../pages/dashboard_admin/dashboard";
import AddStaff from "../../pages/hospital_admin/AddStaff/AddStaff";
import AddDepartment from "../../pages/hospital_admin/addDepartment/AddDepartment";
import AddWard from "../../pages/hospital_admin/addWard/AddWard";
import AllHub from "../../pages/hospital_admin/AllHub/AllHub";
import AllDevices from "../../pages/hospital_admin/AllDevices/AllDevices";
import HelpRoutes from "../common/HelpRoutes";
import TemplateManagement from "../../pages/hospital_admin/templateManagement/TemplateManagement";
// import NurseAlerts from "../../pages/nurseDashboard/NurseAlerts/NurseAlerts";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedAdminRoute>
            <Admin_sidebar />
          </ProtectedAdminRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="addstaff"
          element={
            <ProtectedAdminRoute>
              <Snackbars>
                <SimpleBackdrop>
                  <AddStaff />
                </SimpleBackdrop>
              </Snackbars>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="addDepartment"
          element={
            <ProtectedAdminRoute>
              <Snackbars>
                <AddDepartment />
              </Snackbars>
            </ProtectedAdminRoute>
          }
        />
        {/* <Route
          path="alerts"
          element={
            <ProtectedAdminRoute>
              <Snackbars>
              <NurseAlerts />
              </Snackbars>
            </ProtectedAdminRoute>
          }
        /> */}
        <Route
          path="addWard"
          element={
            <ProtectedAdminRoute>
              <Snackbars>
                <AddWard />
              </Snackbars>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="allHub"
          element={
            <ProtectedAdminRoute>
              <AllHub />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="allDevices"
          element={
            <ProtectedAdminRoute>
              <AllDevices />
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
        <Route path="help/*" element={
          <HelpRoutes />
        } />

        <Route
          path="template-management"
          element={
            <ProtectedAdminRoute>
              <TemplateManagement />
            </ProtectedAdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};
export default AdminRoutes;
