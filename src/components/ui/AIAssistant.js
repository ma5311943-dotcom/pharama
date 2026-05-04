"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const SYSTEM_PROMPT = `You are PharmaEase AI, a knowledgeable and friendly pharmacy assistant.
You help users with:
- Medicine information (uses, dosage, side effects, interactions)
- Searching for specific medicines by name or symptom
- Order tracking and delivery queries
- General health advice and when to see a doctor
Always be concise, accurate, and remind users to consult a licensed pharmacist for medical decisions.
If asked about a medicine, provide: name, what it's used for, typical dosage, and key precautions.`;

async function askGrok(conversationHistory) {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversationHistory,
        ],
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.text || null;
  } catch {
    return null;
  }
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: "Hi! I'm PharmaEase AI 💊 Ask me about any medicine or health question!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMessage = { id: Date.now(), role: 'user', text: userText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const history = messages
      .slice(1)
      .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));
    history.push({ role: 'user', content: userText });

    const aiText = await askGrok(history);
    let aiResponse = aiText;

    if (!aiResponse) {
      const lowerInput = userText.toLowerCase();
      if (lowerInput.includes('brufen') || lowerInput.includes('pain')) {
        aiResponse = "Brufen (Ibuprofen) is a nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain from various conditions such as headache, dental pain, and muscle aches. The typical adult dose is 400mg every 4-6 hours. Take with food to prevent stomach upset. Should I add it to your cart?";
      } else if (lowerInput.includes('panadol') || lowerInput.includes('fever')) {
        aiResponse = "For fever and mild pain, Panadol (Paracetamol) is highly effective. Adults can take 500mg-1000mg every 4-6 hours (max 4000mg/day). Drink plenty of fluids and rest. Please consult a doctor if your fever lasts more than 3 days.";
      } else if (lowerInput.includes('order') || lowerInput.includes('track')) {
        aiResponse = "I can help with that! You can navigate to your Profile > Orders to see live GPS tracking details for all your recent purchases.";
      } else if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
        aiResponse = "Hello! Welcome to the PharmaEase Premium experience. How can I assist you with your health today?";
      } else if (lowerInput.includes('allergy') || lowerInput.includes('sneeze')) {
        aiResponse = "For seasonal allergies, I recommend non-drowsy antihistamines like Loratadine (Claritin) or Cetirizine (Zyrtec). They provide 24-hour relief from sneezing and runny nose.";
      } else {
        aiResponse = "I'm currently operating in offline mode. In the full production version, I analyze real-time drug interactions, diagnose mild symptoms, and track your health. What else would you like to explore?";
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, role: 'assistant', text: aiResponse },
    ]);
    setIsTyping(false);
  };

  const suggestions = ['Brufen side effects', 'Panadol dosage', 'Track my order', 'Fever medicine'];

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="mb-3 w-[370px] h-[480px] lg:w-[440px] lg:h-[500px] bg-bg-card/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-border-nav/60 flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 bg-primary text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-bg-card/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-tight leading-none">PharmaEase AI</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">AI · Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-bg-card/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex w-full gap-2',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                    msg.role === 'user' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                  )}>
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div className={cn(
                    'max-w-[80%] px-3 py-2 rounded-2xl text-[12px] font-medium leading-relaxed whitespace-pre-wrap break-words',
                    msg.role === 'user'
                      ? 'bg-secondary text-white rounded-tr-none'
                      : 'bg-bg-page text-text-heading rounded-tl-none border border-border-nav shadow-sm'
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="bg-bg-page px-3 py-2 rounded-2xl flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-border-nav">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="px-2.5 py-1 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-bold text-primary hover:bg-primary hover:text-white transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} className="px-3 pb-3 pt-2 bg-bg-card">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow bg-bg-page border border-border-nav rounded-xl px-3 py-2.5 text-[12px]"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="bg-bg-card/90 backdrop-blur-md border border-primary/20 px-4 py-2 rounded-2xl shadow-xl hidden sm:block"
            >
              <p className="text-[11px] font-medium font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Ask AI Assistant
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-[52px] h-[52px] rounded-2xl flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300',
            isOpen ? 'bg-bg-card text-primary border border-border-nav' : 'bg-primary text-white'
          )}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>
    </div>
  );
};

export default AIAssistant;