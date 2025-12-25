import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';

export const SimilarArtists = () => {
  const { data } = useLastFm();
  const { similarArtists, topArtists } = data;

  if (similarArtists.length === 0 || topArtists.length === 0) return null;

  const topArtist = topArtists[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="border border-border/30 p-6"
    >
      <h2 className="font-display text-lg font-medium text-foreground mb-1">Similar to {topArtist.name}</h2>
      <p className="text-xs text-muted-foreground font-light mb-6">Artists you might like</p>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {similarArtists.slice(0, 8).map((artist, index) => (
          <motion.div
            key={artist.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 * index }}
            className="group text-center"
          >
            <div className="aspect-square overflow-hidden bg-muted mb-2">
              {artist.image ? (
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
            <p className="text-xs text-foreground truncate group-hover:text-primary transition-colors font-light">
              {artist.name}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
