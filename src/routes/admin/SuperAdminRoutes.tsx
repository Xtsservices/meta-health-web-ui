import { Route, Routes } from "react-router-dom";
import Snackbars from "../../component/Snackbar";
import ProtectedSuperAdminRoute from "../../ProtectedRoute/ProtectedSuperAdminRoute";
import SuperAdminSidebar from "../../component/sidebar/SuperAdminSidebar";
import SuperAdminDashboard from "../../pages/dashboard_super_admin/dashboard";
import AddHospital from "../../pages/hospital_sadmin/add_hospital/AddHospital";
import { AddHospitalDetails } from "../../pages/hospital_sadmin/add_hospital/AddHospitalDetails";
import { AddAdmin } from "../../pages/hospital_sadmin/view_hospital/AddAdmin";
import ViewHospitals from "../../pages/hospital_sadmin/view_hospital/ViewHospitals";
import SAdminTickets from "../../pages/hospital_sadmin/tickets/SAdminTickets";
import HospitalDetails from "../../pages/hospital_sadmin/view_hospital/HospitalDetails";
import SuperAdminTicketDetails from "../../pages/hospital_sadmin/tickets/SuperAdminTicketDetails";
import AddCustomerCare from "../../pages/hospital_sadmin/customerCare/AddCustomerCare";
import ProfileForm from "../../component/ProfileForm/ProfileForm";

const SuperAdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedSuperAdminRoute>
            <SuperAdminSidebar />
          </ProtectedSuperAdminRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedSuperAdminRoute>
              <SuperAdminDashboard />
            </ProtectedSuperAdminRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedSuperAdminRoute>
              <Snackbars>
                <ProfileForm />
              </Snackbars>
            </ProtectedSuperAdminRoute>
          }
        />
        <Route path="add-hospital/">
          <Route
            index
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <AddHospital />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
          <Route
            path="form"
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <AddHospitalDetails />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <AddAdmin />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
        </Route>
        <Route path="view-hospital/">
          <Route
            index
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <ViewHospitals />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <HospitalDetails />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
        </Route>

        <Route path="tickets/">
          <Route
            index
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <SAdminTickets />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <SuperAdminTicketDetails />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
        </Route>

        <Route path="add-customerCare/">
          <Route
            index
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <AddCustomerCare />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
          <Route
            path="form"
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <AddHospitalDetails />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedSuperAdminRoute>
                <Snackbars>
                  <AddAdmin />
                </Snackbars>
              </ProtectedSuperAdminRoute>
            }
          />
        </Route>
      

      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;
