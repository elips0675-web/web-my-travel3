'use server';
/**
 * @fileOverview A Genkit flow for generating AI activity recommendations.
 *
 * - aiActivityRecommendations - A function that provides AI-driven activity recommendations.
 * - AiActivityRecommendationsInput - The input type for the function.
 * - AiActivityRecommendationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiActivityRecommendationsInputSchema = z.object({
  destination: z.string().describe('The travel destination (city, country).'),
  preferences: z.string().describe('User preferences for activities, e.g., "for a couple, active, indoors".'),
  activityTypes: z.array(z.string()).optional().describe('Preferred activity types, e.g., ["VR", "quest", "bowling"]. If not specified, suggest a mix.'),
});
export type AiActivityRecommendationsInput = z.infer<typeof AiActivityRecommendationsInputSchema>;

const ActivityRecommendationSchema = z.object({
  name: z.string().describe('The name of the activity or venue.'),
  type: z.string().describe('The type of activity (e.g., "VR-арена", "Квест", "Боулинг", "Картинг").'),
  description: z.string().describe('A brief, engaging description of the activity.'),
  price: z.string().describe('An estimated price for the activity (e.g., "от 20 BYN/час").'),
  location: z.string().describe('The address or area where the activity is located.'),
  rating: z.number().min(1).max(5).optional().describe('The rating on a scale of 1 to 5.'),
  imageUrl: z.string().url().describe('A URL for an image of the activity.'),
});

const AiActivityRecommendationsOutputSchema = z.object({
  recommendations: z.array(ActivityRecommendationSchema).describe('A list of recommended activities.'),
});
export type AiActivityRecommendationsOutput = z.infer<typeof AiActivityRecommendationsOutputSchema>;

export async function aiActivityRecommendations(input: AiActivityRecommendationsInput): Promise<AiActivityRecommendationsOutput> {
  return aiActivityRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiActivityRecommendationsPrompt',
  input: {schema: AiActivityRecommendationsInputSchema},
  output: {schema: AiActivityRecommendationsOutputSchema},
  prompt: `You are an expert in local entertainment and activities.
Based on the user's destination and preferences, suggest 5-7 suitable activities.

Consider the following details:
Destination: {{{destination}}}
User Preferences: {{{preferences}}}
Preferred Activity Types (if specified): {{{activityTypes}}}

For each recommendation, provide the following in Russian:
- name: The name of the activity or venue.
- type: The type of activity (e.g., "VR-арена", "Квест", "Боулинг", "Картинг").
- description: A brief, engaging description of the activity.
- price: An estimated price for the activity (e.g., "от 20 BYN/час").
- location: The address or area where the activity is located.
- rating: An optional star rating from 1 to 5.
- imageUrl: Provide a placeholder image URL from \`https://picsum.photos/seed/{a-random-activity-word}/800/600\`.

Ensure the recommendations are diverse and match the user's preferences as closely as possible. Respond in Russian.`,
});

const aiActivityRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiActivityRecommendationsFlow',
    inputSchema: AiActivityRecommendationsInputSchema,
    outputSchema: AiActivityRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get activity recommendations from the AI.');
    }
    return output;
  }
);
