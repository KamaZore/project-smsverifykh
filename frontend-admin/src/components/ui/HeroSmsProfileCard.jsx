import { useState, useEffect } from "react";
import { Card, Tag, Button, Space, Spin } from "antd";
import { ReloadOutlined, LinkOutlined } from "@ant-design/icons";
import { Typography } from "@mui/material";
import { getHeroProfile } from "../../api/admin.api";

/**
 * AdminLTE-styled Hero SMS profile summary card.
 * Mobile: no line breaks / errors in the icon/text layout
 * (icon-only profile cards would be too terse;
 * we show a compact status card instead).
 */
export default function HeroSmsProfileCard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = async (reload = false) => {
    setLoading(reload ? false : true);
    setRefreshing(reload);
    setError(null);
    try {
      const data = await getHeroProfile();
      setProfile(data);
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          err?.message ||
          "Failed to load Hero SMS profile",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reachableTag =
    profile?.provider?.reachable === true ? (
      <Tag color="success" icon={<LinkOutlined />}>Online</Tag>
    ) : (
      <Tag color="error" icon={<ReloadOutlined />}>Unreachable</Tag>
    );

  const balance =
    profile?.provider?.balance != null ? (
      <Typography
        variant="h6"
        component="span"
        className="font-semibold text-slate-800"
      >
        ${Number(profile.provider.balance).toFixed(2)}
      </Typography>
    ) : (
      <Typography variant="body2" className="text-slate-400">
        — no balance —
      </Typography>
    );

  const statusLabel = profile?.configured
    ? profile?.provider?.reachable === true
      ? "Active"
      : "Not reachable"
    : "Not configured";

  const statusColor =
    profile?.configured && profile?.provider?.reachable
      ? "success"
      : "warning";

  const lastChecked =
    profile?.lastChecked
      ? new Date(profile.lastChecked).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : null;

  return (
    <Card
      size="small"
      title="HERO SMS"
      extra={
        <Button
          type="text"
          size="small"
          icon={refreshing ? <Spin size="small" /> : <ReloadOutlined />}
          onClick={() => load(true)}
          title="Refresh profile"
        />
      }
      className="bg-[#fff] border-[#e3e6f0]"
      styles={{ body: { padding: 12 } }}
    >
      {error ? (
        <div className="text-sm text-rose-600">{error}</div>
      ) : loading ? (
        <div className="flex items-center gap-2 text-slate-400">
          <Spin size="small" />
          <span>Loading profile…</span>
        </div>
      ) : (
        <div className="text-sm text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-slate-400">
              Status
            </Typography>
            {reachableTag}
          </div>

          <div className="flex items-center justify-between">
            <Typography variant="body2" className="text-slate-400">
              Key
            </Typography>
            <Typography
              variant="body2"
              className="font-mono text-xs text-slate-500"
            >
              {profile?.source === "database"
                ? `DB · ${profile.maskedKey}`
                : profile?.maskedKey
                  ? `${profile.source} · ${profile.maskedKey}`
                  : "None"}
            </Typography>
          </div>

          {profile?.configured && (
            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-slate-400">
                Balance
              </Typography>
              {balance}
            </div>
          )}

          {profile?.provider?.message && (
            <div className="flex items-start justify-between gap-2">
              <Typography variant="body2" className="text-slate-400">
                Provider
              </Typography>
              <Typography
                variant="body2"
                className="text-xs text-slate-500 italic max-w-[180px] break-words"
              >
                {profile.provider.message}
              </Typography>
            </div>
          )}

          {profile?.activeActivations != null && (
            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-slate-400">
                Active activations
              </Typography>
              <Typography
                variant="body2"
                className="font-semibold text-slate-700"
              >
                {profile.activeActivations}
              </Typography>
            </div>
          )}

          {lastChecked && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <Typography variant="caption" className="text-slate-400">
                Last check
              </Typography>
              <Typography
                variant="caption"
                className="text-slate-500 font-mono"
              >
                {lastChecked}
              </Typography>
            </div>
          )}

          <div className="pt-1">
            <Button
              type="link"
              size="small"
              icon={<LinkOutlined />}
              onClick={() =>
                (window.location.href = "/settings/hero-profile")
              }
              className="text-indigo-600 hover:text-indigo-800"
            >
              View details
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
