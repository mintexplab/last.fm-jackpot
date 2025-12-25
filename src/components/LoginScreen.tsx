import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLastFm } from '@/contexts/LastFmContext';

export const LoginScreen = () => {
  const { login, isLoading, error } = useLastFm();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-12 max-w-2xl"
      >
        {/* Minimal dot loader like jackpotmusik */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.div>

        <div className="space-y-6">
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Last.fm Breakdown
          </h1>
          <p className="text-muted-foreground text-lg font-light max-w-md mx-auto">
            Connect your Last.fm account to visualize your listening patterns
          </p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary text-sm"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={login}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-light tracking-wide"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                Login with Last.fm
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
