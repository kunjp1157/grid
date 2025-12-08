
import type { User, Report, Zone, ChatMessage } from './types';
import { ReportStatus, ReportPriority, AllReportTypes } from './types';

export const users: User[] = [
  {
    id: 'citizen1',
    name: 'John Doe',
    email: 'citizen@example.com',
    role: 'citizen',
    mobile: '+91-9876543210',
    address: '123, Main Street, Anytown',
    pincode: '110001',
    bloodGroup: 'O+',
    emergencyContactName: 'Alice Doe',
    emergencyContactNumber: '+91-9876543211',
  },
  {
    id: 'admin1',
    name: 'Jane Smith',
    email: 'admin@example.com',
    role: 'admin',
    zoneId: 'zone1',
    mobile: '+91-8765432109',
    address: '456, Admin Avenue, Govtown',
    pincode: '110002',
    bloodGroup: 'A-',
    emergencyContactName: 'Bob Smith',
    emergencyContactNumber: '+91-8765432108',
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
    type: 'Waterlogging',
    description: 'Major waterlogging near the central park. Traffic is completely blocked.',
    location: { lat: 28.6139, lng: 77.2090 },
    status: ReportStatus.New,
    priority: ReportPriority.High,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    mediaUrl: 'https://picsum.photos/seed/100/600/400',
    assignedAdminId: 'admin1',
    resolutionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg1',
        senderId: 'admin1',
        text: 'We have received your report. A team is being dispatched. Can you confirm if the water level is rising?',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg2',
        senderId: 'citizen1',
        text: 'Yes, it seems to be rising slowly. The drains are completely clogged.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'report2',
    userId: 'citizen1',
    type: 'Road Damage',
    description: 'A large pothole has formed on the main street, causing issues for commuters.',
    location: { lat: 28.6145, lng: 77.2100 },
    status: ReportStatus.Assigned,
    priority: ReportPriority.Medium,
    assignedAdminId: 'admin1',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'report3',
    userId: 'citizen1',
    type: 'Sewage Leak',
    description: 'Sewage leak reported in a residential area. Foul smell and unsanitary conditions.',
    location: { lat: 28.6150, lng: 77.2110 },
    status: ReportStatus.Overdue,
    priority: ReportPriority.High,
    assignedAdminId: 'admin1',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    mediaUrl: 'https://picsum.photos/seed/101/600/400',
    resolutionDeadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'report4',
    userId: 'citizen1',
    type: 'Accident',
    description: 'Minor traffic accident involving two cars. No major injuries reported but causing a jam.',
    location: { lat: 28.6155, lng: 77.2120 },
    status: ReportStatus.Resolved,
    priority: ReportPriority.Low,
    assignedAdminId: 'admin1',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    mediaUrl: 'https://picsum.photos/seed/102/600/400',
    resolutionDeadline: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4,
    feedback: "The issue was resolved, but it took a bit longer than I expected. Overall, a good job."
  },
   {
    id: 'report5',
    userId: 'citizen1',
    type: 'Fire',
    description: 'Small fire reported in a dumpster behind the supermarket.',
    location: { lat: 28.6150, lng: 77.2110 },
    status: ReportStatus.InProgress,
    priority: ReportPriority.Critical,
    assignedAdminId: 'admin1',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'report6',
    userId: 'citizen1',
    type: 'Power Outage',
    description: 'The entire block has been without power for the last 3 hours.',
    location: { lat: 28.6160, lng: 77.2130 },
    status: ReportStatus.Resolved,
    priority: ReportPriority.High,
    assignedAdminId: 'admin1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
