import { useCallback, useEffect, useState } from "react";
import { Alert, IconButton, Tooltip } from "@mui/material";
import { ReloadOutlined } from "@ant-design/icons";
import { Table, Tag, Typography } from "antd";
import { getActivations } from "../api/admin.api";

const STATUS_COLORS = {
  pending: "gold",
  received: "green",
  completed: "green",
  canceled: "red",
  cancelled: "red",
  timeout: "orange",
  expired: "orange",
};

/** Activations page — all HERO SMS number activations with their status. */
export default function ActivationsPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getActivations({ page, limit: pageSize });
      setRows(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to load activations");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    {
      title: "User",
      key: "user",
      render: (_, r) => (
        <div className="leading-tight">
          <div className="font-medium text-slate-700">{r.username}</div>
          <div className="text-xs text-slate-400">{r.email}</div>
        </div>
      ),
    },
    { title: "Service", dataIndex: "service", key: "service", render: (v) => <Tag>{v ?? "—"}</Tag> },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Phone number",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (v) => <span className="font-mono text-sm">{v || "—"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={STATUS_COLORS[s] || "default"}>{s}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (v) =>
        v ? new Date(v).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—",
    },
  ];

  return (
    <div>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* AdminLTE .card: activations table */}
      <div className="bg-white rounded-md border border-[#e3e6f0] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#e3e6f0]">
          <h3 className="m-0 text-base font-semibold text-[#343a40]">
            Activations <span className="text-xs font-normal text-slate-400 ml-1">({total})</span>
          </h3>
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

        <Table
          rowKey="id"
          size="middle"
          columns={columns}
          dataSource={rows}
          loading={loading}
          scroll={{ x: 900 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            showTotal: (t) => `${t} activations`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </div>

      <Typography variant="body2" sx={{ color: "#868e96", mt: 1.5 }}>
        Activations are created by the HERO SMS integration — statuses update as SMS codes arrive.
      </Typography>
    </div>
  );
}
