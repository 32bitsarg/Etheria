'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { client, databases, APPWRITE_CONFIG } from '@/lib/appwrite';
import { ID, Query, Models } from 'appwrite';

export interface ChatMessage {
    $id: string;
    userId: string;
    username: string;
    message: string;
    timestamp: string;
    $createdAt: string;
    channel?: string;
    channelId?: string;
}

interface UseGlobalChatReturn {
    messages: ChatMessage[];
    sendMessage: (message: string) => Promise<void>;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
}

export function useGlobalChat(userId: string, username: string, channel: string = 'global', channelId: string = 'main'): UseGlobalChatReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                const queries = [
                    Query.orderDesc('$createdAt'),
                    Query.limit(50),
                    Query.equal('channel', channel)
                ];

                if (channelId) {
                    queries.push(Query.equal('channelId', channelId));
                }

                const response = await databases.listDocuments(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.collections.chatMessages,
                    queries
                );

                // Reverse to show oldest first
                setMessages(response.documents.reverse() as unknown as ChatMessage[]);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching messages:', err);
                // Allow fallback if collection attributes don't exist yet for seamless transition
                if (err.code === 400 && channel === 'global') {
                    // Try fetching without filters for legacy support
                    try {
                        const response = await databases.listDocuments(
                            APPWRITE_CONFIG.databaseId,
                            APPWRITE_CONFIG.collections.chatMessages,
                            [Query.orderDesc('$createdAt'), Query.limit(50)]
                        );
                        setMessages(response.documents.reverse() as unknown as ChatMessage[]);
                        setError(null);
                    } catch (e) { /* ignore */ }
                } else {
                    setError(err.message || 'Error al cargar mensajes');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [channel, channelId]);

    // Subscribe to realtime updates
    useEffect(() => {
        const subChannel = `databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.collections.chatMessages}.documents`;

        try {
            unsubscribeRef.current = client.subscribe(subChannel, (response) => {
                const eventType = response.events[0];
                const payload = response.payload as ChatMessage;

                // Filter messages for current channel
                const msgChannel = payload.channel || 'global';
                const msgChannelId = payload.channelId || 'main'; // Legacy messages default to global/main

                if (msgChannel !== channel) return;
                if (channel !== 'global' && msgChannelId !== channelId) return;

                if (eventType.includes('.create')) {
                    setMessages(prev => [...prev, payload]);
                } else if (eventType.includes('.delete')) {
                    setMessages(prev => prev.filter(msg => msg.$id !== payload.$id));
                }
            });

            setIsConnected(true);
        } catch (err: any) {
            console.error('Error subscribing to realtime:', err);
            setError(err.message || 'Error de conexión en tiempo real');
            setIsConnected(false);
        }

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, []);

    // Send message function
    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim()) return;

        try {
            await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.chatMessages,
                ID.unique(),
                {
                    userId,
                    username,
                    message: message.trim(),
                    timestamp: new Date().toISOString(),
                    channel,
                    channelId
                }
            );
        } catch (err: any) {
            console.error('Error sending message:', err);
            setError(err.message || 'Error al enviar mensaje');
            throw err;
        }
    }, [userId, username, channel, channelId]);

    return {
        messages,
        sendMessage,
        isConnected,
        isLoading,
        error
    };
}
