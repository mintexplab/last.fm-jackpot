import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-8 md:py-12"
    >
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl md:text-2xl font-medium tracking-tight text-foreground">
          Last.fm Breakdown
        </h1>
        
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
          ))}
        </div>
      </div>
    </motion.header>
  );
};
