'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameInfoPanelProps {
  status: string;
  turn: 'w' | 'b';
  isAITurn: boolean;
  moveHistory: string[];
  aiReasoning: string;
  onReset: () => void;
}

export default function GameInfoPanel({ status, turn, isAITurn, moveHistory, aiReasoning, onReset }: GameInfoPanelProps) {
  const turnText = turn === 'w' ? 'White' : 'Black';

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Game Info</CardTitle>
            <CardDescription className="mt-1">{status}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onReset} aria-label="Reset Game">
            <RotateCw className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <p className="font-semibold text-sm">Turn:</p>
          <div
            className={cn(
              "w-5 h-5 rounded-full border-2",
              turn === 'w' ? 'bg-[hsl(var(--piece-white-fill))]' : 'bg-[hsl(var(--piece-black-fill))]'
            )}
          />
          <p className="font-medium">{turnText}</p>
          {isAITurn && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        <Separator className="mb-4"/>
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="ai">AI Thoughts</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <ScrollArea className="h-64 rounded-md border p-2">
              {moveHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No moves yet.</p>
              ) : (
                <ol className="text-sm">
                  {moveHistory.reduce((acc, move, index) => {
                    if (index % 2 === 0) {
                      acc.push([move]);
                    } else {
                      acc[acc.length - 1].push(move);
                    }
                    return acc;
                  }, [] as string[][]).map((pair, i) => (
                    <li key={i} className="flex items-center space-x-4 px-2 py-1 rounded-md hover:bg-muted">
                      <span className="font-mono text-muted-foreground w-6 text-right">{i + 1}.</span>
                      <span className="font-semibold w-16">{pair[0]}</span>
                      {pair[1] && <span className="font-semibold w-16">{pair[1]}</span>}
                    </li>
                  ))}
                </ol>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="ai">
            <ScrollArea className="h-64 rounded-md border p-4">
              <p className="text-sm text-foreground whitespace-pre-wrap font-mono">
                {aiReasoning || "The AI is contemplating its next move..."}
              </p>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
