import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui/ToastContext';
import { VolumeProvider } from '@/hooks/useVolume';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <VolumeProvider>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </VolumeProvider>
    );
}
