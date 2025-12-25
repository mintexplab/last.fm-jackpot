import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Key, User, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLastFm } from '@/contexts/LastFmContext';

export const ConnectForm = () => {
  const { apiKey, username, setApiKey, setUsername, connect, isLoading, error } = useLastFm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <Music className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-foreground">Connect to Last.fm</h2>
          <p className="text-muted-foreground text-sm">Enter your credentials to analyze your listening history</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              API Key
            </label>
            <Input
              type="password"
              placeholder="Your Last.fm API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-muted/50 border-border focus:border-primary transition-colors"
            />
            <a
              href="https://www.last.fm/api/account/create"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              Get an API key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-secondary" />
              Username
            </label>
            <Input
              type="text"
              placeholder="Your Last.fm username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-muted/50 border-border focus:border-primary transition-colors"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-destructive text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            onClick={connect}
            disabled={isLoading || !apiKey || !username}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze My Music
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
