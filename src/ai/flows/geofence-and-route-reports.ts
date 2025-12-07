'use server';
/**
 * @fileOverview This file defines a Genkit flow for automatically determining the appropriate admin or zone for a new report based on its location.
 *
 * - geofenceAndRouteReport - A function that handles the geofencing and routing process.
 * - GeofenceAndRouteReportInput - The input type for the geofenceAndRouteReport function.
 * - GeofenceAndRouteReportOutput - The return type for the geofenceAndRouteReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeofenceAndRouteReportInputSchema = z.object({
  reportId: z.string().describe('The ID of the report.'),
  latitude: z.number().describe('The latitude of the report location.'),
  longitude: z.number().describe('The longitude of the report location.'),
});
export type GeofenceAndRouteReportInput = z.infer<typeof GeofenceAndRouteReportInputSchema>;

const GeofenceAndRouteReportOutputSchema = z.object({
  assignedAdminId: z.string().optional().describe('The ID of the assigned admin, if any.'),
  assignedZoneId: z.string().optional().describe('The ID of the assigned zone, if any.'),
});
export type GeofenceAndRouteReportOutput = z.infer<typeof GeofenceAndRouteReportOutputSchema>;

export async function geofenceAndRouteReport(input: GeofenceAndRouteReportInput): Promise<GeofenceAndRouteReportOutput> {
  return geofenceAndRouteReportFlow(input);
}

const findAdminOrZone = ai.defineTool({
  name: 'findAdminOrZone',
  description: 'Finds the appropriate admin or zone for a report based on its location.',
  inputSchema: z.object({
    latitude: z.number().describe('The latitude of the report location.'),
    longitude: z.number().describe('The longitude of the report location.'),
  }),
  outputSchema: z.object({
    adminId: z.string().optional().describe('The ID of the assigned admin, if any.'),
    zoneId: z.string().optional().describe('The ID of the assigned zone, if any.'),
  }),
}, async (input) => {
  // TODO: Implement the logic to find the admin or zone based on the location.
  // This is a placeholder implementation.
  console.log('finding admin or zone at', input.latitude, input.longitude);
  return {
    adminId: 'admin123', // Replace with actual logic to determine admin ID
    zoneId: 'zone456', // Replace with actual logic to determine zone ID
  };
});

const prompt = ai.definePrompt({
  name: 'geofenceAndRouteReportPrompt',
  tools: [findAdminOrZone],
  input: {schema: GeofenceAndRouteReportInputSchema},
  output: {schema: GeofenceAndRouteReportOutputSchema},
  prompt: `A new report has been submitted with the following location:
Latitude: {{{latitude}}}
Longitude: {{{longitude}}}

Use the findAdminOrZone tool to find the appropriate admin or zone for this report.

Return the adminId and zoneId from the tool output in the output schema.
If neither adminId nor zoneId is returned, leave the corresponding output field empty.

Report ID: {{{reportId}}}`, // Include reportId in the prompt
});

const geofenceAndRouteReportFlow = ai.defineFlow(
  {
    name: 'geofenceAndRouteReportFlow',
    inputSchema: GeofenceAndRouteReportInputSchema,
    outputSchema: GeofenceAndRouteReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
