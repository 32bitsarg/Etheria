import { useState, useEffect, useCallback } from 'react';

export function useNotifications(playerId: string | undefined) {
    const [unreadReports, setUnreadReports] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const fetchCounts = useCallback(async () => {
        if (!playerId) return;
        try {
            const res = await fetch('/api/v1/player/notifications/count');
            const data = await res.json();
            if (data.success) {
                setUnreadReports(data.unreadReports);
                setUnreadMessages(data.unreadMessages);
            }
        } catch (error) {
            console.error('Error fetching notification counts:', error);
        }
    }, [playerId]);

    useEffect(() => {
        fetchCounts();
        // Polling cada 30 segundos para actualizaciones automáticas
        const interval = setInterval(fetchCounts, 30000);
        return () => clearInterval(interval);
    }, [fetchCounts]);

    return {
        unreadReports,
        unreadMessages,
        refreshNotifications: fetchCounts
    };
}
