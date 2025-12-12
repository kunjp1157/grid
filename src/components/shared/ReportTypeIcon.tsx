
import type { ReportType, ResourceType } from '@/lib/types';
import { Flame, Waves, Car, Recycle, Wrench, AlertCircle, Wind, Droplets, Ear, Zap, Biohazard, Bus, Shield, Siren, HandHeart, BriefcaseMedical, Bolt, Home, ContactSearch, BrainCircuit } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface ReportTypeIconProps extends LucideProps {
  type: ReportType | ResourceType | 'MissingPersons' | 'EmotionalSupport';
}

export function ReportTypeIcon({ type, ...props }: ReportTypeIconProps) {
  switch (type) {
    // Report Types
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
    case 'Voice SOS':
        return <Siren {...props} />
    
    // Resource Types
    case 'Clean Water':
        return <Droplets {...props} />;
    case 'First Aid Kit':
        return <BriefcaseMedical {...props} />;
    case 'Generator':
        return <Bolt {...props} />;
    case 'Safe Shelter':
        return <Home {...props} />;
    
    // Other features
    case 'MissingPersons':
        return <ContactSearch {...props} />;
    case 'EmotionalSupport':
        return <BrainCircuit {...props} />;
        
    default:
      return <AlertCircle {...props} />;
  }
}
