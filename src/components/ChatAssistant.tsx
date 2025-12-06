'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import clsx from 'clsx'
import Link from 'next/link'

type Message = {
    role: 'user' | 'assistant'
    content: string
}

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Merhaba! Ben TeknoAsistan. Kulübümüz hakkında merak ettiğiniz her şeyi bana sorabilirsiniz.' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const chatRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen &&
                chatRef.current &&
                !chatRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')

        // Add User Message
        const newMessages = [...messages, { role: 'user', content: userMessage } as Message]
        setMessages(newMessages)
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: newMessages.slice(-6) // Send last 6 messages context
                })
            })

            const data = await response.json()

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' }])
            }
        } catch (error) {
            console.error('Chat Error:', error)
            setMessages(prev => [...prev, { role: 'assistant', content: 'Bağlantı hatası oluştu.' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
                    isOpen ? "bg-gray-800 text-white" : "bg-red-600 text-white hover:bg-red-700"
                )}
                aria-label="Toggle Chat Assistant"
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
            </button>

            {/* Chat Window */}
            <div
                ref={chatRef}
                className={clsx(
                    "fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">TeknoAsistan</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span className="text-red-100 text-xs font-medium">Çevrimiçi</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={clsx("flex items-start gap-2.5", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                msg.role === 'user' ? "bg-gray-200 dark:bg-gray-700" : "bg-red-100 dark:bg-red-900/30"
                            )}>
                                {msg.role === 'user' ? <User className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Bot className="w-5 h-5 text-red-600 dark:text-red-400" />}
                            </div>

                            <div className={clsx(
                                "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                msg.role === 'user'
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700"
                            )}>
                                {msg.role === 'assistant' ? (
                                    <>
                                        {msg.content.split(/(\[BUTTON:.*?\]|\[ACTION:MEMBERS\])/g).map((part, i) => {
                                            if (part === '[ACTION:MEMBERS]') {
                                                return (
                                                    <Link key={i} href="/members" className="mt-3 inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full transition-colors shadow-sm">
                                                        Üyeleri Görüntüle
                                                    </Link>
                                                )
                                            }

                                            // Robust Button Parser
                                            if (part.startsWith('[BUTTON:') && part.endsWith(']')) {
                                                const inner = part.slice(8, -1); // Remove [BUTTON: and ]
                                                // Try pipe first (new format), then colon (fallback for old format/AI stubbornness)
                                                let separatorIdx = inner.lastIndexOf('|');
                                                if (separatorIdx === -1) {
                                                    // Fallback to last colon. 
                                                    // Note: This is safe for URLs because the label is at the end. 
                                                    // "https://google.com:Click Me" -> Last colon is before Click Me.
                                                    separatorIdx = inner.lastIndexOf(':');
                                                }

                                                if (separatorIdx !== -1) {
                                                    const url = inner.substring(0, separatorIdx).trim();
                                                    const label = inner.substring(separatorIdx + 1).trim();
                                                    const isExternal = url.startsWith('http');

                                                    return (
                                                        <Link
                                                            key={i}
                                                            href={url}
                                                            target={isExternal ? "_blank" : undefined}
                                                            rel={isExternal ? "noopener noreferrer" : undefined}
                                                            className="mt-3 mb-1 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm w-full justify-center"
                                                        >
                                                            {label}
                                                        </Link>
                                                    );
                                                }
                                            }

                                            // Regular text
                                            if (!part) return null;
                                            return <span key={i} className="whitespace-pre-wrap">{part}</span>;
                                        })}
                                    </>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Bir soru sorun..."
                            className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full border-none focus:ring-2 focus:ring-red-500 placeholder-gray-500 text-sm shadow-inner transition-shadow"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className={clsx(
                                "absolute right-2 p-2 rounded-full transition-all duration-200",
                                input.trim() && !isLoading ? "bg-red-600 text-white hover:bg-red-700 shadow-md transform hover:scale-105" : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">TeknoAsistan site verilerini kullanarak cevap verir.</p>
                    </div>
                </form>
            </div>
        </>
    )
}
