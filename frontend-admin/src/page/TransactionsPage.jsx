import { useCallback, useEffect, useState } from "react";
import { Alert, IconButton, Tooltip } from "@mui/material";
import { ArrowDownOutlined, ArrowUpOutlined, ReloadOutlined } from "@ant-design/icons";
import { Table, Tag, Typography } from "antd";
import { getTransactions } from "../api/admin.api";

const TYPE_COLORS = {
  deposit: "green",
  withdrawal: "red",
  deduction: "red",
  refund: "blue",
};

/** Transactions page — wallet ledger with user, type, signed amount and balance after. */
export default function TransactionsPage() {
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
      const res = await getTransactions({ page, limit: pageSize });
      setRows(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const money = (v) =>
    `$ ${Number(v ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })}`;

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
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (t) => <Tag color={TYPE_COLORS[t] || "default"}>{t}</Tag>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (v, r) => {
        const negative = ["withdrawal", "deduction"].includes(r.type);
        return (
          <span className={negative ? "text-red-600 font-semibold" : "text-emerald-600 font-semibold"}>
            {negative ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {money(v)}
          </span>
        );
      },
    },
    {
      title: "Balance after",
      dataIndex: "balance_after",
      key: "balance_after",
      align: "right",
      render: (v) => money(v),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (v) => <span className="text-slate-500">{v || "—"}</span>,
    },
    {
      title: "Date",
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

      {/* AdminLTE .card: transactions table */}
      <div className="bg-white rounded-md border border-[#e3e6f0] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#e3e6f0]">
          <h3 className="m-0 text-base font-semibold text-[#343a40]">
            Transactions <span className="text-xs font-normal text-slate-400 ml-1">({total})</span>
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
          scroll={{ x: 950 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            showTotal: (t) => `${t} transactions`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </div>

      <Typography variant="body2" sx={{ color: "#868e96", mt: 1.5 }}>
        Admin balance adjustments are recorded here as <b>deposit</b> entries with their description.
      </Typography>
    </div>
  );
}
