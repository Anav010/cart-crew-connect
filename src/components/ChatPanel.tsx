
import { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, User } from '@/types';
import { useChat } from '@/hooks/useChat';

interface ChatPanelProps {
  currentUser: User;
}

const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'];

const ChatPanel = ({ currentUser }: ChatPanelProps) => {
  const { messages, newMessage, setNewMessage, sendMessage, addReaction } = useChat();
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(currentUser.id, currentUser, newMessage.trim());
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Group Chat</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                <div className="flex gap-3">
                  <img
                    src={message.user.avatar}
                    alt={message.user.name}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {message.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="text-sm">{message.message}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {message.reactions?.map((reaction) => (
                        <Button
                          key={reaction.emoji}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => addReaction(message.id, reaction.emoji, currentUser.id)}
                        >
                          {reaction.emoji} {reaction.users.length}
                        </Button>
                      ))}
                      
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => setShowEmojiPicker(
                            showEmojiPicker === message.id ? null : message.id
                          )}
                        >
                          <Smile className="w-3 h-3" />
                        </Button>
                        
                        {showEmojiPicker === message.id && (
                          <div className="absolute top-8 left-0 bg-white border rounded-lg shadow-lg p-2 z-50">
                            <div className="grid grid-cols-4 gap-1">
                              {commonEmojis.map((emoji) => (
                                <Button
                                  key={emoji}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    addReaction(message.id, emoji, currentUser.id);
                                    setShowEmojiPicker(null);
                                  }}
                                >
                                  {emoji}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="sm"
              className="bg-walmart-blue hover:bg-walmart-light-blue"
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatPanel;
