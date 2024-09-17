import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Role from "./pages/Role";
import ContentManagement from "./pages/ContentManagement";
import CustomerManagement from "./pages/CustomerManagement";
import ServiceManagement from "./pages/ServiceManagement";
import MarketPlace from "./pages/MarketPlace";
import Settings from "./pages/Settings";
import SearchModifier from "./pages/SearchModifier";
import ShowcaseData from "./pages/ShowcaseData";
import BranchDetails from "./pages/BranchDetails";
import NotFound from "./pages/404";
import { AuthProvider } from "./context/AuthContext";
import Protected from "./ProtectedRoute/protected";
import ForgotPassword from "./Components/ForgotPassword";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Set default route to Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<Protected />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/role-management" element={<Role />} />
            <Route path="/content-management" element={<ContentManagement />} />
            <Route path="/customer-management" element={<CustomerManagement />} />
            <Route path="/home-service" element={<ServiceManagement/>} />
            <Route path="/market-place" element={<MarketPlace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/showcase-management" element={<SearchModifier />} />
            <Route path="/user-management" element={<ShowcaseData />} />
            <Route exact path="/branches/:companyName" element={<BranchDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
