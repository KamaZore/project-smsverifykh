import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

/**
 * Placeholder page for admin sections that will be built next
 * (Users / Activations / Transactions management). AdminLTE card style.
 */
export default function ComingSoonPage({ title = "Under construction", description = "" }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-md border border-[#e3e6f0] shadow-sm">
      <Result
        title={title}
        subTitle={description || "This section is under construction. Management screens are coming next."}
        extra={
          <Button type="primary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
}
