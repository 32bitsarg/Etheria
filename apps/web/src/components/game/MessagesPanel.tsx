'use client';

import React, { useState, useEffect } from 'react';
import styles from './MessagesPanel.module.css';

interface Message {
    id: string;
    subject: string;
    content: string;
    senderId: string;
    recipientId: string;
    read: boolean;
    createdAt: string;
    sender: { user: { username: string } };
    recipient: { user: { username: string } };
}

interface MessagesPanelProps {
    playerId: string;
    onClose: () => void;
}

type View = 'inbox' | 'sent' | 'write' | 'detail';

export function MessagesPanel({ playerId, onClose }: MessagesPanelProps) {
    const [view, setView] = useState<View>('inbox');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);

    const fetchMessages = async (folder: 'inbox' | 'sent') => {
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/messages?folder=${folder}`);
            const data = await res.json();
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'inbox' || view === 'sent') {
            fetchMessages(view);
        }
    }, [view, playerId]);

    const handleRead = async (message: Message) => {
        setSelectedMessage(message);
        setView('detail');

        if (!message.read && message.recipientId === playerId) {
            try {
                await fetch(`/api/v1/messages/${message.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ read: true })
                });
                // Update local state
                setMessages(prev => prev.map(m => m.id === message.id ? { ...m, read: true } : m));
            } catch (err) {
                console.error('Error marking as read:', err);
            }
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('¿Estás seguro de que quieres borrar este mensaje?')) return;

        try {
            const res = await fetch(`/api/v1/messages/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
                if (selectedMessage?.id === id) {
                    setView('inbox');
                }
            }
        } catch (err) {
            console.error('Error deleting message:', err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError(null);

        try {
            const res = await fetch('/api/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientName: to,
                    subject,
                    content
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar mensaje');

            alert('Mensaje enviado con éxito');
            setTo('');
            setSubject('');
            setContent('');
            setView('inbox');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    const handleReply = () => {
        if (!selectedMessage) return;
        setTo(selectedMessage.sender.user.username);
        setSubject(`Re: ${selectedMessage.subject}`);
        setView('write');
    };

    return (
        <div className={styles.overlay} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.panel}>
                <div className={styles.header}>
                    <h2>Correo Imperial</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${view === 'inbox' ? styles.tabActive : ''}`}
                        onClick={() => setView('inbox')}
                    >
                        Recibidos
                    </button>
                    <button
                        className={`${styles.tab} ${view === 'sent' ? styles.tabActive : ''}`}
                        onClick={() => setView('sent')}
                    >
                        Enviados
                    </button>
                    <button
                        className={`${styles.tab} ${view === 'write' ? styles.tabActive : ''}`}
                        onClick={() => setView('write')}
                    >
                        Escribir
                    </button>
                </div>

                <div className={styles.content}>
                    {view === 'write' ? (
                        <form className={styles.form} onSubmit={handleSend}>
                            {error && <div className={styles.error}>{error}</div>}
                            <div className={styles.inputGroup}>
                                <label>Destinatario</label>
                                <input
                                    className={styles.input}
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="Nombre del jugador..."
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Asunto</label>
                                <input
                                    className={styles.input}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Asunto del mensaje"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Mensaje</label>
                                <textarea
                                    className={`${styles.input} ${styles.textarea}`}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Escribe tu mensaje aquí..."
                                    required
                                />
                            </div>
                            <button className={styles.submitBtn} disabled={sending}>
                                {sending ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </form>
                    ) : view === 'detail' && selectedMessage ? (
                        <div className={styles.detailView}>
                            <button className={styles.backBtn} onClick={() => setView('inbox')}>
                                ← Volver
                            </button>
                            <div className={styles.detailHeader}>
                                <h3 className={styles.detailSubject}>{selectedMessage.subject}</h3>
                                <div className={styles.detailMeta}>
                                    <span>De: <strong>{selectedMessage.sender.user.username}</strong></span>
                                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className={styles.detailContent}>
                                {selectedMessage.content}
                            </div>
                            {selectedMessage.senderId !== playerId && (
                                <div className={styles.replyArea}>
                                    <button className={styles.replyBtn} onClick={handleReply}>Responder</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.messageList}>
                            {loading ? (
                                <p>Cargando mensajes...</p>
                            ) : messages.length === 0 ? (
                                <p>No hay mensajes en esta carpeta.</p>
                            ) : (
                                messages.map(m => (
                                    <div
                                        key={m.id}
                                        className={`${styles.messageItem} ${!m.read && m.recipientId === playerId ? styles.unread : ''}`}
                                        onClick={() => handleRead(m)}
                                    >
                                        <div className={styles.senderName}>
                                            {m.senderId === playerId ? `Para: ${m.recipient.user.username}` : m.sender.user.username}
                                        </div>
                                        <div className={styles.subject}>{m.subject}</div>
                                        <div className={styles.date}>{new Date(m.createdAt).toLocaleDateString()}</div>
                                        <button className={styles.deleteBtn} onClick={(e) => handleDelete(e, m.id)}>
                                            🗑️
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
