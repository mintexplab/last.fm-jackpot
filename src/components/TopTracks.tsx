import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { useLastFm } from '@/contexts/LastFmContext';
import { getImage } from '@/lib/lastfm';

export const TopTracks = () => {
  const { data } = useLastFm();
  const tracks = data.topTracks.slice(0, 10);

  if (tracks.length === 0) return null;

  const maxPlaycount = parseInt(tracks[0]?.playcount || '1');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Top Tracks</h2>
        <span className="text-sm text-muted-foreground">All Time</span>
      </div>

      <div className="space-y-3">
        {tracks.map((track, index) => {
          const image = getImage(track.image, 'medium');
          const playcount = parseInt(track.playcount);
          const progress = (playcount / maxPlaycount) * 100;

          return (
            <motion.a
              key={`${track.name}-${track.artist.name}`}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors relative overflow-hidden"
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/10 to-transparent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />

              <span className="relative w-6 text-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {index + 1}
              </span>

              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {image ? (
                  <img src={image} alt={track.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="relative flex-1 min-w-0">
                <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {track.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {track.artist.name}
                </p>
              </div>

              <div className="relative flex items-center gap-3">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {playcount.toLocaleString()} plays
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};
