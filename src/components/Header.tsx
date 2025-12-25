import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8 md:py-12"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-6"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Your Music Journey</span>
      </motion.div>
      
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
        <span className="gradient-text">Jackpot Music</span>
        <br />
        <span className="text-foreground">LFM Breakdown</span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Deep dive into your Last.fm scrobbles. Discover patterns, explore your taste, and celebrate your musical journey.
      </p>
    </motion.header>
  );
};
