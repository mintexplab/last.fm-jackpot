import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';

export const GenreCloud = () => {
  const { data } = useLastFm();
  const genres = data.genreBreakdown.slice(0, 12);

  if (genres.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="border border-border/30 p-6"
    >
      <h2 className="font-display text-lg font-medium text-foreground mb-6">Genres</h2>

      <div className="flex flex-wrap gap-2">
        {genres.map((genre, index) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.03 * index }}
            className="px-3 py-1.5 border border-border/50 text-xs font-light capitalize text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-default"
          >
            {genre.name}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
