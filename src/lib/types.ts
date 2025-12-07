export type User = {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  zoneId?: string;
};

export enum ReportStatus {
  New = 'New',
  Assigned = 'Assigned',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Overdue = 'Overdue'
}

export enum ReportPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical'
}

export enum ReportType {
  Waterlogging = 'Waterlogging',
  Fire = 'Fire',
  Accident = 'Accident',
  WasteManagement = 'Waste Management',
  RoadDamage = 'Road Damage',
  AirPollution = 'Air Pollution',
  WaterScarcity = 'Water Scarcity',
  NoisePollution = 'Noise Pollution',
  PowerOutage = 'Power Outage',
  SewageLeak = 'Sewage Leak',
  PublicTransportIssue = 'Public Transport Issue',
  CrimeAndSafety = 'Crime and Safety',
  Other = 'Other',
}

export type ChatMessage = {
    id: string;
    senderId: string; // 'citizen1' or 'admin1'
    text: string;
    timestamp: string;
}

export type Report = {
  id: string;
  userId: string;
  type: ReportType;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  status: ReportStatus;
  priority: ReportPriority;
  timestamp: string;
  mediaUrl?: string;
  assignedAdminId?: string;
  resolutionDeadline?: string;
  rating?: number;
  feedback?: string;
  messages?: ChatMessage[];
};

export type Zone = {
  id: string;
  name: string;
};
