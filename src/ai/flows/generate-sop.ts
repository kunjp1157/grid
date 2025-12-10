'use server';
/**
 * @fileOverview Defines a Genkit flow for generating a Standard Operating Procedure (SOP) checklist for crisis management.
 *
 * - generateSop - A function that generates the SOP.
 * - SopItem - The type for a single checklist item.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {ReportPriority, ReportType} from '@/lib/types';

const GenerateSopInputSchema = z.object({
  reportType: z.string().describe('The type of the reported crisis (e.g., Fire, Accident).'),
  priority: z.nativeEnum(ReportPriority).describe('The priority level of the crisis.'),
  description: z.string().describe('The user-provided description of the crisis.'),
});
type GenerateSopInput = z.infer<typeof GenerateSopInputSchema>;

const SopItemSchema = z.object({
  text: z.string().describe('The actionable text for the checklist item.'),
  completed: z.boolean().describe('The initial completion status, which should always be false.'),
});
export type SopItem = z.infer<typeof SopItemSchema>;

const GenerateSopOutputSchema = z.array(SopItemSchema);

export async function generateSop(input: GenerateSopInput): Promise<SopItem[]> {
  return generateSopFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSopPrompt',
  input: {schema: GenerateSopInputSchema},
  output: {schema: GenerateSopOutputSchema},
  prompt: `You are an expert Crisis Management Coordinator. Your task is to generate a concise, actionable Standard Operating Procedure (SOP) checklist for a crisis response administrator.

The crisis is of type '{{{reportType}}}' with a '{{{priority}}}' priority level.
The description is: "{{{description}}}"

Based on this information, generate a step-by-step checklist of the most critical actions the administrator should take *immediately*.
- The list should contain between 3 to 5 essential steps.
- Each step must be a clear, direct command.
- Examples: "Dispatch nearest fire brigade," "Notify police for traffic control," "Alert nearby hospitals."
- Do not add any conversational text or explanations. Only provide the checklist items.
- Ensure the initial 'completed' status for each item is set to false.`,
});

const generateSopFlow = ai.defineFlow(
  {
    name: 'generateSopFlow',
    inputSchema: GenerateSopInputSchema,
    outputSchema: GenerateSopOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
