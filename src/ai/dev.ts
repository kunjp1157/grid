
import { config } from 'dotenv';
config();

import '@/ai/flows/geofence-and-route-reports.ts';
import '@/ai/flows/track-report-resolution-deadlines.ts';
import '@/ai/flows/send-notification.ts';
import '@/ai/flows/categorize-and-prioritize-report.ts';
import '@/ai/flows/generate-sop.ts';
import '@/ai/flows/fact-check-rumor.ts';
import '@/ai/flows/process-sos-audio.ts';

