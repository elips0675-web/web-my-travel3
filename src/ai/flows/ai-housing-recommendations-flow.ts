'use server';
/**
 * @fileOverview A Genkit flow for generating AI housing recommendations.
 *
 * - aiHousingRecommendations - A function that provides AI-driven housing recommendations.
 * - AiHousingRecommendationsInput - The input type for the aiHousingRecommendations function.
 * - AiHousingRecommendationsOutput - The return type for the aiHousingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiHousingRecommendationsInputSchema = z.object({
  destination: z.string().describe('The travel destination (city, country, specific region).'),
  startDate: z.string().describe('The start date of the trip in YYYY-MM-DD format.'),
  endDate: z.string().describe('The end date of the trip in YYYY-MM-DD format.'),
  preferences: z.string().describe('User preferences for accommodation, e.g., "luxury, near city center, pet-friendly, budget-friendly, family-friendly".'),
  accommodationTypes: z.array(z.string()).optional().describe('Preferred accommodation types, e.g., ["hotel", "apartment", "hostel", "guesthouse", "Агротуризм"]. If not specified, suggest a mix.'),
});
export type AiHousingRecommendationsInput = z.infer<typeof AiHousingRecommendationsInputSchema>;

const AiHousingRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the accommodation.'),
      type: z.string().describe('The type of accommodation (e.g., hotel, apartment, hostel, guesthouse, Агротуризм).'),
      location: z.string().describe('The location of the accommodation (city, area).'),
      description: z.string().describe('A brief description highlighting the key features and why it matches the user preferences.'),
      priceEstimate: z.string().optional().describe('An estimated price range per night in Belarusian Rubles (BYN) (e.g., "200-300 BYN" or "Бюджетно").'),
      rating: z.number().min(1).max(5).optional().describe('The rating of the accommodation on a scale of 1 to 5.'),
      pros: z.array(z.string()).describe('A list of 2-4 short, specific positive aspects of the accommodation (e.g., "Free WiFi", "Swimming Pool", "Near beach").'),
      cons: z.array(z.string()).describe('A list of 1-2 potential negative aspects or considerations (e.g., "No parking", "Street noise").'),
      imageUrl: z.string().url().optional().describe('A URL for an image of the accommodation.'),
    })
  ).describe('A list of recommended housing options.'),
});
export type AiHousingRecommendationsOutput = z.infer<typeof AiHousingRecommendationsOutputSchema>;

export async function aiHousingRecommendations(input: AiHousingRecommendationsInput): Promise<AiHousingRecommendationsOutput> {
  return aiHousingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHousingRecommendationsPrompt',
  input: {schema: AiHousingRecommendationsInputSchema},
  output: {schema: AiHousingRecommendationsOutputSchema},
  prompt: `You are an expert travel agent specializing in accommodation recommendations.
Based on the user's destination, travel dates, and preferences, suggest 3-5 suitable housing options (hotels, apartments, hostels, guesthouses).

Consider the following details:
Destination: {{{destination}}}
Travel Dates: From {{{startDate}}} to {{{endDate}}}
User Preferences: {{{preferences}}}
Preferred Accommodation Types (if specified): {{{accommodationTypes}}}

For each recommendation, provide the following:
- Name: The name of the accommodation.
- Type: The type of accommodation (e.g., hotel, apartment, hostel, guesthouse, Агротуризм).
- Location: The city or specific area where the accommodation is located.
- Description: A brief, compelling description highlighting its key features and how it aligns with the user's preferences.
- Price Estimate: An estimated price range per night in Belarusian Rubles (BYN) (e.g., "200-300 BYN" or "Бюджетно").
- Rating: A star rating from 1 to 5, if applicable.
- Pros: A list of 2-4 short, specific positive aspects (e.g., "Free WiFi", "Swimming Pool", "Near beach").
- Cons: A list of 1-2 potential negative aspects (e.g., "No parking", "Street noise").
- Image URL: Provide a placeholder image URL from \`https://picsum.photos/seed/{a-random-word}/800/600\`.

Ensure the recommendations are diverse if no specific accommodation types are requested. Focus on matching the user's preferences as closely as possible. Respond in Russian and use BYN for currency.`,
});

const aiHousingRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiHousingRecommendationsFlow',
    inputSchema: AiHousingRecommendationsInputSchema,
    outputSchema: AiHousingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get housing recommendations from the AI.');
    }
    return output;
  }
);
