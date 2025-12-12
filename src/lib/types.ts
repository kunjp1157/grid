

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  zoneId?: string;
  mobile?: string;
  address?: string;
  pincode?: string;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  medicalConditions?: string;
  isVolunteer?: boolean;
  skills?: string[];
  certifications?: string;
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

export const reportCategories = {
  'Public Safety': [
    'Fire',
    'Accident',
    'Crime and Safety',
    'Voice SOS'
  ],
  'Utilities': [
    'Waterlogging',
    'Power Outage',
    'Water Scarcity',
    'Sewage Leak'
  ],
  'Infrastructure': [
    'Road Damage'
  ],
  'Environment': [
    'Waste Management',
    'Air Pollution',
    'Noise Pollution'
  ],
  'Transport': [
    'Public Transport Issue'
  ],
  'Other': [
    'Other'
  ]
} as const;

export type ReportCategory = keyof typeof reportCategories;
export type ReportType = typeof reportCategories[ReportCategory][number];

export const AllReportTypes = Object.values(reportCategories).flat();

export const getCategoryForType = (type: ReportType): ReportCategory | undefined => {
    for (const category in reportCategories) {
        if ((reportCategories[category as ReportCategory] as readonly ReportType[]).includes(type)) {
            return category as ReportCategory;
        }
    }
    return undefined;
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

export const AllResourceTypes = ['Clean Water', 'First Aid Kit', 'Generator', 'Safe Shelter'] as const;
export type ResourceType = typeof AllResourceTypes[number];

export type CommunityResource = {
    id: string;
    userId: string;
    type: ResourceType;
    description: string;
    location: {
        lat: number;
        lng: number;
    };
    timestamp: string;
};


export enum TaskStatus {
    Open = 'Open',
    InProgress = 'In Progress',
    Completed = 'Completed'
}

export type VolunteerTask = {
    id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    status: TaskStatus;
    location: string;
    volunteersNeeded: number;
    volunteers: { userId: string; name: string }[];
    createdAt: string;
};
