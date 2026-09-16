import { useCallback, useEffect, useState } from "react";
import { Alert, IconButton, TextField, Tooltip } from "@mui/material";
import { Button, Input, Modal, Table, Tag } from "antd";

const { Search } = Input;
import { DollarOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  getUsers,
  updateUserStatus,
  adjustUserBalance,
} from "../api/admin.api";

const money = (v) =>
  `$ ${Number(v ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}`;

const STATUS_COLORS = {
  active: "success",
  suspended: "warning",
  banned: "error",
};

const USER_COLUMNS = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    render: (v) => <span className="font-medium text-slate-700">{v}</span>,
  },
  { title: "Email", dataIndex: "email", key: "email" },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    align: "right",
    render: (v) => money(v),
  },
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
      v
        ? new Date(v).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "—",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  // Add-funds modal state
  const [balanceTarget, setBalanceTarget] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Admin balance adjustment");
  const [savingBalance, setSavingBalance] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUsers({ page, limit: pageSize, search });
      setUsers(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "Failed to load users",
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (user) => {
    const next = user.status === "active" ? "suspended" : "active";
    setTogglingId(user.id);
    try {
      await updateUserStatus(user.id, next);
      setNotice(`${user.username} is now ${next}`);
      await load();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "Failed to update status",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const submitBalance = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value === 0) {
      setError("Enter a non-zero amount (use a negative value to deduct).");
      return;
    }
    setSavingBalance(true);
    try {
      await adjustUserBalance(
        balanceTarget.id,
        value,
        description || "Admin balance adjustment",
      );
      setNotice(
        `${value > 0 ? "Added" : "Deducted"} $ ${Math.abs(value).toFixed(2)} ${
          value > 0 ? "to" : "from"
        } ${balanceTarget.username}`,
      );
      setBalanceTarget(null);
      setAmount("");
      await load();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "Failed to adjust balance",
      );
    } finally {
      setSavingBalance(false);
    }
  };

  const columns = [
    ...USER_COLUMNS,
    {
      title: "Actions",
      key: "actions",
      width: 230,
      render: (_, user) => (
        <div className="flex gap-2">
          <Button
            size="small"
            type={user.status === "active" ? "default" : "primary"}
            danger={user.status === "active"}
            loading={togglingId === user.id}
            onClick={() => toggleStatus(user)}
          >
            {user.status === "active" ? "Suspend" : "Activate"}
          </Button>
          <Button
            size="small"
            icon={<DollarOutlined />}
            onClick={() => setBalanceTarget(user)}
          >
            Funds
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {notice && !error && (
        <Alert
          severity="success"
          sx={{ mb: 2.5 }}
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      )}

      {/* AdminLTE .card: search toolbar + users table */}
      <div className="bg-white rounded-md border border-[#e3e6f0] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#e3e6f0]">
          <h3 className="m-0 text-base font-semibold text-[#343a40]">
            Users{" "}
            <span className="text-xs font-normal text-slate-400 ml-1">
              ({total})
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <Input.Search
              placeholder="Search username or email"
              allowClear
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              style={{ width: 260 }}
            />
            <Tooltip title="Refresh">
              <IconButton
                onClick={load}
                disabled={loading}
                size="small"
                sx={{ border: "1px solid #dee2e6", color: "#6c757d" }}
              >
                <ReloadOutlined />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <Table
          rowKey="id"
          size="middle"
          columns={columns}
          dataSource={users}
          loading={loading}
          scroll={{ x: 900 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            showTotal: (t) => `${t} users`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </div>

      {/* Add funds modal */}
      <Modal
        title={
          <span>
            Adjust balance —{" "}
            <span className="text-indigo-600">{balanceTarget?.username}</span>
          </span>
        }
        open={!!balanceTarget}
        onCancel={() => setBalanceTarget(null)}
        onOk={submitBalance}
        confirmLoading={savingBalance}
        okText="Apply"
        okButtonProps={{ disabled: !amount }}
        destroyOnHidden
      >
        {balanceTarget && (
          <div className="py-2">
            <div className="flex items-center justify-between bg-slate-50 border border-[#e3e6f0] rounded-md px-4 py-2.5 mb-4 text-sm">
              <span className="text-slate-500">Current balance</span>
              <span className="font-bold text-[#343a40]">
                {money(balanceTarget.balance)}
              </span>
            </div>

            <TextField
              fullWidth
              size="small"
              label="Amount (negative to deduct)"
              placeholder="e.g. 10 or -5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2.5 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
