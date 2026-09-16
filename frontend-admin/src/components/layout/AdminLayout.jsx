import { useMemo, useState } from "react";
import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ApiOutlined,
  AppstoreOutlined,
  CloudDownloadOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  TeamOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { clearSession, getAdmin } from "../../store/token_access";
import { Link } from "react-router-dom";
const { Sider, Header, Content } = Layout;
const MENU_ITEMS = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { type: "divider", label: "Operations" },
  { key: "/users", icon: <TeamOutlined />, label: "Users" },
  { key: "/activations", icon: <MessageOutlined />, label: "Activations" },
  {
    key: "/transactions",
    icon: <TransactionOutlined />,
    label: "Transactions",
  },
  { key: "/stock", icon: <CloudDownloadOutlined />, label: "Number Stock" },
  { type: "divider", label: "Settings" },
  {
    key: "/settings/hero-profile",
    icon: <AppstoreOutlined />,
    label: "Hero SMS",
  },
  { key: "/settings/api-keys", icon: <ApiOutlined />, label: "API Keys" },
];
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/activations": "Activations",
  "/transactions": "Transactions",
  "/stock": "Number Stock",
  "/settings/api-keys": "API Keys",
  "/settings/hero-profile": "Hero SMS",
};
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const admin = getAdmin();
  const selectedKey = useMemo(
    () =>
      MENU_ITEMS.find((item) => location.pathname.startsWith(item.key))?.key ??
      "/dashboard",
    [location.pathname],
  );
  const pageTitle = PAGE_TITLES[selectedKey] || "Dashboard";
  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-[#e9ecef]">
      <Layout style={{ minHeight: "100vh", background: "transparent" }}>
        {/* ── Main Sidebar (AdminLTE dark) ─────────────────── */}
        <Sider
          width={250}
          collapsedWidth={68}
          collapsible
          collapsed={collapsed}
          trigger={null}
          breakpoint="lg"
          onCollapse={setCollapsed}
          style={{
            position: "fixed",
            insetBlockStart: 0,
            insetInlineStart: 0,
            zIndex: 1030,
            height: "100vh",
            overflow: "auto",
            background: "#343A40",
          }}
        >
          {/* Brand bar — AdminLTE .brand-link */}
          <div
            className={`flex items-center h-[60px]  border-b border-white/10 transition-all ${collapsed ? "justify-center px-0" : "px-4"}`}
          >
            <Link to="/" className="w-45 h-auto">
              <img
                src="/assets/images/logo_smsverifykh.png"
                alt="Logo"
                className={`h-auto transition-all w-full ${collapsed ? "mx-auto" : ""}`}
              />
            </Link>
          </div>
          {/* Nav — AdminLTE .nav-sidebar */}
          <Menu
            theme="dark"
            mode="inline"
            items={MENU_ITEMS}
            selectedKeys={[selectedKey]}
            onClick={({ key }) => navigate(key)}
            inlineCollapsed={collapsed}
            style={{
              background: "#343a40",
              borderInlineEnd: 0,
              paddingTop: 6,
              fontSize: 14.5,
            }}
          />
          {/* Sidebar footer — logged-in user panel (AdminLTE .user-panel) */}
          {!collapsed && (
            <>
              <div className="mx-3 my-4 rounded-lg bg-white/5 border border-white/10 p-3">
                <div className="flex items-center gap-2.5">
                  <Avatar style={{ backgroundColor: "#6366f1" }} size={36}>
                    {(admin?.username || "A").charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="min-w-0 leading-tight">
                    <div className="text-white text-sm font-semibold truncate">
                      {admin?.username || "Admin"}
                    </div>
                    <div className="text-[11px] text-slate-400 capitalize">
                      {admin?.role || "admin"}
                    </div>
                    <a
                      onClick={() => navigate("/settings/hero-profile")}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer mt-0.5 inline-block"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </Sider>
        <Layout
          style={{
            marginInlineStart: collapsed ? 68 : 250,
            transition: "margin 0.2s",
          }}
        >
          {/* ── Top navbar (AdminLTE .main-header) ─────────── */}
          <Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1020,
              height: 57,
              lineHeight: "57px",
              padding: "0 16px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #dee2e6",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-slate-500 hover:text-slate-700 transition-colors leading-none p-1"
                aria-label="Toggle sidebar"
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>
              <span className="hidden sm:inline text-sm text-slate-400">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip title="View Profile">
                <IconButton
                  onClick={() => navigate("/settings/hero-profile")}
                  size="small"
                  sx={{ color: "#6c757d", "&:hover": { color: "#6366f1" } }}
                >
                  <AppstoreOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Log out">
                <IconButton
                  onClick={handleLogout}
                  size="small"
                  sx={{ color: "#6c757d", "&:hover": { color: "#dc3545" } }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Avatar style={{ backgroundColor: "#6366f1" }} size={34}>
                {(admin?.username || "A").charAt(0).toUpperCase()}
              </Avatar>
            </div>
          </Header>
          {/* ── Content (AdminLTE .content-wrapper / .content-header) ── */}
          <Content style={{ padding: 0 }}>
            <div className="px-6 pt-5 pb-2">
              <h1 className="text-2xl font-bold text-[#495057] m-0">
                {pageTitle}
              </h1>
              <nav className="text-sm text-slate-400 mt-0.5">
                <span>Home</span>
                <span className="mx-1.5 text-slate-300">/</span>
                <span className="text-slate-500">{pageTitle}</span>
              </nav>
            </div>
            <div className="p-6 pt-3">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
export { AdminLayout };
