import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';
import { getImage } from '@/lib/lastfm';

export const TopAlbums = () => {
  const { data } = useLastFm();
  const albums = data.topAlbums.slice(0, 8);

  if (albums.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="border border-border/30 p-6"
    >
      <h2 className="font-display text-lg font-medium text-foreground mb-6">Top Albums</h2>

      <div className="grid grid-cols-4 gap-3">
        {albums.map((album, index) => {
          const image = getImage(album.image, 'large');

          return (
            <motion.a
              key={`${album.name}-${album.artist.name}`}
              href={album.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 * index }}
              className="group"
            >
              <div className="aspect-square overflow-hidden bg-muted mb-2">
                {image ? (
                  <img
                    src={image}
                    alt={album.name}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>

              <p className="text-xs text-foreground truncate group-hover:text-primary transition-colors font-light">
                {album.name}
              </p>
              <p className="text-xs text-muted-foreground truncate font-light">
                {album.artist.name}
              </p>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};
