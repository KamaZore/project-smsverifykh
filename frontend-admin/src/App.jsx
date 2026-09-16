import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getAccessToken } from "./store/token_access";
import { AdminLayout } from "./components/layout/AdminLayout";
import LoginPage from "./page/LoginPage";
import DashboardPage from "./page/DashboardPage";
import UsersPage from "./page/UsersPage";
import ActivationsPage from "./page/ActivationsPage";
import TransactionsPage from "./page/TransactionsPage";
import ApiKeysPage from "./page/ApiKeysPage";
import HeroProfilePage from "./page/HeroProfilePage";
import StockPage from "./page/StockPage";

/** Blocks a route when the admin is not signed in. */
const RequireAuth = ({ children }) =>
  getAccessToken() ? children : <Navigate to="/login" replace />;

/** Keeps signed-in admins away from the login screen. */
const PublicOnly = ({ children }) =>
  getAccessToken() ? <Navigate to="/dashboard" replace /> : children;

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />

        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/activations" element={<ActivationsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settings/api-keys" element={<ApiKeysPage />} />
          <Route path="/settings/hero-profile" element={<HeroProfilePage />} />
          <Route path="/stock" element={<StockPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
