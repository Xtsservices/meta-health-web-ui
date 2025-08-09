import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import Snackbars from "../../component/Snackbar";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import SimpleBackdrop from "../../component/BackDropLoading/BackDropLoading";
import InStock from "../../pages/hospital_pharmacy/pharmacyInStock/InStock";
import PharmacyDashboard from "../../pages/dashboard_pharmacy/pharmacyDashboard/PharmacyDashboard";
import PharmacyDashboard1 from "../../pages/hospital_pharmacy/pharmacyDashboard/PharmacyDashboard1";
import PharmacyAlerts from "../../pages/hospital_pharmacy/PharamacyAlerts/PharmacyAlerts";
import PharmacySale from "../../pages/hospital_pharmacy/PharmacySale/PharmacySale";
import PharmacyExpenses from "../../pages/hospital_pharmacy/pharmacyExpenses/PharmacyExpenses";
import AddInventory from "../../pages/hospital_pharmacy/AddInventory/AddInventory";
import OrdersTabs from "../../pages/hospital_pharmacy/OrderManagement/OrdersTabs";
import TaxInvoiceTabs from "../../pages/hospital_pharmacy/TaxInvoice/TaxInvoiceTabs";
import HelpRoutes from "../common/HelpRoutes";

const PharamacyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <SimpleBackdrop>
              <Snackbars>
                <PharmacyDashboard />
              </Snackbars>
            </SimpleBackdrop>
          </ProtectedStaffRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <PharmacyDashboard1 />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="inStock"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <InStock />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="addInventory"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <AddInventory />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="sale"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <PharmacySale />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="expenses"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <PharmacyExpenses />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="alerts"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <PharmacyAlerts />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="taxInvoice"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <TaxInvoiceTabs type="medicine" />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="orderManagement"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <OrdersTabs />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route path="help/*" element={<HelpRoutes />} />
        <Route path="profile" element={<ProfileForm />} />
      </Route>
    </Routes>
  );
};

export default PharamacyRoutes;
