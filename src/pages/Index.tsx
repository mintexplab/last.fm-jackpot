import { motion } from 'framer-motion';
import { LastFmProvider, useLastFm } from '@/contexts/LastFmContext';
import { Header } from '@/components/Header';
import { ConnectForm } from '@/components/ConnectForm';
import { Dashboard } from '@/components/Dashboard';

const IndexContent = () => {
  const { isConnected, isLoading } = useLastFm();

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
        
        {isConnected ? (
          <Dashboard />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <ConnectForm />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-muted-foreground">
        <p>
          Powered by{' '}
          <a
            href="https://www.last.fm/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Last.fm API
          </a>
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
