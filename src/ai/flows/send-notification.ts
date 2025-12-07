'use server';
/**
 * @fileOverview A flow for sending notifications to users.
 *
 * - sendNotification - A function that handles sending a notification.
 * - SendNotificationInput - The input type for the sendNotification function.
 * - SendNotificationOutput - The return type for the sendNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendNotificationInputSchema = z.object({
  userId: z.string().describe('The ID of the user to notify.'),
  reportId: z.string().describe('The ID of the relevant report.'),
  message: z.string().describe('The notification message.'),
});
export type SendNotificationInput = z.infer<typeof SendNotificationInputSchema>;

const SendNotificationOutputSchema = z.object({
  success: z.boolean().describe('Whether the notification was sent successfully.'),
});
export type SendNotificationOutput = z.infer<typeof SendNotificationOutputSchema>;

export async function sendNotification(input: SendNotificationInput): Promise<SendNotificationOutput> {
  return sendNotificationFlow(input);
}

const sendPushNotificationTool = ai.defineTool({
    name: 'sendPushNotification',
    description: 'Sends a push notification to a user device.',
    inputSchema: z.object({
        userId: z.string(),
        message: z.string(),
    }),
    outputSchema: z.boolean(),
}, async (input) => {
    // In a real application, this would integrate with a push notification service
    // like Firebase Cloud Messaging (FCM) to send a real notification.
    console.log(`Simulating push notification to user ${input.userId}: "${input.message}"`);
    return true;
});


const sendNotificationFlow = ai.defineFlow(
  {
    name: 'sendNotificationFlow',
    inputSchema: SendNotificationInputSchema,
    outputSchema: SendNotificationOutputSchema,
  },
  async (input) => {
    const success = await sendPushNotificationTool({
        userId: input.userId,
        message: input.message,
    });
    return { success };
  }
);
