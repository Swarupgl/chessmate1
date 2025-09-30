'use server';
import { generateAIMove } from '@/ai/flows/generate-ai-move';
import type { GenerateAIMoveOutput } from '@/ai/flows/generate-ai-move';

export async function makeAIMove(fen: string): Promise<GenerateAIMoveOutput | { error: string }> {
  try {
    const result = await generateAIMove({ boardState: fen });
    if (!result.move) {
      console.error('AI did not return a move.', result);
      return { error: 'AI failed to generate a valid move.' };
    }
    return result;
  } catch (e) {
    console.error('Error calling generateAIMove flow:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `AI failed to make a move: ${errorMessage}` };
  }
}
