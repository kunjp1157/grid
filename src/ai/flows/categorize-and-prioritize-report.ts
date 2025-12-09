'use server';
/**
 * @fileOverview This file defines a Genkit flow for automatically categorizing and prioritizing a new report.
 *
 * - categorizeAndPrioritizeReport - A function that handles the analysis.
 * - CategorizeAndPrioritizeReportInput - The input type for the function.
 * - CategorizeAndPrioritizeReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ReportPriority, AllReportTypes, ReportType } from '@/lib/types';


const CategorizeAndPrioritizeReportInputSchema = z.object({
  description: z.string().describe('The user-provided description of the issue.'),
  mediaDataUri: z.string().optional().describe("An optional image of the issue, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type CategorizeAndPrioritizeReportInput = z.infer<typeof CategorizeAndPrioritizeReportInputSchema>;

const CategorizeAndPrioritizeReportOutputSchema = z.object({
  category: z.custom<ReportType>(val => AllReportTypes.includes(val as ReportType)).describe('The most appropriate category for the report.'),
  priority: z.nativeEnum(ReportPriority).describe('The assessed priority level for the report.'),
  reasoning: z.string().describe('A brief explanation for the chosen category and priority.'),
});
export type CategorizeAndPrioritizeReportOutput = z.infer<typeof CategorizeAndPrioritizeReportOutputSchema>;

export async function categorizeAndPrioritizeReport(input: CategorizeAndPrioritizeReportInput): Promise<CategorizeAndPrioritizeReportOutput> {
  return categorizeAndPrioritizeReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeAndPrioritizeReportPrompt',
  input: {schema: CategorizeAndPrioritizeReportInputSchema},
  output: {schema: CategorizeAndPrioritizeReportOutputSchema},
  prompt: `You are an expert crisis management dispatcher with advanced visual analysis capabilities. Your task is to analyze a new report, including a user-submitted photo, to determine its category and, most importantly, its priority level.

  **If a photo is provided, your primary assessment should come from a detailed visual analysis of the image.** The user's text description is secondary. Assess the severity of the situation based on what you see. For example, distinguish between a minor crack and a major road collapse, or a small trash fire versus a building engulfed in flames.

  Available Categories:
  ${AllReportTypes.join(', ')}

  Available Priority Levels:
  ${Object.values(ReportPriority).join(', ')}

  Analyze the following report details:
  Description: {{{description}}}
  {{#if mediaDataUri}}
  Photo: {{media url=mediaDataUri}}
  {{/if}}

  Based on the visual evidence (if available) and the description, determine the most fitting category and priority. Your priority assessment should be based on this scale:
  - Critical: Immediate threat to life, or major infrastructure collapse is visible. Requires instant response (e.g., building on fire, major accident with injuries, road collapse).
  - High: Serious disruption or potential for widespread harm is visible. Requires urgent attention (e.g., waterlogging blocking a major road, downed power lines).
  - Medium: Significant inconvenience or localized damage is visible. Should be addressed soon (e.g., a large, deep pothole on a busy street).
  - Low: Minor issue or inconvenience with no immediate danger visible. Can be scheduled for a later time (e.g., small pothole, overflowing trash can).

  Provide your response in the specified JSON format, including a brief reasoning for your choice that mentions the visual analysis if a photo was used.`,
});

const categorizeAndPrioritizeReportFlow = ai.defineFlow(
  {
    name: 'categorizeAndPrioritizeReportFlow',
    inputSchema: CategorizeAndPrioritizeReportInputSchema,
    outputSchema: CategorizeAndPrioritizeReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
