import { motion } from 'framer-motion';
import { Users, Music, ExternalLink } from 'lucide-react';
import { useLastFm } from '@/contexts/LastFmContext';

export const SimilarArtists = () => {
  const { data } = useLastFm();
  const { similarArtists, topArtists } = data;

  if (similarArtists.length === 0 || topArtists.length === 0) return null;

  const topArtist = topArtists[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground">Artists Like</h2>
      </div>
      <p className="text-muted-foreground text-sm mb-6">
        Based on your love for <span className="text-primary font-medium">{topArtist.name}</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {similarArtists.slice(0, 8).map((artist, index) => (
          <motion.div
            key={artist.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="group text-center"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-2 transition-transform duration-300 group-hover:scale-105 relative">
              {artist.image ? (
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                <span className="text-xs text-foreground font-medium">
                  {Math.round(artist.match)}% match
                </span>
              </div>
            </div>
            <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {artist.name}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
