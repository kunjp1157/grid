import { ReportType } from '@/lib/types';
import { Flame, Waves, Car, Recycle, Wrench, AlertCircle, Wind, Droplets, Ear, Zap, Sewer, Bus, Shield } from 'lucide-react';
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
    case ReportType.AirPollution:
        return <Wind {...props} />
    case ReportType.WaterScarcity:
        return <Droplets {...props} />
    case ReportType.NoisePollution:
        return <Ear {...props} />
    case ReportType.PowerOutage:
        return <Zap {...props} />
    case ReportType.SewageLeak:
        return <Sewer {...props} />
    case ReportType.PublicTransportIssue:
        return <Bus {...props} />
    case ReportType.CrimeAndSafety:
        return <Shield {...props} />
    default:
      return <AlertCircle {...props} />;
  }
}
