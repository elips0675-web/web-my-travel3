'use server';
/**
 * @fileOverview This file provides an AI-powered flow for generating personalized tour and excursion recommendations.
 *
 * - aiTourRecommendations - A function that handles the AI tour recommendation process.
 * - AiTourRecommendationsInput - The input type for the aiTourRecommendations function.
 * - AiTourRecommendationsOutput - The return type for the aiTourRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiTourRecommendationsInputSchema = z.object({
  destination: z.string().describe('The destination city or region for the trip.'),
  travelDates: z.object({
    start: z.string().datetime().describe('The start date of the trip in ISO 8601 format.'),
    end: z.string().datetime().describe('The end date of the trip in ISO 8601 format.'),
  }).describe('The travel dates for the trip.'),
  interests: z.array(z.string()).describe('A list of user interests, e.g., ["history", "food", "hiking"].'),
});
export type AiTourRecommendationsInput = z.infer<typeof AiTourRecommendationsInputSchema>;

const TourRecommendationSchema = z.object({
  name: z.string().describe('The name of the tour or excursion.'),
  description: z.string().describe('A brief, engaging description of the tour (2-3 sentences).'),
  type: z.string().describe('The type of activity, e.g., "cultural", "adventure", "food", "sightseeing".'),
  priceRange: z.string().describe('Estimated price for the tour per person in Belarusian Rubles (BYN), e.g., "150 BYN".'),
  bookingLink: z.string().url().describe('A hypothetical booking link for the tour.'),
  relevanceScore: z.number().min(0).max(100).describe('A score from 0 to 100 indicating how relevant this recommendation is to the user\'s interests and destination.'),
  duration: z.string().describe('The duration of the tour, e.g., "4 hours", "Full day".'),
  groupSize: z.string().describe('The typical group size, e.g., "Small group (up to 12 people)".'),
  highlights: z.array(z.string()).describe('A list of 3-4 key highlights or activities included in the tour.'),
  included: z.array(z.string()).describe('A list of what is included in the price (e.g., "Professional guide", "Transportation", "Entrance fees").'),
  excluded: z.array(z.string()).describe('A list of what is not included in the price (e.g., "Lunch", "Gratuities", "Hotel pickup").'),
  galleryImageUrls: z.array(z.string().url()).describe('A list of 4 placeholder image URLs for a gallery from `https://picsum.photos/seed/{a-random-word}/800/600`. The first one should be the main image.'),
});

const AiTourRecommendationsOutputSchema = z.array(TourRecommendationSchema).describe('A list of personalized tour and excursion recommendations.');
export type AiTourRecommendationsOutput = z.infer<typeof AiTourRecommendationsOutputSchema>;

export async function aiTourRecommendations(input: AiTourRecommendationsInput): Promise<AiTourRecommendationsOutput> {
  return aiTourRecommendationsFlow(input);
}

const aiTourRecommendationsPrompt = ai.definePrompt({
  name: 'aiTourRecommendationsPrompt',
  input: { schema: AiTourRecommendationsInputSchema },
  output: { schema: AiTourRecommendationsOutputSchema },
  prompt: `You are an expert travel agent. Generate a list of 5 personalized tour/excursion recommendations based on the user's criteria.

Destination: {{{destination}}}
Travel Dates: From {{{travelDates.start}}} to {{{travelDates.end}}}
User Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

For each recommendation, provide the following details:
- name: The name of the tour.
- description: A brief, engaging description (2-3 sentences).
- type: The type of activity (e.g., "cultural", "adventure", "food").
- priceRange: Estimated price per person in Belarusian Rubles (BYN), e.g., "150 BYN" or "от 200 BYN".
- bookingLink: A hypothetical booking link.
- relevanceScore: A score from 0 to 100 on how well it matches the user's interests.
- duration: Tour duration (e.g., "4 hours", "Full day").
- groupSize: Typical group size (e.g., "Small group (up to 12 people)").
- highlights: A list of 3-4 key highlights.
- included: A list of what is included (e.g., "Professional guide", "Transportation").
- excluded: A list of what is not included (e.g., "Lunch", "Gratuities").
- galleryImageUrls: A list of 4 placeholder image URLs from \`https://picsum.photos/seed/{a-random-word}/800/600\`. The first URL will be the main image. Ensure each URL has a unique random seed word.

Ensure the output is a JSON array matching the schema.
{{{_output_schema}}}`,
});

const aiTourRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiTourRecommendationsFlow',
    inputSchema: AiTourRecommendationsInputSchema,
    outputSchema: AiTourRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await aiTourRecommendationsPrompt(input);
    return output!;
  }
);
