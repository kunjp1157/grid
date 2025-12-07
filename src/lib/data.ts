import type { User, Report, Zone } from './types';
import { ReportStatus, ReportType } from './types';

export const users: User[] = [
  {
    id: 'citizen1',
    name: 'John Doe',
    email: 'citizen@example.com',
    role: 'citizen',
  },
  {
    id: 'admin1',
    name: 'Jane Smith',
    email: 'admin@example.com',
    role: 'admin',
    zoneId: 'zone1',
  },
];

export const zones: Zone[] = [
    { id: 'zone1', name: 'North Zone' },
    { id: 'zone2', name: 'South Zone' },
    { id: 'zone3', name: 'East Zone' },
    { id: 'zone4', name: 'West Zone' },
];

export const reports: Report[] = [
  {
    id: 'report1',
    userId: 'citizen1',
    type: ReportType.Waterlogging,
    description: 'Major waterlogging near the central park. Traffic is completely blocked.',
    location: { lat: 28.6139, lng: 77.2090 },
    status: ReportStatus.New,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    mediaUrl: 'https://picsum.photos/seed/100/600/400',
    resolutionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'report2',
    userId: 'citizen1',
    type: ReportType.RoadDamage,
    description: 'A large pothole has formed on the main street, causing issues for commuters.',
    location: { lat: 28.6145, lng: 77.2100 },
    status: ReportStatus.Assigned,
    assignedAdminId: 'admin1',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'report3',
    userId: 'citizen1',
    type: ReportType.Fire,
    description: 'Small fire reported in a dumpster behind the supermarket.',
    location: { lat: 28.6150, lng: 77.2110 },
    status: ReportStatus.InProgress,
    assignedAdminId: 'admin1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    mediaUrl: 'https://picsum.photos/seed/101/600/400',
    resolutionDeadline: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'report4',
    userId: 'citizen1',
    type: ReportType.Accident,
    description: 'Minor traffic accident involving two cars. No major injuries reported but causing a jam.',
    location: { lat: 28.6155, lng: 77.2120 },
    status: ReportStatus.Resolved,
    assignedAdminId: 'admin1',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    mediaUrl: 'https://picsum.photos/seed/102/600/400',
    resolutionDeadline: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
