import { motion } from 'framer-motion';
import { Disc, ExternalLink } from 'lucide-react';
import { useLastFm } from '@/contexts/LastFmContext';
import { getImage } from '@/lib/lastfm';

export const TopAlbums = () => {
  const { data } = useLastFm();
  const albums = data.topAlbums.slice(0, 8);

  if (albums.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Disc className="w-5 h-5 text-accent" />
        <h2 className="font-display text-2xl font-bold text-foreground">Top Albums</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {albums.map((album, index) => {
          const image = getImage(album.image, 'extralarge');
          const playcount = parseInt(album.playcount).toLocaleString();

          return (
            <motion.a
              key={`${album.name}-${album.artist.name}`}
              href={album.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * index }}
              className="group"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-2 transition-transform duration-300 group-hover:scale-105 relative shadow-lg">
                {image ? (
                  <img
                    src={image}
                    alt={album.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                    <Disc className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <ExternalLink className="w-4 h-4 text-foreground" />
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {album.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {album.artist.name}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {playcount} plays
                </p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};
