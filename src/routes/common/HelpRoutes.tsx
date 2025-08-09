import HelpStaff from "../../component/helpStaff/Help";
import ContactUsStaff from "../../component/helpStaff/ContactUs";
import VideoStaff from "../../component/helpStaff/Videos";
import ManualStaff from "../../component/helpStaff/Manuals";
import TicketStaff from "../../component/helpStaff/Tickets";
import TicketDetailStaff from "../../component/helpStaff/TicketDetails";
import NewTicketStaff from "../../component/helpStaff/NewTicket";
import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import Snackbars from "../../component/Snackbar";
import DashboardInfo from "../../component/helpStaff/DashboardInfo";

const HelpRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <ProtectedStaffRoute>
              <HelpStaff />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="contact-us"
          element={
            <ProtectedStaffRoute>
              <ContactUsStaff />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="dashboardInfo"
          element={
            <ProtectedStaffRoute>
              <DashboardInfo />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="videos"
          element={
            <ProtectedStaffRoute>
              <VideoStaff />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="manuals"
          element={
            <ProtectedStaffRoute>
              <ManualStaff />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="tickets"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <TicketStaff />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="tickets/:ticketId"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <TicketDetailStaff />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="tickets/new-ticket"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <NewTicketStaff />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default HelpRoutes;
