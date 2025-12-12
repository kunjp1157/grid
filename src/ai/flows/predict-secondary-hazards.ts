
'use server';
/**
 * @fileOverview Defines a Genkit flow for predicting likely secondary hazards based on an initial crisis report.
 *
 * - predictSecondaryHazards - The main function to run the prediction.
 * - PredictSecondaryHazardsInput - The input type for the function.
 * - PredictedHazard - The type for a single predicted hazard.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictSecondaryHazardsInputSchema = z.object({
  reportType: z.string().describe('The type of the primary reported crisis (e.g., "Heavy Flooding").'),
  description: z.string().describe('The user-provided description of the primary crisis.'),
});
export type PredictSecondaryHazardsInput = z.infer<typeof PredictSecondaryHazardsInputSchema>;

const PredictedHazardSchema = z.object({
  hazard: z.string().describe('The name of the likely secondary hazard (e.g., "Power Outage").'),
  reasoning: z.string().describe('A brief explanation of why this hazard is a likely consequence.'),
});
export type PredictedHazard = z.infer<typeof PredictedHazardSchema>;

const PredictSecondaryHazardsOutputSchema = z.array(PredictedHazardSchema);


export async function predictSecondaryHazards(input: PredictSecondaryHazardsInput): Promise<PredictedHazard[]> {
  return predictSecondaryHazardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictSecondaryHazardsPrompt',
  input: { schema: PredictSecondaryHazardsInputSchema },
  output: { schema: PredictSecondaryHazardsOutputSchema },
  prompt: `You are an expert in urban disaster management and infrastructure systems. Your task is to predict the most likely secondary hazards that could result from an initial reported crisis.

  An initial crisis report has been filed with the following details:
  - Type: "{{{reportType}}}"
  - Description: "{{{description}}}"

  Based on urban infrastructure logic and common disaster scenarios, identify 2-3 likely cascading or secondary hazards that could occur next. For each hazard, provide a concise reasoning.

  Examples:
  - If the initial report is 'Heavy Flooding', likely secondary hazards could be 'Power Outages' (due to submerged electrical equipment), 'Water Contamination' (due to overwhelmed sewage systems), and 'Traffic Gridlock' (due to closed roads).
  - If the initial report is a 'Major Power Outage', secondary hazards could be 'Communication Failures' (cell towers losing power), 'Traffic Signal Malfunctions', and 'Failure of Medical Equipment'.

  Return your answer as a JSON array of objects, with each object containing the predicted 'hazard' and 'reasoning'.`,
});

const predictSecondaryHazardsFlow = ai.defineFlow(
  {
    name: 'predictSecondaryHazardsFlow',
    inputSchema: PredictSecondaryHazardsInputSchema,
    outputSchema: PredictSecondaryHazardsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
