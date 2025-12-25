import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { useLastFm } from '@/contexts/LastFmContext';

export const GenreCloud = () => {
  const { data } = useLastFm();
  const genres = data.genreBreakdown.slice(0, 12);

  if (genres.length === 0) return null;

  const maxCount = genres[0]?.count || 1;

  const colors = [
    'from-primary to-primary/60',
    'from-secondary to-secondary/60',
    'from-accent to-accent/60',
    'from-primary/80 to-secondary/80',
    'from-secondary/80 to-accent/80',
    'from-accent/80 to-primary/80',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Tag className="w-5 h-5 text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground">Genre Breakdown</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {genres.map((genre, index) => {
          const size = 0.7 + (genre.count / maxCount) * 0.5;
          const colorClass = colors[index % colors.length];

          return (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className={`px-4 py-2 rounded-full bg-gradient-to-r ${colorClass} shadow-lg transition-transform hover:scale-105`}
              style={{ fontSize: `${size}rem` }}
            >
              <span className="text-primary-foreground font-medium capitalize whitespace-nowrap">
                {genre.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
