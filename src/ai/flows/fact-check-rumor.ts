
'use server';
/**
 * @fileOverview Defines a Genkit flow for fact-checking a rumor against official reports.
 *
 * - factCheckRumor - A function that performs the analysis.
 * - FactCheckRumorInput - The input type for the function.
 * - FactCheckRumorOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Report } from '@/lib/types';

const FactCheckRumorInputSchema = z.object({
  rumorText: z.string().describe('The user-submitted rumor or social media post to be fact-checked.'),
  reports: z.array(z.any()).describe('A list of official, verified reports from the crisis management system.'),
});
export type FactCheckRumorInput = z.infer<typeof FactCheckRumorInputSchema>;

const FactCheckRumorOutputSchema = z.object({
  conclusion: z.enum(['Supported', 'Not Supported', 'Unverified']).describe('The AI\'s conclusion about the rumor.'),
  reasoning: z.string().describe('A brief explanation for the conclusion, referencing specific reports if possible.'),
});
export type FactCheckRumorOutput = z.infer<typeof FactCheckRumorOutputSchema>;

export async function factCheckRumor(input: FactCheckRumorInput): Promise<FactCheckRumorOutput> {
  return factCheckRumorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'factCheckRumorPrompt',
  input: { schema: FactCheckRumorInputSchema },
  output: { schema: FactCheckRumorOutputSchema },
  prompt: `You are an AI assistant for a crisis management team. Your task is to fact-check a potential rumor from social media against a list of official, verified reports.

Here is the rumor you need to analyze:
"{{{rumorText}}}"

Here is the list of current, official reports from the database:
---
{{{json reports}}}
---

Analyze the rumor and compare it to the information in the official reports.
- If the official reports contain facts that directly confirm the rumor, set the conclusion to "Supported".
- If the official reports contain facts that directly contradict the rumor, set the conclusion to "Not Supported".
- If the official reports do not contain any information related to the rumor, set the conclusion to "Unverified".

Provide a brief, clear reasoning for your conclusion. If you find a supporting or contradicting report, mention its ID or key details in your reasoning.`,
});

const factCheckRumorFlow = ai.defineFlow(
  {
    name: 'factCheckRumorFlow',
    inputSchema: FactCheckRumorInputSchema,
    outputSchema: FactCheckRumorOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
