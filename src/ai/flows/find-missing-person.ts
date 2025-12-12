
'use server';
/**
 * @fileOverview Defines a Genkit flow for identifying a missing person in a group photo.
 *
 * - findMissingPerson - A function that handles the person matching process.
 * - FindMissingPersonInput - The input type for the findMissingPerson function.
 * - FindMissingPersonOutput - The return type for the findMissingPerson function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FindMissingPersonInputSchema = z.object({
  missingPersonImage: z.string().describe("A clear photo of the missing person, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  groupImage: z.string().describe("A photo of a group of people (e.g., at a shelter), as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type FindMissingPersonInput = z.infer<typeof FindMissingPersonInputSchema>;

const FindMissingPersonOutputSchema = z.object({
  matchFound: z.boolean().describe('Whether a potential match was found.'),
  confidenceScore: z.number().min(0).max(1).describe('The confidence level of the match, from 0.0 to 1.0.'),
  reasoning: z.string().describe('A brief explanation for the conclusion, noting similarities or key differences.'),
});
export type FindMissingPersonOutput = z.infer<typeof FindMissingPersonOutputSchema>;

export async function findMissingPerson(input: FindMissingPersonInput): Promise<FindMissingPersonOutput> {
  return findMissingPersonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findMissingPersonPrompt',
  input: { schema: FindMissingPersonInputSchema },
  output: { schema: FindMissingPersonOutputSchema },
  prompt: `You are an AI assistant specialized in finding missing persons. Your task is to compare two images.

  - Image A is a reference photo of a missing individual.
  - Image B is a photo of a group of people, possibly at a shelter or aid station.

  Carefully analyze the face, clothing, and any distinguishing features of the person in Image A. Then, meticulously scan Image B to see if any person in that group significantly resembles the individual from Image A.

  Image A (Missing Person): {{media url=missingPersonImage}}
  Image B (Group Photo): {{media url=groupImage}}

  Based on your visual analysis, determine if a match exists.
  - If you find a likely match, set 'matchFound' to true and provide a confidence score between 0.5 and 1.0.
  - If there is no clear match, set 'matchFound' to false and provide a confidence score below 0.5.
  - In your reasoning, briefly describe the key similarities (if a match is found) or the main reasons for ruling out a match. Be concise. For example: "The individual in the center of the group photo shares a similar facial structure and is wearing a similar colored shirt." or "No individuals in the group photo share key features like age, hair color, or facial structure with the missing person."
  `,
});

const findMissingPersonFlow = ai.defineFlow(
  {
    name: 'findMissingPersonFlow',
    inputSchema: FindMissingPersonInputSchema,
    outputSchema: FindMissingPersonOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
