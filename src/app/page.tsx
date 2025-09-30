import { ChessGame } from '@/components/chess-game';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <header className="text-center mb-4 md:mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          ChessMate
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          The ultimate AI chess challenge. Your move.
        </p>
      </header>
      <main className="w-full max-w-7xl mx-auto">
        <ChessGame />
      </main>
      <footer className="text-center mt-4 md:mt-8">
        <p className="text-xs text-muted-foreground">
          Built with Next.js, Genkit AI, and Shadcn/UI.
        </p>
      </footer>
    </div>
  );
}
