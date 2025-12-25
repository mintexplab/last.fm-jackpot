import { motion } from 'framer-motion';
import { LastFmProvider, useLastFm } from '@/contexts/LastFmContext';
import { Header } from '@/components/Header';
import { LoginScreen } from '@/components/LoginScreen';
import { Dashboard } from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';

const IndexContent = () => {
  const { isAuthenticated, isLoading, user } = useLastFm();

  // Show loader while checking auth state
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 pb-16">
        <Header />
        
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <LoginScreen />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          © 2025 Jackpot Music Entertainment / XZ1 Recording Ventures
        </p>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <LastFmProvider>
      <IndexContent />
    </LastFmProvider>
  );
};

export default Index;
