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
  timestamp: string;
  mediaUrl?: string;
  assignedAdminId?: string;
  resolutionDeadline?: string;
};

export type Zone = {
  id: string;
  name: string;
};
