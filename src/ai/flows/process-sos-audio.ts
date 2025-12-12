'use server';
/**
 * @fileOverview This file defines a Genkit flow for handling a voice-activated SOS report.
 * It transcribes the user's audio and analyzes it to create a structured crisis report.
 *
 * - processSosAudio - The main function to process the audio.
 * - ProcessSosAudioInput - The input type for the function.
 * - ProcessSosAudioOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ReportPriority, AllReportTypes, ReportType } from '@/lib/types';


const ProcessSosAudioInputSchema = z.object({
  audioDataUri: z.string().describe("A recording of the user's voice, as a data URI. Expected format: 'data:audio/webm;base64,<encoded_data>'."),
});
export type ProcessSosAudioInput = z.infer<typeof ProcessSosAudioInputSchema>;

const ProcessSosAudioOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
  category: z.custom<ReportType>(val => AllReportTypes.includes(val as ReportType)).describe('The most appropriate category for the report based on the transcript.'),
  priority: z.nativeEnum(ReportPriority).describe('The assessed priority level for the report.'),
  description: z.string().describe('A structured summary of the situation from the transcript.'),
});
export type ProcessSosAudioOutput = z.infer<typeof ProcessSosAudioOutputSchema>;

export async function processSosAudio(input: ProcessSosAudioInput): Promise<ProcessSosAudioOutput> {
  return processSosAudioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processSosAudioPrompt',
  input: {schema: ProcessSosAudioInputSchema},
  output: {schema: ProcessSosAudioOutputSchema},
  prompt: `You are an emergency dispatcher AI. You have received an audio recording from a user in distress. Your task is to transcribe the audio and analyze it to create an emergency report.

  1.  **Transcribe the Audio**: Listen to the audio and convert it to text.
  2.  **Analyze the Transcript**: Read the transcript and understand the user's situation.
  3.  **Determine Category and Priority**: Based on the urgency and nature of the events described, choose the most appropriate category and priority level.
  4.  **Create a Description**: Write a clear, concise description of the incident based on the information in the transcript.

  Available Categories:
  ${AllReportTypes.join(', ')}

  Available Priority Levels:
  ${Object.values(ReportPriority).join(', ')}

  Audio from user:
  {{media url=audioDataUri}}

  Provide your response in the specified JSON format. The priority should be 'Critical' or 'High' if there is any mention of immediate danger, injury, or a severe incident like a fire or major accident. The description should be a summary, not the raw transcript.`,
});

const processSosAudioFlow = ai.defineFlow(
  {
    name: 'processSosAudioFlow',
    inputSchema: ProcessSosAudioInputSchema,
    outputSchema: ProcessSosAudioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
