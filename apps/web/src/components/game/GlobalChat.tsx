'use client';

import { useState, useRef, useEffect } from 'react';
import { useGlobalChat, ChatMessage } from '@/hooks/useGlobalChat';
import { useAuth } from '@/hooks/useAuth';
import styles from './GlobalChat.module.css';

interface GlobalChatProps {
    userId: string;
    username: string;
}

type ChatTab = 'global' | 'alliance';

export function GlobalChat({ userId, username }: GlobalChatProps) {
    const { player } = useAuth();
    const [activeTab, setActiveTab] = useState<ChatTab>('global');
    const [isMinimized, setIsMinimized] = useState(false);

    const allianceId = player?.alliance?.allianceId;
    const channel = activeTab;
    const channelId = activeTab === 'alliance' && allianceId ? allianceId : 'main';

    const { messages, sendMessage, isConnected, isLoading, error } = useGlobalChat(
        userId,
        username,
        channel,
        channelId
    );

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (!isMinimized && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isMinimized, activeTab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        try {
            await sendMessage(inputValue);
            setInputValue('');
        } catch (err) {
            // Error is handled in the hook
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const toggleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMinimized(!isMinimized);
    };

    return (
        <div className={`${styles.chatContainer} ${isMinimized ? styles.minimized : ''}`}>
            {/* Header */}
            <div className={styles.chatHeader} onClick={() => setIsMinimized(false)}>
                <div className={styles.headerLeft}>
                    <span className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`} />
                    <span className={styles.headerTitle}>
                        {activeTab === 'global' ? '🌍 Chat Global' : '🛡️ Alianza'}
                    </span>
                </div>
                <button className={styles.minimizeBtn} onClick={toggleMinimize}>
                    {isMinimized ? '▲' : '▼'}
                </button>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
                <>
                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'global' ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab('global')}
                        >
                            🌍 Global
                        </button>
                        {player?.alliance && (
                            <button
                                className={`${styles.tabBtn} ${activeTab === 'alliance' ? styles.tabBtnActive : ''}`}
                                onClick={() => setActiveTab('alliance')}
                            >
                                🛡️ Alianza
                            </button>
                        )}
                    </div>

                    <div className={styles.messagesContainer}>
                        {isLoading ? (
                            <div className={styles.loadingState}>
                                <span className={styles.spinner} />
                                Cargando...
                            </div>
                        ) : error ? (
                            <div className={styles.errorState}>
                                <span>⚠️</span>
                                <p>{error}</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className={styles.emptyState}>
                                <span>
                                    {activeTab === 'global' ? '🌍' : '🛡️'}
                                </span>
                                <p>
                                    {activeTab === 'global'
                                        ? '¡Sé el primero en escribir!'
                                        : 'Chat de Alianza vacío'}
                                </p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.$id}
                                    className={`${styles.message} ${msg.userId === userId ? styles.ownMessage : ''}`}
                                >
                                    <div className={styles.messageHeader}>
                                        <span className={styles.messageAuthor}>{msg.username}</span>
                                        <span className={styles.messageTime}>{formatTime(msg.$createdAt || msg.timestamp)}</span>
                                    </div>
                                    <p className={styles.messageContent}>{msg.message}</p>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form className={styles.inputContainer} onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={activeTab === 'alliance' ? "Mensaje a la alianza..." : "Mensaje global..."}
                            className={styles.chatInput}
                            maxLength={500}
                            disabled={!!error}
                        />
                        <button
                            type="submit"
                            className={styles.sendBtn}
                            disabled={!inputValue.trim() || !!error}
                        >
                            ➤
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
