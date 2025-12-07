'use server';

/**
 * @fileOverview A flow to track report resolution deadlines and trigger overdue alerts.
 *
 * - trackReportResolutionDeadline - A function that checks if a report's resolution deadline has been missed and triggers an alert.
 * - TrackReportResolutionDeadlineInput - The input type for the trackReportResolutionDeadline function.
 * - TrackReportResolutionDeadlineOutput - The return type for the trackReportResolutionDeadline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrackReportResolutionDeadlineInputSchema = z.object({
  reportId: z.string().describe('The ID of the report to track.'),
  resolutionDeadline: z.string().datetime().describe('The resolution deadline for the report (ISO Datetime string).'),
  status: z.string().describe('The current status of the report.'),
  adminId: z.string().describe('The ID of the assigned admin.'),
});
export type TrackReportResolutionDeadlineInput = z.infer<typeof TrackReportResolutionDeadlineInputSchema>;

const TrackReportResolutionDeadlineOutputSchema = z.object({
  isOverdue: z.boolean().describe('Whether the report is overdue.'),
  alertTriggered: z.boolean().describe('Whether an overdue alert was triggered.'),
});
export type TrackReportResolutionDeadlineOutput = z.infer<typeof TrackReportResolutionDeadlineOutputSchema>;

export async function trackReportResolutionDeadline(
  input: TrackReportResolutionDeadlineInput
): Promise<TrackReportResolutionDeadlineOutput> {
  return trackReportResolutionDeadlineFlow(input);
}

const checkOverduePrompt = ai.definePrompt({
  name: 'checkOverduePrompt',
  input: {schema: TrackReportResolutionDeadlineInputSchema},
  output: {schema: z.object({isOverdue: z.boolean()})},
  prompt: `You are a system that checks if a report is overdue based on its resolution deadline and current status.

  Determine if the report is overdue based on the current time and the provided resolution deadline.
  Consider the report overdue only if the current status is NOT 'Resolved' and the resolution deadline has passed.

  Report ID: {{{reportId}}}
  Resolution Deadline: {{{resolutionDeadline}}}
  Current Status: {{{status}}}
  Current Time: ${new Date().toISOString()}

  Is the report overdue? Respond with only a boolean value.`,
});

const triggerAlertTool = ai.defineTool({
  name: 'triggerOverdueAlert',
  description: 'Triggers an overdue alert to the relevant admin.',
  inputSchema: z.object({
    adminId: z.string().describe('The ID of the admin to alert.'),
    reportId: z.string().describe('The ID of the overdue report.'),
  }),
  outputSchema: z.boolean().describe('Whether the alert was successfully triggered.'),
},
async (input) => {
    // Placeholder: Implement the actual logic to trigger an overdue alert to the admin.
    // This could involve sending a notification via a push notification service or updating a database.
    console.log(`Simulating triggering overdue alert for report ${input.reportId} to admin ${input.adminId}`);
    return true; // Indicate successful alert trigger (replace with actual result).
  }
);

const trackReportResolutionDeadlineFlow = ai.defineFlow(
  {
    name: 'trackReportResolutionDeadlineFlow',
    inputSchema: TrackReportResolutionDeadlineInputSchema,
    outputSchema: TrackReportResolutionDeadlineOutputSchema,
  },
  async input => {
    const {output} = await checkOverduePrompt(input);
    const isOverdue = output?.isOverdue ?? false;

    let alertTriggered = false;
    if (isOverdue) {
      alertTriggered = await triggerAlertTool({adminId: input.adminId, reportId: input.reportId});
    }

    return {isOverdue, alertTriggered};
  }
);
