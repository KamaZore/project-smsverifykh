import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button as MuiButton, Tooltip } from "@mui/material";
import { ReloadOutlined, SearchOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { Input, Table, Typography, Spin, Tag } from "antd";
import { getStockServices, getStockCount } from "../api/admin.api";

const { Text } = Typography;

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "in", label: "In Stock" },
  { key: "out", label: "Out of Stock" },
];

export default function StockPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [counts, setCounts] = useState({});
  const [checking, setChecking] = useState({});

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStockServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  const checkCount = useCallback(async (serviceCode) => {
    setChecking((prev) => ({ ...prev, [serviceCode]: true }));
    try {
      const data = await getStockCount(serviceCode);
      setCounts((prev) => ({ ...prev, [serviceCode]: data?.count ?? 0 }));
    } catch {
      setCounts((prev) => ({ ...prev, [serviceCode]: -1 }));
    } finally {
      setChecking((prev) => ({ ...prev, [serviceCode]: false }));
    }
  }, []);

  const filteredServices = useMemo(() => {
    let list = services;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.code?.toLowerCase().includes(q) ||
          s.name?.toLowerCase().includes(q),
      );
    }
    if (filter === "in") {
      list = list.filter((s) => (counts[s.code] ?? 0) > 0);
    } else if (filter === "out") {
      list = list.filter((s) => counts[s.code] !== undefined && counts[s.code] <= 0);
    }
    return list;
  }, [services, search, filter, counts]);

  const checkAll = useCallback(async () => {
    const codes = filteredServices.map((s) => s.code);
    for (const code of codes) {
      if (counts[code] === undefined) {
        await checkCount(code);
      }
    }
  }, [filteredServices, counts, checkCount]);

  const stats = useMemo(() => {
    const checked = Object.keys(counts).length;
    const inStock = Object.values(counts).filter((c) => c > 0).length;
    const outStock = Object.values(counts).filter((c) => c === 0).length;
    return { total: services.length, checked, inStock, outStock };
  }, [services, counts]);

  const columns = [
    {
      title: "#",
      width: 60,
      render: (_, __, i) => i + 1,
    },
    {
      title: "Service Code",
      dataIndex: "code",
      key: "code",
      render: (code) => <span className="font-mono text-sm font-semibold">{String(code || "")}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => {
        if (!name) return <Text type="secondary">—</Text>;
        if (typeof name === "string") return name;
        return <Text type="secondary">—</Text>;
      },
    },
    {
      title: "Stock",
      key: "count",
      width: 120,
      align: "center",
      render: (_, record) => {
        const code = record.code;
        const c = counts[code];
        if (checking[code]) return <Spin size="small" />;
        if (c === undefined) return <Text type="secondary">—</Text>;
        if (c === -1) return <Tag color="error">Error</Tag>;
        return c > 0 ? (
          <Tag color="success">{c}</Tag>
        ) : (
          <Tag color="default">0</Tag>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 110,
      align: "center",
      render: (_, record) => {
        const code = record.code;
        const c = counts[code];
        if (c === undefined) return <Tag>Unknown</Tag>;
        if (c === -1) return <Tag color="error">Error</Tag>;
        return c > 0 ? (
          <Tag color="success">In Stock</Tag>
        ) : (
          <Tag color="default">Out of Stock</Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Tooltip title="Check available numbers">
          <MuiButton
            size="small"
            variant="outlined"
            onClick={() => checkCount(record.code)}
            disabled={checking[record.code]}
            sx={{ textTransform: "none", minWidth: 0, px: 1.5 }}
          >
            {checking[record.code] ? <Spin size="small" /> : "Check"}
          </MuiButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="max-w-5xl space-y-4">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-lg border border-[#e3e6f0] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#e3e6f0]">
          <h3 className="m-0 text-base font-semibold text-[#343a40]">
            <CloudDownloadOutlined className="mr-2 text-indigo-500" />
            Number Stock
          </h3>
          <div className="flex items-center gap-2">
            <Tooltip title="Refresh services list">
              <MuiButton
                size="small"
                variant="outlined"
                onClick={loadServices}
                disabled={loading}
                sx={{ textTransform: "none", minWidth: 0, px: 1.5 }}
              >
                <ReloadOutlined spin={loading} />
              </MuiButton>
            </Tooltip>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="px-4 py-2 bg-slate-50 border border-[#e3e6f0] rounded-md text-center min-w-[80px]">
              <div className="text-xs text-slate-400">Total</div>
              <div className="text-lg font-bold text-[#343a40]">{stats.total}</div>
            </div>
            <div className="px-4 py-2 bg-green-50 border border-green-100 rounded-md text-center min-w-[80px]">
              <div className="text-xs text-green-500">In Stock</div>
              <div className="text-lg font-bold text-green-700">{stats.inStock}</div>
            </div>
            <div className="px-4 py-2 bg-slate-50 border border-[#e3e6f0] rounded-md text-center min-w-[80px]">
              <div className="text-xs text-slate-400">Out of Stock</div>
              <div className="text-lg font-bold text-slate-500">{stats.outStock}</div>
            </div>
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-md text-center min-w-[80px]">
              <div className="text-xs text-indigo-400">Checked</div>
              <div className="text-lg font-bold text-indigo-700">{stats.checked}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
              placeholder="Search services..."
              prefix={<SearchOutlined className="text-slate-400" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              size="small"
              style={{ width: 260 }}
            />
            <div className="flex gap-1">
              {STATUS_FILTERS.map((f) => (
                <MuiButton
                  key={f.key}
                  size="small"
                  variant={filter === f.key ? "contained" : "outlined"}
                  onClick={() => setFilter(f.key)}
                  sx={{
                    textTransform: "none",
                    minWidth: 0,
                    px: 2,
                    ...(filter === f.key
                      ? { bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }
                      : {}),
                  }}
                >
                  {f.label}
                </MuiButton>
              ))}
            </div>
            <MuiButton
              size="small"
              variant="outlined"
              onClick={checkAll}
              disabled={loading}
              startIcon={<CloudDownloadOutlined />}
              sx={{ textTransform: "none", ml: "auto" }}
            >
              Check All
            </MuiButton>
          </div>

          <Table
            dataSource={filteredServices}
            columns={columns}
            rowKey="code"
            loading={loading}
            size="small"
            pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `${t} services` }}
            locale={{ emptyText: "No services found" }}
          />
        </div>
      </div>
    </div>
  );
}
