import { useCallback, useEffect, useState } from "react";
import { Alert, Grid, IconButton, Tooltip } from "@mui/material";
import { Table, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  MessageOutlined,
  ReloadOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import StatCard from "../components/ui/StatCard";
import { getDashboardStats, getUsers } from "../api/admin.api";

const money = (v) =>
  `$ ${Number(v ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}`;

const STATUS_COLORS = { active: "success", suspended: "warning", banned: "error" };

const USER_COLUMNS = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    render: (v) => <span className="font-medium text-slate-700">{v}</span>,
  },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Balance", dataIndex: "balance", key: "balance", align: "right", render: (v) => money(v) },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (s) => <Tag color={STATUS_COLORS[s] || "default"}>{s}</Tag>,
  },
  {
    title: "Joined",
    dataIndex: "created_at",
    key: "created_at",
    render: (v) =>
      v ? new Date(v).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—",
  },
];

/**
 * Admin dashboard — live platform stats from GET /api/admin/dashboard/stats
 * plus a preview of the most recently registered users.
 */
export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, usersData] = await Promise.all([
        getDashboardStats(),
        getUsers({ page: 1, limit: 5 }),
      ]);
      setStats(statsData);
      setRecentUsers(usersData.data || []);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || err.message || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards = [
    {
      title: "Total Users",
      value: stats ? Number(stats.totalUsers).toLocaleString() : "—",
      icon: <TeamOutlined />,
      color: "indigo",
      subtitle: "Registered accounts",
    },
    {
      title: "Active Users",
      value: stats ? Number(stats.activeUsers).toLocaleString() : "—",
      icon: <CheckCircleOutlined />,
      color: "emerald",
      subtitle: "Status = active",
    },
    {
      title: "Total Activations",
      value: stats ? Number(stats.totalActivations).toLocaleString() : "—",
      icon: <MessageOutlined />,
      color: "sky",
      subtitle: "All time",
    },
    {
      title: "Pending Activations",
      value: stats ? Number(stats.pendingActivations).toLocaleString() : "—",
      icon: <ClockCircleOutlined />,
      color: "amber",
      subtitle: "Awaiting SMS",
    },
    {
      title: "Users Balance",
      value: stats ? money(stats.totalBalance) : "—",
      icon: <WalletOutlined />,
      color: "violet",
      subtitle: "Sum of user wallets",
    },
    {
      title: "Total Deposits",
      value: stats ? money(stats.totalDeposits) : "—",
      icon: <DollarOutlined />,
      color: "rose",
      subtitle: "Deposit transactions",
    },
  ];

  return (
    <div>
      {/* Refresh row (page title/breadcrumb are rendered by AdminLayout) */}
      <div className="flex items-center justify-between mb-4">
        <Typography variant="body2" sx={{ color: "#6c757d" }}>
          Platform overview · updated in real time
        </Typography>
        <Tooltip title="Refresh">
          <IconButton
            onClick={load}
            disabled={loading}
            size="small"
            sx={{ border: "1px solid #dee2e6", color: "#6c757d", background: "#fff" }}
          >
            <ReloadOutlined />
          </IconButton>
        </Tooltip>
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Stat cards — AdminLTE info-box style */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Recent users — AdminLTE .card with .card-header */}
      <div className="bg-white rounded-md border border-[#e3e6f0] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e3e6f0]">
          <h3 className="m-0 text-base font-semibold text-[#343a40]">Recent users</h3>
          <span className="text-xs text-slate-400">Latest 5 registered accounts</span>
        </div>
        <Table
          rowKey="id"
          size="middle"
          columns={USER_COLUMNS}
          dataSource={recentUsers}
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
}
