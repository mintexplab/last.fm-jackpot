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
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 pb-16">
        {isAuthenticated && <Header />}
        
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <LoginScreen />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-border/30">
        <p className="text-xs text-muted-foreground font-light tracking-wide">
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
