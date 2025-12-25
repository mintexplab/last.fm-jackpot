import { motion } from 'framer-motion';
import { Clock, Disc3, ExternalLink } from 'lucide-react';
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
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-secondary" />
        <h2 className="font-display text-2xl font-bold text-foreground">Recent Scrobbles</h2>
      </div>

      <div className="space-y-2">
        {tracks.map((track, index) => {
          const image = getImage(track.image, 'small');
          const isNowPlaying = track['@attr']?.nowplaying === 'true';

          return (
            <motion.a
              key={`${track.name}-${index}`}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {image ? (
                  <img src={image} alt={track.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Disc3 className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                {isNowPlaying && (
                  <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {track.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artist['#text']} • {track.album['#text']}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isNowPlaying ? (
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    Now
                  </span>
                ) : track.date ? (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(track.date.uts)}
                  </span>
                ) : null}
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};
