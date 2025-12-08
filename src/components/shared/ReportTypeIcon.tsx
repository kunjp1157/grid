import type { ReportType } from '@/lib/types';
import { Flame, Waves, Car, Recycle, Wrench, AlertCircle, Wind, Droplets, Ear, Zap, Biohazard, Bus, Shield } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface ReportTypeIconProps extends LucideProps {
  type: ReportType;
}

export function ReportTypeIcon({ type, ...props }: ReportTypeIconProps) {
  switch (type) {
    case 'Waterlogging':
      return <Waves {...props} />;
    case 'Fire':
      return <Flame {...props} />;
    case 'Accident':
      return <Car {...props} />;
    case 'Waste Management':
        return <Recycle {...props} />
    case 'Road Damage':
        return <Wrench {...props} />
    case 'Air Pollution':
        return <Wind {...props} />
    case 'Water Scarcity':
        return <Droplets {...props} />
    case 'Noise Pollution':
        return <Ear {...props} />
    case 'Power Outage':
        return <Zap {...props} />
    case 'Sewage Leak':
        return <Biohazard {...props} />
    case 'Public Transport Issue':
        return <Bus {...props} />
    case 'Crime and Safety':
        return <Shield {...props} />
    default:
      return <AlertCircle {...props} />;
  }
}
