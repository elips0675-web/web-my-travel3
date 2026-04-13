'use server';
/**
 * @fileOverview A Genkit flow for generating AI transport recommendations.
 *
 * - aiRentalCarRecommendations - A function that provides AI-driven transport recommendations.
 * - AiRentalCarRecommendationsInput - The input type for the function.
 * - AiRentalCarRecommendationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRentalCarRecommendationsInputSchema = z.object({
  location: z.string().describe('The pickup location (city, airport).'),
  startDate: z.string().describe('The start date of the rental in YYYY-MM-DD format.'),
  endDate: z.string().describe('The end date of the rental in YYYY-MM-DD format.'),
  transportCategories: z.array(z.string()).describe('Preferred transport types: "Каршеринг", "Такси", "Велосипеды", "Самокаты"'),
});
export type AiRentalCarRecommendationsInput = z.infer<typeof AiRentalCarRecommendationsInputSchema>;

const TransportRecommendationSchema = z.object({
  name: z.string().describe('The transport model or service name, e.g., "Яндекс.Такси", "Whoosh", "Вело-Город".'),
  type: z.string().describe('The transport category: "Каршеринг", "Такси", "Велосипеды", "Самокаты".'),
  supplier: z.string().describe('The company/service provider name, e.g., "Yandex", "Whoosh".'),
  price: z.string().describe('The estimated price in Belarusian Rubles (BYN), e.g., "от 0.5 BYN/мин", "от 5 BYN за поездку", "15 BYN/час".'),
  rating: z.number().min(1).max(5).describe('The rating of the service on a scale of 1 to 5.'),
  features: z.object({
    passengers: z.number().optional().describe('Number of passenger seats.'),
    luggage: z.number().optional().describe('Number of large luggage bags it can fit.'),
    transmission: z.string().optional().describe('Transmission type, e.g., "Автомат" or "Механика".'),
    doors: z.number().optional().describe('Number of doors.'),
  }),
  imageUrl: z.string().url().describe('A URL for an image of the transport.'),
});

const AiRentalCarRecommendationsOutputSchema = z.object({
  recommendations: z.array(TransportRecommendationSchema).describe('A list of recommended transport options.'),
});

export type AiRentalCarRecommendationsOutput = z.infer<typeof AiRentalCarRecommendationsOutputSchema>;

export async function aiRentalCarRecommendations(input: AiRentalCarRecommendationsInput): Promise<AiRentalCarRecommendationsOutput> {
  return aiRentalCarRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRentalCarRecommendationsPrompt',
  input: {schema: AiRentalCarRecommendationsInputSchema},
  output: {schema: AiRentalCarRecommendationsOutputSchema},
  prompt: `You are an expert in urban transport. Based on the user's location, dates, and preferred categories, suggest 5 suitable transport options.

Consider the following details:
Location: {{{location}}}
Dates: From {{{startDate}}} to {{{endDate}}}
Transport Categories: {{{transportCategories}}}

For each recommendation, provide the following in Russian:
- name: The transport model or service name (e.g., "Яндекс.Драйв", "Такси Комфорт+", "Nextbike", "Whoosh").
- type: The category from the input transportCategories.
- supplier: The rental company or service provider name (e.g., "Яндекс", "Ситимобил", "Nextbike", "Whoosh").
- price: The estimated price in Belarusian Rubles (BYN), e.g., "от 0.5 BYN/мин", "от 5 BYN за поездку", "15 BYN/час", "1.5 BYN старт".
- rating: A star rating from 1 to 5.
- features: An object with details. For cars: passengers, luggage, transmission, doors. For bikes/scooters: passengers can be 1. Other features can be omitted if not applicable.
- imageUrl: Provide a placeholder image URL from \`https://picsum.photos/seed/{a-random-transport-related-word}/800/600\`.

Ensure the recommendations match the requested categories. Respond in Russian.`,
});

const aiRentalCarRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiRentalCarRecommendationsFlow',
    inputSchema: AiRentalCarRecommendationsInputSchema,
    outputSchema: AiRentalCarRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get transport rental recommendations from the AI.');
    }
    return output;
  }
);
