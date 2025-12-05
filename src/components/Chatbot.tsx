import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, RotateCcw, Download, Mic, Paperclip, Bot, User as UserIcon, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { useTranslationWithParams } from "./utils/TranslationUtils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  sentiment?: "positive" | "neutral" | "negative";
  confidence?: number;
  relatedActions?: string[];
}

interface ConversationContext {
  lastTopic?: string;
  messageCount: number;
  userSentiment: "positive" | "neutral" | "negative";
}

interface ChatbotProps {
  className?: string;
}

export function Chatbot({ className = "" }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({
    messageCount: 0,
    userSentiment: "neutral"
  });
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, currentLanguage } = useTranslationWithParams();

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatbot-messages");
    const savedContext = localStorage.getItem("chatbot-context");
    
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    } else {
      // Show personalized welcome message
      addBotMessage(t("chatbot.greeting"), undefined, ["passport", "visa", "status"]);
    }
    
    if (savedContext) {
      setContext(JSON.parse(savedContext));
    }
  }, []);

  // Save messages and context to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatbot-messages", JSON.stringify(messages));
    }
    localStorage.setItem("chatbot-context", JSON.stringify(context));
  }, [messages, context]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Hide suggestions after first user message
  useEffect(() => {
    if (messages.filter(m => m.type === "user").length > 0) {
      setShowSuggestions(false);
    }
  }, [messages]);

  const analyzeSentiment = (text: string): { sentiment: "positive" | "neutral" | "negative", confidence: number } => {
    const lowerText = text.toLowerCase();
    
    const positiveWords = ["thank", "great", "good", "excellent", "perfect", "wonderful", "appreciate", "love", "asante", "nziza", "merci"];
    const negativeWords = ["problem", "issue", "error", "wrong", "bad", "difficult", "confused", "help", "tatizo", "ikibazo", "problème"];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveScore++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeScore++;
    });
    
    const totalWords = text.split(" ").length;
    const sentiment = positiveScore > negativeScore ? "positive" : negativeScore > positiveScore ? "negative" : "neutral";
    const confidence = Math.min((Math.max(positiveScore, negativeScore) / totalWords) * 100, 100);
    
    return { sentiment, confidence };
  };

  const addBotMessage = (content: string, sentiment?: "positive" | "neutral" | "negative", relatedActions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content,
      timestamp: new Date(),
      sentiment,
      relatedActions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const { sentiment, confidence } = analyzeSentiment(content);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
      sentiment,
      confidence
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Update context
    setContext(prev => ({
      ...prev,
      messageCount: prev.messageCount + 1,
      userSentiment: sentiment
    }));
  };

  const getEnhancedResponse = (input: string, prevMessages: Message[]): { response: string, actions?: string[] } => {
    const lowerInput = input.toLowerCase();
    let responseKey = "chatbot.error";
    let actions: string[] = [];
    
    // Multi-language keyword matching with context awareness
    const keywords = {
      passport: ["passport", "pasipoti", "passeport", "pasi"],
      visa: ["visa"],
      status: ["status", "track", "hali", "statut", "check", "where"],
      appointment: ["appointment", "miadi", "rendez-vous", "book", "schedule"],
      document: ["document", "requirement", "nyaraka", "inyandiko", "need", "required"],
      fee: ["fee", "cost", "price", "ada", "frais", "amafaranga", "pay", "payment"],
      processing: ["processing", "time", "how long", "délai", "when", "duration"],
      contact: ["contact", "support", "help", "msaada", "ubufasha", "call", "phone", "email"],
      biometric: ["biometric", "fingerprint", "photo", "alama", "biométrique"],
      emergency: ["emergency", "urgent", "dharura", "urgence", "fast", "quick"],
      citizenship: ["citizenship", "uraia", "citoyenneté", "national"],
      refugee: ["refugee", "mkimbizi", "réfugié", "asylum"],
      travel: ["travel", "safari", "voyage", "border", "mpaka", "frontière"]
    };
    
    // Context-aware responses
    const lastUserMessage = prevMessages.filter(m => m.type === "user").pop();
    const isFollowUp = lastUserMessage && (Date.now() - lastUserMessage.timestamp.getTime()) < 60000; // Within 1 minute
    
    // Check for keywords and provide context-aware responses
    if (keywords.passport.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.passport";
      actions = ["apply-passport", "requirements", "fees"];
      setContext(prev => ({ ...prev, lastTopic: "passport" }));
    } else if (keywords.visa.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.visa";
      actions = ["apply-visa", "requirements"];
      setContext(prev => ({ ...prev, lastTopic: "visa" }));
    } else if (keywords.status.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.status";
      actions = ["status"];
      if (context.lastTopic === "passport" || context.lastTopic === "visa") {
        responseKey = `chatbot.response.${context.lastTopic}Status`;
      }
    } else if (keywords.appointment.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.appointment";
      actions = ["appointments"];
    } else if (keywords.document.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.requirements";
      actions = ["requirements", "documents"];
      if (context.lastTopic) {
        responseKey = `chatbot.response.${context.lastTopic}Requirements`;
      }
    } else if (keywords.fee.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.fees";
      actions = ["payments"];
    } else if (keywords.processing.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.processing";
      if (context.lastTopic) {
        responseKey = `chatbot.response.${context.lastTopic}Processing`;
      }
    } else if (keywords.contact.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.contact";
      actions = ["help"];
    } else if (keywords.biometric.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.biometric";
      actions = ["biometric-centers"];
    } else if (keywords.emergency.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.emergency";
      actions = ["contact", "laissez-passer"];
    } else if (keywords.citizenship.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.citizenship";
      actions = ["apply-citizenship"];
    } else if (keywords.refugee.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.refugee";
      actions = ["refugee-services"];
    } else if (keywords.travel.some(kw => lowerInput.includes(kw))) {
      responseKey = "chatbot.response.travel";
      actions = ["border-pass", "cepgl-service"];
    } else if (isFollowUp && (lowerInput.includes("how") || lowerInput.includes("what") || lowerInput.includes("where"))) {
      // Follow-up question about last topic
      if (context.lastTopic) {
        responseKey = `chatbot.response.${context.lastTopic}Details`;
      }
    }
    
    return { response: t(responseKey), actions };
  };

  const handleQuickAction = (action: string) => {
    let responseKey = "";
    let userMessage = "";
    let actions: string[] = [];

    switch (action) {
      case "passport":
        userMessage = t("chatbot.quickAction.passport");
        responseKey = "chatbot.response.passport";
        actions = ["apply-passport", "requirements"];
        break;
      case "visa":
        userMessage = t("chatbot.quickAction.visa");
        responseKey = "chatbot.response.visa";
        actions = ["apply-visa"];
        break;
      case "status":
        userMessage = t("chatbot.quickAction.status");
        responseKey = "chatbot.response.status";
        actions = ["status"];
        break;
      case "appointment":
        userMessage = t("chatbot.quickAction.appointment");
        responseKey = "chatbot.response.appointment";
        actions = ["appointments"];
        break;
      case "requirements":
        userMessage = t("chatbot.quickAction.requirements");
        responseKey = "chatbot.response.requirements";
        actions = ["requirements"];
        break;
      case "fees":
        userMessage = t("chatbot.quickAction.fees");
        responseKey = "chatbot.response.fees";
        actions = ["payments"];
        break;
      case "processing":
        userMessage = t("chatbot.quickAction.processing");
        responseKey = "chatbot.response.processing";
        break;
      case "contact":
        userMessage = t("chatbot.quickAction.contact");
        responseKey = "chatbot.response.contact";
        actions = ["help"];
        break;
      default:
        return;
    }

    addUserMessage(userMessage);
    
    // Simulate typing delay with varying duration
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(t(responseKey), "positive", actions);
    }, 800 + Math.random() * 800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    const currentInput = inputValue;
    setInputValue("");

    // Simulate bot response with AI-like delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const { response, actions } = getEnhancedResponse(currentInput, messages);
      addBotMessage(response, "positive", actions);
      
      // Provide helpful follow-up for negative sentiment
      if (context.userSentiment === "negative") {
        setTimeout(() => {
          addBotMessage(
            t("chatbot.response.assistance", {}, "I notice you might need help. Would you like to speak with a support agent?"),
            "positive",
            ["contact"]
          );
        }, 1500);
      }
    }, 1200 + Math.random() * 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setContext({ messageCount: 0, userSentiment: "neutral" });
    localStorage.removeItem("chatbot-messages");
    localStorage.removeItem("chatbot-context");
    setShowSuggestions(true);
    addBotMessage(t("chatbot.greeting"), undefined, ["passport", "visa", "status"]);
    toast.success(t("chatbot.newChatStarted", {}, "New chat started"));
  };

  const handleExportChat = () => {
    const chatHistory = messages.map(m => 
      `[${m.timestamp.toLocaleString()}] ${m.type.toUpperCase()}: ${m.content}`
    ).join("\n\n");
    
    const blob = new Blob([chatHistory], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(t("chatbot.chatExported", {}, "Chat history exported"));
  };

  const quickActions = [
    { id: "passport", label: t("chatbot.quickAction.passport"), icon: <Bot className="h-3 w-3" /> },
    { id: "visa", label: t("chatbot.quickAction.visa"), icon: <Bot className="h-3 w-3" /> },
    { id: "status", label: t("chatbot.quickAction.status"), icon: <TrendingUp className="h-3 w-3" /> },
    { id: "appointment", label: t("chatbot.quickAction.appointment"), icon: <Bot className="h-3 w-3" /> },
    { id: "requirements", label: t("chatbot.quickAction.requirements"), icon: <Bot className="h-3 w-3" /> },
    { id: "fees", label: t("chatbot.quickAction.fees"), icon: <Bot className="h-3 w-3" /> },
    { id: "processing", label: t("chatbot.quickAction.processing"), icon: <Bot className="h-3 w-3" /> },
    { id: "contact", label: t("chatbot.quickAction.contact"), icon: <Bot className="h-3 w-3" /> },
  ];

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive": return "text-green-500";
      case "negative": return "text-red-500";
      default: return "text-blue-500";
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-[420px] h-[650px] flex flex-col shadow-2xl border-navy-medium/20 dark:border-white/10 overflow-hidden backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-navy-dark via-navy-medium to-blue-medium text-white dark:from-[#1a2a3a] dark:via-[#2a3a4a] dark:to-[#3a4a5a] relative overflow-hidden">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div 
                    className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"
                    animate={{
                      boxShadow: ["0 0 0 0 rgba(255,255,255,0.3)", "0 0 0 10px rgba(255,255,255,0)"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      {t("chatbot.title")}
                      <Badge variant="secondary" className="text-xs bg-white/20">AI</Badge>
                    </h3>
                    <div className="flex items-center gap-1">
                      <motion.span 
                        className="h-2 w-2 rounded-full bg-green-400"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-xs text-white/80">
                        {t("chatbot.online", {}, "Online")} • {messages.filter(m => m.type === "user").length} {t("chatbot.messages", {}, "messages")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleExportChat}
                    className="h-8 w-8 text-white hover:bg-white/10"
                    title={t("chatbot.export", {}, "Export chat")}
                    disabled={messages.length === 0}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNewChat}
                    className="h-8 w-8 text-white hover:bg-white/10"
                    title={t("chatbot.newChat")}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-white hover:bg-white/10"
                    title={t("chatbot.close")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-blue-lightest to-white dark:from-[#121212] dark:to-[#1a1a1a]">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-2 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          message.type === "user" 
                            ? "bg-navy-medium dark:bg-blue-500" 
                            : "bg-gradient-to-br from-blue-500 to-purple-500"
                        }`}>
                          {message.type === "user" ? (
                            <UserIcon className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        
                        {/* Message bubble */}
                        <div className="flex flex-col gap-1">
                          <div
                            className={`rounded-2xl px-4 py-2.5 ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-navy-medium to-blue-medium text-white dark:from-blue-500 dark:to-blue-600"
                                : "bg-white dark:bg-[#1E1E1E] text-navy-dark dark:text-white border border-blue-light/20 dark:border-white/10 shadow-sm"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-xs opacity-60">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {message.confidence && message.confidence > 50 && (
                                <span className={`text-xs ${getSentimentColor(message.sentiment)}`}>
                                  •
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Action chips */}
                          {message.relatedActions && message.relatedActions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {message.relatedActions.map((action) => (
                                <Badge
                                  key={action}
                                  variant="outline"
                                  className="text-xs cursor-pointer hover:bg-blue-medium/10 dark:hover:bg-blue-500/10 transition-colors"
                                >
                                  {t(`chatbot.action.${action}`, {}, action)}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex gap-2 items-end">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-[#1E1E1E] border border-blue-light/20 dark:border-white/10 rounded-2xl px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-1">
                            <motion.span 
                              className="h-2 w-2 rounded-full bg-blue-medium dark:bg-blue-400"
                              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            />
                            <motion.span 
                              className="h-2 w-2 rounded-full bg-blue-medium dark:bg-blue-400"
                              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.span 
                              className="h-2 w-2 rounded-full bg-blue-medium dark:bg-blue-400"
                              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              {showSuggestions && messages.length <= 1 && (
                <motion.div 
                  className="p-4 bg-white dark:bg-[#1E1E1E] border-t border-blue-light/20 dark:border-white/10"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-xs text-navy-medium dark:text-white/60 mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {t("chatbot.quickActions")}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.slice(0, 4).map((action) => (
                      <motion.div
                        key={action.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action.id)}
                          className="text-xs h-auto py-2.5 border-navy-medium/20 dark:border-white/10 hover:bg-blue-light/10 dark:hover:bg-white/5 hover:border-navy-medium dark:hover:border-blue-500 transition-all w-full justify-start gap-2"
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Input */}
              <div className="p-4 bg-white dark:bg-[#1E1E1E] border-t border-blue-light/20 dark:border-white/10">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0 border-blue-light/30 dark:border-white/10 hover:bg-blue-light/10 dark:hover:bg-white/5"
                    title={t("chatbot.voiceInput", {}, "Voice input (coming soon)")}
                    disabled
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t("chatbot.placeholder")}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-blue-light/30 dark:border-white/10 bg-blue-lightest dark:bg-[#121212] text-navy-dark dark:text-white placeholder:text-navy-medium/50 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-navy-medium dark:focus:ring-blue-400 text-sm transition-all"
                  />
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    size="icon"
                    className="flex-shrink-0 bg-gradient-to-r from-navy-medium to-blue-medium hover:from-navy-dark hover:to-navy-medium dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white transition-all disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-navy-medium/50 dark:text-white/30 mt-2 text-center">
                  {t("chatbot.aiPowered", {}, "AI-powered assistance in")} {currentLanguage.toUpperCase()}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className={`h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-navy-medium via-blue-medium to-navy-dark dark:from-blue-500 dark:via-blue-600 dark:to-blue-700 hover:from-navy-dark hover:via-navy-medium hover:to-blue-medium dark:hover:from-blue-600 dark:hover:via-blue-700 dark:hover:to-blue-800 text-white transition-all relative overflow-hidden group`}
          title={isOpen ? t("chatbot.close") : t("chatbot.open")}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Notification indicator */}
          {!isOpen && (
            <motion.span 
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs relative z-10"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <motion.span 
                className="absolute h-full w-full rounded-full bg-red-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="relative">AI</span>
            </motion.span>
          )}
        </Button>
      </motion.div>
    </div>
  );
}