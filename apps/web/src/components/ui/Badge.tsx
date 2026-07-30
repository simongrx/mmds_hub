import type { ProjectStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const styles: Record<ProjectStatus, string> = {
  pending: "bg-mustard/30 text-mustard-dark",
  in_development: "bg-blue-100 text-blue-700",
  delivered: "bg-success/25 text-green-700",
};

export default function Badge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      ● {STATUS_LABELS[status]}
    </span>
  );
}
