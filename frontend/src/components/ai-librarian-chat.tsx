import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Mic, 
  MicOff,
  Bot,
  User,
  BookOpen,
  DollarSign,
  Search,
  Heart,
  Calendar,
  HelpCircle,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  typing?: boolean;
  suggestions?: string[];
  actionButtons?: {
    label: string;
    action: string;
    variant?: 'default' | 'outline' | 'secondary';
  }[];
}

interface AILibrarianChatProps {
  currentUser?: { name: string; email: string } | null;
  onBookSearch?: (query: string) => void;
  onNavigateToFines?: () => void;
  onNavigateToRecommendations?: () => void;
  onShowHelp?: () => void;
}

export function AILibrarianChat({ 
  currentUser,
  onBookSearch,
  onNavigateToFines,
  onNavigateToRecommendations,
  onShowHelp 
}: AILibrarianChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick action suggestions
  const quickActions = [
    { label: "Show my fines", icon: DollarSign, action: "fines" },
    { label: "Suggest books", icon: Heart, action: "recommendations" },
    { label: "Search catalog", icon: Search, action: "search" },
    { label: "My due dates", icon: Calendar, action: "due_dates" },
    { label: "Library hours", icon: HelpCircle, action: "hours" },
    { label: "Reading goals", icon: BookOpen, action: "goals" }
  ];

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: `Hello ${currentUser?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Librarian assistant. I can help you find books, check your account, answer questions, and more. How can I assist you today?`,
        timestamp: new Date(),
        suggestions: [
          "Find book recommendations",
          "Check my fines",
          "Search for a book",
          "Show library hours"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [currentUser]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show notification dot when chat is closed and new message arrives
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  // Clear notification when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowercaseMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let actionButtons: ChatMessage['actionButtons'] = [];

    // Determine response based on user input
    if (lowercaseMessage.includes('fine') || lowercaseMessage.includes('fee') || lowercaseMessage.includes('owe')) {
      response = "I can help you check your fines! You currently have ₹325 in outstanding fines for an overdue book. Would you like me to show you the details or help you pay them?";
      actionButtons = [
        { label: "View Fines", action: "view_fines", variant: "default" },
        { label: "Pay Now", action: "pay_fines", variant: "outline" }
      ];
    } else if (lowercaseMessage.includes('recommend') || lowercaseMessage.includes('suggest') || lowercaseMessage.includes('book')) {
      response = "Based on your reading history, I'd recommend some great books! You seem to enjoy modern design and science fiction. Would you like personalized recommendations?";
      actionButtons = [
        { label: "Show Recommendations", action: "recommendations", variant: "default" },
        { label: "Browse by Genre", action: "browse_genre", variant: "outline" }
      ];
    } else if (lowercaseMessage.includes('search') || lowercaseMessage.includes('find')) {
      response = "I can help you search our entire catalog! What type of book or specific title are you looking for? You can search by title, author, ISBN, or genre.";
      suggestions = ["Search science fiction", "Find books by author", "New releases", "Popular books"];
    } else if (lowercaseMessage.includes('hour') || lowercaseMessage.includes('open') || lowercaseMessage.includes('close')) {
      response = "📚 Our library hours are:\n\nMonday-Friday: 8:00 AM - 9:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: 12:00 PM - 6:00 PM\n\nWe're extending hours during exam week (7 AM - 11 PM)!";
    } else if (lowercaseMessage.includes('due') || lowercaseMessage.includes('return')) {
      response = "Let me check your borrowed books... You have 2 books currently checked out:\n\n📖 'Modern Design Principles' - Due in 2 days\n📖 'Romance in Paris' - Due in 5 days\n\nWould you like to renew any of these?";
      actionButtons = [
        { label: "Renew All", action: "renew_all", variant: "default" },
        { label: "View Details", action: "view_borrowed", variant: "outline" }
      ];
    } else if (lowercaseMessage.includes('goal') || lowercaseMessage.includes('reading')) {
      response = "Great question about reading goals! 📚 You're doing amazing this year:\n\n✅ 25 books read (Goal: 30)\n🎯 83% complete\n🏆 Earned 'Bookworm' badge\n\nYou're only 5 books away from your goal!";
    } else if (lowercaseMessage.includes('help') || lowercaseMessage.includes('what can you do')) {
      response = "I'm here to help with all your library needs! Here's what I can do:\n\n📚 Find and recommend books\n💰 Check fines and help with payments\n📅 Show due dates and renewals\n🔍 Search our catalog\n📊 Track reading goals\n⏰ Provide library information\n❓ Answer questions about services";
      suggestions = ["Show my account", "Find new books", "Check library policies", "Reading recommendations"];
    } else {
      // Generic helpful response
      response = "I'd be happy to help you with that! I can assist with finding books, checking your account, answering questions about library services, and much more. What would you like to know?";
      suggestions = ["Find book recommendations", "Check my fines", "Library hours", "Search catalog"];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions,
      actionButtons
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    
    switch (action) {
      case 'fines':
        message = 'Show my current fines';
        break;
      case 'recommendations':
        message = 'Can you recommend some books for me?';
        break;
      case 'search':
        message = 'I want to search for books';
        break;
      case 'due_dates':
        message = 'What books do I have due soon?';
        break;
      case 'hours':
        message = 'What are the library hours?';
        break;
      case 'goals':
        message = 'How am I doing with my reading goals?';
        break;
      default:
        message = action;
    }

    setInputMessage(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleActionButton = (action: string) => {
    switch (action) {
      case 'view_fines':
      case 'pay_fines':
        onNavigateToFines?.();
        break;
      case 'recommendations':
        onNavigateToRecommendations?.();
        break;
      case 'browse_genre':
        onBookSearch?.('');
        break;
      default:
        handleQuickAction(action);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecording = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
    // For now, just simulate the toggle
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex items-center gap-2 px-4 py-3"
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="glass-card px-3 py-2 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="h-16 w-16 rounded-full bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90 shadow-lg relative"
              >
                <MessageCircle className="h-6 w-6" />
                
                {/* Notification dot */}
                {hasNewMessage && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
                  />
                )}
                
                {/* Pulsing ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              x: 100, 
              y: 100 
            }}
            animate={{ 
              opacity: 1, 
              scale: isMinimized ? 0.5 : 1, 
              x: 0, 
              y: isMinimized ? 200 : 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              x: 100, 
              y: 100 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
          >
            <Card className="glass-card border-border/50 h-full flex flex-col overflow-hidden">
              {/* Chat Header */}
              <CardHeader className="border-b border-border/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div>
                      <h3 className="font-semibold">AI Librarian</h3>
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 bg-green-500 rounded-full"
                        />
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                      className="h-8 w-8 p-0"
                    >
                      {isSoundEnabled ? 
                        <Volume2 className="h-4 w-4" /> : 
                        <VolumeX className="h-4 w-4" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback className={
                                  message.type === 'user' 
                                    ? "bg-gradient-to-r from-[#75e6da] to-[#189ab4] text-white" 
                                    : "bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white"
                                }>
                                  {message.type === 'user' ? 
                                    <User className="h-4 w-4" /> : 
                                    <Bot className="h-4 w-4" />
                                  }
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex flex-col gap-2">
                                <div className={`glass-card px-3 py-2 rounded-2xl ${
                                  message.type === 'user' 
                                    ? 'rounded-br-sm bg-gradient-to-r from-[#189ab4]/10 to-[#75e6da]/10' 
                                    : 'rounded-bl-sm'
                                }`}>
                                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(message.timestamp)}
                                  </span>
                                  {message.type === 'bot' && (
                                    <Badge variant="outline" className="text-xs">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      AI
                                    </Badge>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                {message.actionButtons && (
                                  <div className="flex gap-2 flex-wrap">
                                    {message.actionButtons.map((button, index) => (
                                      <Button
                                        key={index}
                                        variant={button.variant || 'outline'}
                                        size="sm"
                                        onClick={() => handleActionButton(button.action)}
                                        className="text-xs h-7"
                                      >
                                        {button.label}
                                      </Button>
                                    ))}
                                  </div>
                                )}

                                {/* Suggestions */}
                                {message.suggestions && (
                                  <div className="flex flex-wrap gap-1">
                                    {message.suggestions.map((suggestion, index) => (
                                      <Button
                                        key={index}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleQuickAction(suggestion)}
                                        className="text-xs h-6 px-2 border border-border/50 hover:bg-primary/10"
                                      >
                                        {suggestion}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {/* Typing Indicator */}
                        <AnimatePresence>
                          {isTyping && <TypingIndicator />}
                        </AnimatePresence>

                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Quick Actions */}
                  {messages.length <= 1 && (
                    <div className="border-t border-border/50 p-3">
                      <div className="grid grid-cols-3 gap-2">
                        {quickActions.map((action, index) => (
                          <motion.div
                            key={action.action}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickAction(action.action)}
                              className="w-full h-auto p-2 flex flex-col gap-1 text-xs border-border/50 hover:bg-primary/10"
                            >
                              <action.icon className="h-4 w-4" />
                              <span className="text-xs">{action.label}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <CardContent className="border-t border-border/50 p-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          ref={inputRef}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything about the library..."
                          className="pr-12 glass border-border/50 focus:bg-background/50"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleVoiceRecording}
                          className={`absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 ${
                            isListening ? 'text-red-500 animate-pulse' : ''
                          }`}
                        >
                          {isListening ? 
                            <MicOff className="h-4 w-4" /> : 
                            <Mic className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}