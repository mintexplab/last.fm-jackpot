import { motion } from 'framer-motion';
import { PeriodFilter } from './PeriodFilter';
import { UserProfile } from './UserProfile';
import { StatsGrid } from './StatsGrid';
import { TopArtists } from './TopArtists';
import { TopTracks } from './TopTracks';
import { TopAlbums } from './TopAlbums';
import { GenreCloud } from './GenreCloud';
import { RecentTracks } from './RecentTracks';
import { ListeningChart } from './ListeningChart';
import { SimilarArtists } from './SimilarArtists';
import { ListeningHeatmap } from './ListeningHeatmap';
import { useLastFm } from '@/contexts/LastFmContext';

export const Dashboard = () => {
  const { isLoading, data } = useLastFm();

  if (isLoading && !data.user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <UserProfile />
      <PeriodFilter />
      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopArtists />
        <TopTracks />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopAlbums />
        <ListeningChart />
      </div>

      <SimilarArtists />
      <ListeningHeatmap />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenreCloud />
        <RecentTracks />
      </div>
    </motion.div>
  );
};
