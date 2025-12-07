import { config } from 'dotenv';
config();

import '@/ai/flows/geofence-and-route-reports.ts';
import '@/ai/flows/track-report-resolution-deadlines.ts';
import '@/ai/flows/send-notification.ts';
