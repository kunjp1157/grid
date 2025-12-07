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
import { ReportType, ReportPriority } from '@/lib/types';


const CategorizeAndPrioritizeReportInputSchema = z.object({
  description: z.string().describe('The user-provided description of the issue.'),
  mediaDataUri: z.string().optional().describe("An optional image of the issue, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type CategorizeAndPrioritizeReportInput = z.infer<typeof CategorizeAndPrioritizeReportInputSchema>;

const CategorizeAndPrioritizeReportOutputSchema = z.object({
  category: z.nativeEnum(ReportType).describe('The most appropriate category for the report.'),
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
  prompt: `You are an expert crisis management dispatcher. Your task is to analyze a new report and determine its category and priority level.

  Available Categories:
  ${Object.values(ReportType).join(', ')}

  Available Priority Levels:
  ${Object.values(ReportPriority).join(', ')}

  Analyze the following report details:
  Description: {{{description}}}
  {{#if mediaDataUri}}
  Photo: {{media url=mediaDataUri}}
  {{/if}}

  Based on the information, determine the most fitting category and priority.
  - Critical: Immediate threat to life or major infrastructure. Requires instant response (e.g., major fire, building collapse, large-scale accident).
  - High: Serious disruption or potential for harm. Requires urgent attention (e.g., waterlogging blocking a major road, power outage in a large area).
  - Medium: Significant inconvenience or localized issue. Should be addressed soon (e.g., large pothole on a busy street, sewage leak).
  - Low: Minor issue or inconvenience. Can be scheduled for a later time (e.g., isolated public transport issue, minor road damage).

  Provide your response in the specified JSON format, including a brief reasoning for your choice.`,
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
