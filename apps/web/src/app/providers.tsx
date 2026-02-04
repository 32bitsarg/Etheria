import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui/ToastContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}
