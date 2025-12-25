import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';
import { getImage } from '@/lib/lastfm';

export const RecentTracks = () => {
  const { data } = useLastFm();
  const tracks = data.recentTracks.slice(0, 10);

  if (tracks.length === 0) return null;

  const formatTime = (uts: string) => {
    const date = new Date(parseInt(uts) * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(diff / 86400000)}d`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="border border-border/30 p-6"
    >
      <h2 className="font-display text-lg font-medium text-foreground mb-6">Recent</h2>

      <div className="space-y-4">
        {tracks.map((track, index) => {
          const image = getImage(track.image, 'small');
          const isNowPlaying = track['@attr']?.nowplaying === 'true';

          return (
            <motion.a
              key={`${track.name}-${index}`}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.03 * index }}
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded overflow-hidden bg-muted flex-shrink-0 relative">
                {image ? (
                  <img src={image} alt={track.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                {isNowPlaying && (
                  <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors font-light">
                  {track.name}
                </p>
                <p className="text-xs text-muted-foreground truncate font-light">
                  {track.artist['#text']}
                </p>
              </div>

              <span className="text-xs text-muted-foreground font-light">
                {isNowPlaying ? (
                  <span className="text-primary">●</span>
                ) : track.date ? (
                  formatTime(track.date.uts)
                ) : null}
              </span>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};
