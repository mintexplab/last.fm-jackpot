import { motion } from 'framer-motion';
import { Music, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLastFm } from '@/contexts/LastFmContext';

export const LoginScreen = () => {
  const { login, isLoading, error } = useLastFm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card p-8 space-y-6">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 0 40px hsla(45, 90%, 55%, 0.4)' }}
          >
            <Music className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-foreground">Connect to Last.fm</h2>
          <p className="text-muted-foreground text-sm">
            Authorize with your Last.fm account to see your personalized music breakdown
          </p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg"
          >
            {error}
          </motion.p>
        )}

        <Button
          onClick={login}
          disabled={isLoading}
          variant="gradient"
          size="xl"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Music className="w-5 h-5" />
              Login with Last.fm
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You'll be redirected to Last.fm to authorize access to your listening data
        </p>
      </div>
    </motion.div>
  );
};
