
'use client';

import { useState } from 'react';
import type { ChatMessage, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useTranslation } from '@/context/LocalizationContext';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentUser: User;
  otherUser: User | undefined;
  onSendMessage: (text: string) => void;
}

export function ChatInterface({ messages, currentUser, otherUser, onSendMessage }: ChatInterfaceProps) {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };
  
  const getUserInitials = (name: string) => name.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.reportDetails.chatTitle') || 'Conversation'}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === currentUser.id;
              const sender = isCurrentUser ? currentUser : otherUser;
              return (
                <div
                  key={message.id}
                  className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={`https://avatar.vercel.sh/${sender?.email}.png`} alt={sender?.name} />
                      <AvatarFallback>{sender ? getUserInitials(sender.name) : '?'}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs rounded-lg p-3 text-sm',
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p>{message.text}</p>
                    <p className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {formatDate(message.timestamp, "p")}
                    </p>
                  </div>
                   {isCurrentUser && (
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={`https://avatar.vercel.sh/${sender?.email}.png`} alt={sender?.name} />
                       <AvatarFallback>{sender ? getUserInitials(sender.name) : 'U'}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('admin.reportDetails.chatPlaceholder') || "Type a message..."}
            autoComplete="off"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
