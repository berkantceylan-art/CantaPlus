"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, User, Bot, X, Sparkles } from "lucide-react"

export function NexusChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', content: 'Omni-Nexus Destek Merkezine hoş geldiniz. Bugün size nasıl yardımcı olabilirim?', time: 'Şimdi' }
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { id: Date.now(), role: 'user', content: input, time: 'Şimdi' }])
    setInput('')
    
    // Simüle edilmiş cevap
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'bot', 
        content: 'Talebiniz alındı. Nexus AI şu an verileri analiz ediyor...', 
        time: 'Şimdi' 
      }])
    }, 1000)
  }

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-2xl bg-primary text-zinc-950 flex items-center justify-center shadow-[0_20px_50px_rgba(255,191,0,0.3)] z-50 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <MessageSquare className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-8 w-[380px] h-[580px] luxury-glass border border-white/10 rounded-[32px] overflow-hidden z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                     <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                     <h3 className="text-sm font-black uppercase tracking-widest text-luxury">Nexus Support</h3>
                     <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Analist Çevrimiçi</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <X className="h-4 w-4 text-zinc-500" />
               </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                       <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-primary/20 border border-primary/20'}`}>
                          {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                       </div>
                       <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-100' : 'bg-white/5 text-zinc-300'}`}>
                          {msg.content}
                          <div className="text-[8px] opacity-30 mt-2 uppercase font-black tracking-widest">{msg.time}</div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-zinc-900/50 border-top border-white/5">
               <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Mesajınızı yazın..."
                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-5 py-4 text-xs focus:ring-1 focus:ring-primary/30 outline-none transition-all placeholder:text-zinc-700"
                  />
                  <button 
                    onClick={sendMessage}
                    className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary text-zinc-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
