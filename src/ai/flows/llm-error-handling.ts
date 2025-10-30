'use server';

/**
 * @fileOverview A Genkit flow for handling API errors using an LLM.
 *
 * - analyzeApiError - Analyzes API errors, identifies potential causes, and suggests solutions.
 * - AnalyzeApiErrorInput - The input type for the analyzeApiError function.
 * - AnalyzeApiErrorOutput - The return type for the analyzeApiError function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';
import { firebaseAdminConfig } from '@/firebase/admin-config';

// Ensure Firebase Admin is initialized only once.
if (!getApps().length) {
  initializeApp(firebaseAdminConfig);
}

const AnalyzeApiErrorInputSchema = z.object({
  errorDescription: z.string().describe('Detailed description of the API error.'),
  apiEndpoint: z.string().describe('The API endpoint that returned the error.'),
  requestPayload: z.string().optional().describe('The payload sent to the API endpoint, if applicable.'),
  userRole: z.string().describe('The role of the user making the API request (e.g., Admin, Escola, Cantineiro).'),
});
export type AnalyzeApiErrorInput = z.infer<typeof AnalyzeApiErrorInputSchema>;

const AnalyzeApiErrorOutputSchema = z.object({
  potentialCauses: z.array(z.string()).describe('List of potential causes for the API error.'),
  suggestedSolutions: z.array(z.string()).describe('List of suggested solutions to resolve the API error.'),
  firestoreSecurityAlert: z.string().optional().describe('Alert indicating potential Firestore security rule issues, if applicable.'),
});
export type AnalyzeApiErrorOutput = z.infer<typeof AnalyzeApiErrorOutputSchema>;


export const setRole = ai.defineFlow(
  {
    name: 'setRole',
    inputSchema: z.object({ uid: z.string(), role: z.string() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ uid, role }) => {
    try {
      await getAuth().setCustomUserClaims(uid, { role });
      return { success: true };
    } catch (error) {
      console.error('Error setting custom claims:', error);
      return { success: false };
    }
  }
);


export async function analyzeApiError(input: AnalyzeApiErrorInput): Promise<AnalyzeApiErrorOutput> {
  return analyzeApiErrorFlow(input);
}

const analyzeApiErrorPrompt = ai.definePrompt({
  name: 'analyzeApiErrorPrompt',
  input: {schema: AnalyzeApiErrorInputSchema},
  output: {schema: AnalyzeApiErrorOutputSchema},
  prompt: `You are an expert API error analyst. You will analyze the provided API error description, the API endpoint called, the request payload (if available), and the user role to determine the potential causes of the error and suggest solutions.

Consider potential causes such as:
- Incorrect API endpoint
- Invalid request payload
- Insufficient user permissions
- Backend server issues
- Firestore security rule violations

If the error description or user role suggests potential Firestore security rule issues, provide a specific alert in the firestoreSecurityAlert field suggesting a review of the Firestore security rules.

Error Description: {{{errorDescription}}}
API Endpoint: {{{apiEndpoint}}}
Request Payload: {{{requestPayload}}}
User Role: {{{userRole}}}

Respond with a structured JSON object containing potentialCauses, suggestedSolutions, and firestoreSecurityAlert (if applicable). Follow the output schema descriptions closely.
`,
});

const analyzeApiErrorFlow = ai.defineFlow(
  {
    name: 'analyzeApiErrorFlow',
    inputSchema: AnalyzeApiErrorInputSchema,
    outputSchema: AnalyzeApiErrorOutputSchema,
  },
  async input => {
    const {output} = await analyzeApiErrorPrompt(input);
    return output!;
  }
);