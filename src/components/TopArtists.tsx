import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';
import { getImage } from '@/lib/lastfm';

export const TopArtists = () => {
  const { data } = useLastFm();
  const artists = data.topArtists.slice(0, 10);

  if (artists.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="border border-border/30 p-6"
    >
      <h2 className="font-display text-lg font-medium text-foreground mb-6">Top Artists</h2>

      <div className="space-y-4">
        {artists.map((artist, index) => {
          const image = getImage(artist.image, 'medium');
          const playcount = parseInt(artist.playcount).toLocaleString();

          return (
            <motion.a
              key={artist.name}
              href={artist.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.03 * index }}
              className="flex items-center gap-4 group"
            >
              <span className="text-xs text-muted-foreground w-5 font-light">{index + 1}</span>
              
              <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                {image ? (
                  <img src={image} alt={artist.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors font-light">
                  {artist.name}
                </p>
              </div>

              <span className="text-xs text-muted-foreground font-light">{playcount}</span>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};
