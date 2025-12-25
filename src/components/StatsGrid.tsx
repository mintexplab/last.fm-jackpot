import { motion } from 'framer-motion';
import { Users, Disc, Music, TrendingUp } from 'lucide-react';
import { useLastFm } from '@/contexts/LastFmContext';

export const StatsGrid = () => {
  const { data } = useLastFm();

  const totalPlays = parseInt(data.user?.playcount || '0');
  const uniqueArtists = data.topArtists.length;
  const uniqueTracks = data.topTracks.length;
  
  // Estimate average track length at 3.5 minutes
  const estimatedHours = Math.round((totalPlays * 3.5) / 60);

  const stats = [
    {
      label: 'Total Scrobbles',
      value: totalPlays.toLocaleString(),
      icon: Music,
      color: 'from-primary to-primary/60',
    },
    {
      label: 'Artists Discovered',
      value: uniqueArtists.toString() + '+',
      icon: Users,
      color: 'from-secondary to-secondary/60',
    },
    {
      label: 'Unique Tracks',
      value: uniqueTracks.toString() + '+',
      icon: Disc,
      color: 'from-accent to-accent/60',
    },
    {
      label: 'Hours Listened',
      value: estimatedHours.toLocaleString() + '+',
      icon: TrendingUp,
      color: 'from-primary/80 to-secondary/80',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="glass-card-hover p-5"
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
            <stat.icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <p className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
