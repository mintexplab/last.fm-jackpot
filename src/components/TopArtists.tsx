import { motion } from 'framer-motion';
import { ExternalLink, Music } from 'lucide-react';
import { useLastFm } from '@/contexts/LastFmContext';
import { getImage } from '@/lib/lastfm';

export const TopArtists = () => {
  const { data } = useLastFm();
  const artists = data.topArtists.slice(0, 12);

  if (artists.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Top Artists</h2>
        <span className="text-sm text-muted-foreground">All Time</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {artists.map((artist, index) => {
          const image = getImage(artist.image, 'extralarge');
          const playcount = parseInt(artist.playcount).toLocaleString();

          return (
            <motion.a
              key={artist.name}
              href={artist.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="group relative"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-2 transition-transform duration-300 group-hover:scale-105">
                {image ? (
                  <img
                    src={image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Music className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <ExternalLink className="w-4 h-4 text-foreground" />
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {artist.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {playcount} plays
                </p>
              </div>

              {index < 3 && (
                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' :
                  'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100'
                }`}>
                  {index + 1}
                </div>
              )}
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};
