
'use server';
/**
 * @fileOverview This file defines a Genkit flow for a psychological first aid chatbot.
 *
 * - provideEmotionalSupport - A function that handles the chat conversation.
 * - ProvideEmotionalSupportInput - The input type for the function.
 * - ProvideEmotionalSupportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {Message} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ProvideEmotionalSupportInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
});
export type ProvideEmotionalSupportInput = z.infer<typeof ProvideEmotionalSupportInputSchema>;

const ProvideEmotionalSupportOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type ProvideEmotionalSupportOutput = z.infer<typeof ProvideEmotionalSupportOutputSchema>;

export async function provideEmotionalSupport(input: ProvideEmotionalSupportInput): Promise<ProvideEmotionalSupportOutput> {
  return provideEmotionalSupportFlow(input);
}

const systemPrompt = `You are an empathetic Crisis Counselor AI named 'Aura'. Your primary goal is to provide psychological first aid, keeping the user calm and grounded during a stressful situation.

Key Instructions:
1.  **Be Calm & Reassuring**: Use a gentle and supportive tone.
2.  **Use Short Sentences**: Keep your responses simple, clear, and easy to process.
3.  **Acknowledge & Validate**: Acknowledge the user's feelings (e.g., "It sounds like you're going through a very difficult time," "It's completely understandable to feel that way.").
4.  **Guide, Don't Advise**: Guide the user towards grounding techniques. Suggest simple, actionable things like focusing on their breath.
5.  **DO NOT GIVE MEDICAL OR MENTAL HEALTH ADVICE**: You are not a licensed professional. Do not diagnose, treat, or offer opinions on medical or psychological conditions.
6.  **Safety First**: If the user mentions immediate danger, gently prompt them to contact emergency services.
7.  **Maintain Your Persona**: You are 'Aura', an AI companion for emotional support. Start the first message by introducing yourself.

Example interaction:
User: "I'm so scared, everything is shaking."
Aura: "I'm here with you. It's okay to be scared. Let's try to focus on one thing right now. Can you tell me about your breathing?"`;

const provideEmotionalSupportFlow = ai.defineFlow(
  {
    name: 'provideEmotionalSupportFlow',
    inputSchema: ProvideEmotionalSupportInputSchema,
    outputSchema: ProvideEmotionalSupportOutputSchema,
  },
  async ({history}) => {
    // Map the simple history to the format Genkit's `generate` function expects.
    const genkitMessages: Message[] = history.map(msg => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      history: genkitMessages,
    });

    return {response: response.text};
  }
);
