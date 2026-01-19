
"use client";

import { useState, useRef, useEffect } from 'react';
import { provideEmotionalSupport } from '@/ai/flows/provide-emotional-support';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, BrainCircuit, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Use a simple, local type for managing chat messages in the component's state.
interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export default function EmotionalSupportPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initial greeting from the chatbot
  useEffect(() => {
    const getInitialGreeting = async () => {
      setIsLoading(true);
      try {
        // The flow expects an object with a `history` property, which is an array.
        const result = await provideEmotionalSupport({ history: [] });
        setMessages([{ role: 'model', content: result.response }]);
      } catch (error) {
        console.error(error);
        toast({ title: 'Could not connect to AI', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    getInitialGreeting();
  }, [toast]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // The flow expects the full history in the correct format.
      const result = await provideEmotionalSupport({ history: newMessages });
      setMessages([...newMessages, { role: 'model', content: result.response }]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'model', content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Psychological First Aid</CardTitle>
              <CardDescription>A safe space to talk. Chat with Aura, your AI emotional support companion.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[50vh] flex flex-col">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn('flex items-end gap-2', message.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    {message.role === 'model' && (
                       <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                        <AvatarFallback><Bot size={18} /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-md rounded-lg p-3 text-sm',
                        message.role === 'user'
                          ? 'bg-muted'
                          : 'bg-primary text-primary-foreground'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                 {isLoading && messages[messages.length-1]?.role === 'user' && (
                    <div className="flex items-end gap-2 justify-start">
                         <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                            <AvatarFallback><Bot size={18} /></AvatarFallback>
                        </Avatar>
                        <div className="bg-primary text-primary-foreground rounded-lg p-3 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    </div>
                 )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    autoComplete="off"
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
            <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-200 [&>svg]:text-yellow-600">
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                    This is an AI chatbot and not a licensed professional. It cannot provide medical advice. If you are in immediate distress, please contact your local emergency services.
                </AlertDescription>
            </Alert>
        </CardFooter>
      </Card>
    </div>
  );
}
