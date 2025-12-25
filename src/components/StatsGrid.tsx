import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';

export const StatsGrid = () => {
  const { data } = useLastFm();

  const totalPlays = parseInt(data.user?.playcount || '0');
  const uniqueArtists = data.topArtists.length;
  const uniqueTracks = data.topTracks.length;
  
  // Estimate average track length at 3.5 minutes
  const estimatedHours = Math.round((totalPlays * 3.5) / 60);

  const stats = [
    { label: 'Scrobbles', value: totalPlays.toLocaleString() },
    { label: 'Artists', value: uniqueArtists.toString() + '+' },
    { label: 'Tracks', value: uniqueTracks.toString() + '+' },
    { label: 'Hours', value: estimatedHours.toLocaleString() + '+' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/30 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 * index }}
          className="bg-background p-6 text-center"
        >
          <p className="font-display text-2xl md:text-3xl font-medium text-foreground mb-1">
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground font-light uppercase tracking-wider">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
