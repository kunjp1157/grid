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
  // This is a placeholder implementation. In a real app, this would query
  // a database of zones with their geographical boundaries.
  console.log('finding admin or zone at', input.latitude, input.longitude);
  // For demonstration, we'll return a static admin and zone.
  return {
    adminId: 'admin1', // Corresponds to Jane Smith
    zoneId: 'zone1', // Corresponds to North Zone
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

Return the assignedAdminId and assignedZoneId from the tool output in the output schema.
If the tool does not return an adminId or zoneId, you may leave the field empty.
`,
});

const geofenceAndRouteReportFlow = ai.defineFlow(
  {
    name: 'geofenceAndRouteReportFlow',
    inputSchema: GeofenceAndRouteReportInputSchema,
    outputSchema: GeofenceAndRouteReportOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const toolResponse = llmResponse.toolRequest?.output;

    if (!toolResponse) {
      return {
        assignedAdminId: undefined,
        assignedZoneId: undefined,
      };
    }
    
    return {
        assignedAdminId: toolResponse.adminId,
        assignedZoneId: toolResponse.zoneId
    }
  }
);
