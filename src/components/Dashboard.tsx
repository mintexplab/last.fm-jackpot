import { motion } from 'framer-motion';
import { UserProfile } from './UserProfile';
import { StatsGrid } from './StatsGrid';
import { TopArtists } from './TopArtists';
import { TopTracks } from './TopTracks';
import { TopAlbums } from './TopAlbums';
import { GenreCloud } from './GenreCloud';
import { RecentTracks } from './RecentTracks';
import { ListeningChart } from './ListeningChart';

export const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenreCloud />
        <RecentTracks />
      </div>
    </motion.div>
  );
};
