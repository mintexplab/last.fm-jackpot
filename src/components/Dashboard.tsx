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
import { Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const { isLoading, data } = useLastFm();

  if (isLoading && !data.user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <PeriodFilter />
      <UserProfile />
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
