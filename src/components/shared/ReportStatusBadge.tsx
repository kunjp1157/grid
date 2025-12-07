import { Badge } from "@/components/ui/badge";
import { ReportStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/LocalizationContext";

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const { t } = useTranslation();
  const statusKey = `reportStatus.${status.replace(' ', '')}`;
  const translatedStatus = t(statusKey);

  return (
    <Badge
      className={cn("capitalize", {
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300": status === ReportStatus.New,
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300": status === ReportStatus.Assigned,
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300": status === ReportStatus.InProgress,
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300": status === ReportStatus.Resolved,
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300": status === ReportStatus.Overdue,
      })}
    >
      {translatedStatus}
    </Badge>
  );
}
