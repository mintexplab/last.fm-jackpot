import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';
import { getImage } from '@/lib/lastfm';

export const TopTracks = () => {
  const { data } = useLastFm();
  const tracks = data.topTracks.slice(0, 10);

  if (tracks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="border border-border/30 p-6"
    >
      <h2 className="font-display text-lg font-medium text-foreground mb-6">Top Tracks</h2>

      <div className="space-y-4">
        {tracks.map((track, index) => {
          const image = getImage(track.image, 'medium');
          const playcount = parseInt(track.playcount);

          return (
            <motion.a
              key={`${track.name}-${track.artist.name}`}
              href={track.url}
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
                  <img src={image} alt={track.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors font-light">
                  {track.name}
                </p>
                <p className="text-xs text-muted-foreground truncate font-light">
                  {track.artist.name}
                </p>
              </div>

              <span className="text-xs text-muted-foreground font-light">
                {playcount.toLocaleString()}
              </span>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};
