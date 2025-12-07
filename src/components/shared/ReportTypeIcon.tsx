import { ReportType } from '@/lib/types';
import { Flame, Waves, Car, Recycle, Wrench, AlertCircle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface ReportTypeIconProps extends LucideProps {
  type: ReportType;
}

export function ReportTypeIcon({ type, ...props }: ReportTypeIconProps) {
  switch (type) {
    case ReportType.Waterlogging:
      return <Waves {...props} />;
    case ReportType.Fire:
      return <Flame {...props} />;
    case ReportType.Accident:
      return <Car {...props} />;
    case ReportType.WasteManagement:
        return <Recycle {...props} />
    case ReportType.RoadDamage:
        return <Wrench {...props} />
    default:
      return <AlertCircle {...props} />;
  }
}
