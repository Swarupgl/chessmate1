'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI chess moves.
 *
 * - generateAIMove - A function that generates a chess move for the AI opponent.
 * - GenerateAIMoveInput - The input type for the generateAIMove function, representing the current board state.
 * - GenerateAIMoveOutput - The return type for the generateAIMove function, representing the AI's move.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAIMoveInputSchema = z.object({
  boardState: z.string().describe('A string representing the current state of the chessboard in FEN notation.'),
});
export type GenerateAIMoveInput = z.infer<typeof GenerateAIMoveInputSchema>;

const GenerateAIMoveOutputSchema = z.object({
  move: z.string().describe('The AI opponent’s generated chess move in algebraic notation (e.g., e2e4).'),
  reasoning: z.string().describe('The AI opponent’s reasoning for the chess move.'),
});
export type GenerateAIMoveOutput = z.infer<typeof GenerateAIMoveOutputSchema>;

export async function generateAIMove(input: GenerateAIMoveInput): Promise<GenerateAIMoveOutput> {
  return generateAIMoveFlow(input);
}

const analyzeBoardState = ai.defineTool({
  name: 'analyzeBoardState',
  description: 'Analyzes the current board state and suggests possible chess moves.',
  inputSchema: z.object({
    boardState: z.string().describe('The current state of the chessboard in FEN notation.'),
  }),
  outputSchema: z.object({
    possibleMoves: z.array(z.string()).describe('A list of legal chess moves in algebraic notation.'),
    evaluation: z.string().describe('An evaluation of the current board state, indicating the advantage for either side.'),
  }),
},
async (input) => {
  // Placeholder implementation for analyzing the board state.
  // In a real application, this would involve a chess engine.
  return {
    possibleMoves: ['e2e4', 'd2d4', 'Nf3', 'c2c4'], // Example moves
    evaluation: 'The position is slightly advantageous for white.', // Example evaluation
  };
});

const prompt = ai.definePrompt({
  name: 'generateAIMovePrompt',
  input: {schema: GenerateAIMoveInputSchema},
  output: {schema: GenerateAIMoveOutputSchema},
  tools: [analyzeBoardState],
  prompt: `You are a sophisticated chess AI, playing as black.

You will receive the current state of the board, and you must respond with a valid chess move in algebraic notation.

Use the provided tools to analyze the board and follow chess strategy.

Board State: {{{boardState}}}

Consider your strategy, and explain your reasoning for choosing that move.

Output the move, and reasoning in the format specified by the output schema.
`,
});

const generateAIMoveFlow = ai.defineFlow(
  {
    name: 'generateAIMoveFlow',
    inputSchema: GenerateAIMoveInputSchema,
    outputSchema: GenerateAIMoveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
