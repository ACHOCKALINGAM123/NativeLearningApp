import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, X } from "lucide-react";

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm here to help you find the perfect teacher or answer any questions about our platform. What are you looking for?",
      isBot: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "I understand you're looking for help. While this is a demo chatbot, in the full version I'd help you find teachers, answer questions about pricing, explain our booking process, and assist with any technical issues. Is there anything specific about our platform you'd like to know?",
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg bg-primary-600 hover:bg-primary-700"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 shadow-2xl">
          <CardHeader className="bg-primary-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">SkillShare Assistant</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-primary-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm opacity-90">How can I help you today?</p>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.isBot
                      ? "bg-gray-100 rounded-lg p-3"
                      : "bg-primary-100 rounded-lg p-3 ml-8"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              ))}
            </div>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
