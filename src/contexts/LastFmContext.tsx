import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createLastFmApi, LastFmApi, LastFmUser, LastFmArtist, LastFmTrack, LastFmAlbum, LastFmTag, RecentTrack } from '@/lib/lastfm';

interface LastFmData {
  user: LastFmUser | null;
  topArtists: LastFmArtist[];
  topTracks: LastFmTrack[];
  topAlbums: LastFmAlbum[];
  recentTracks: RecentTrack[];
  topTags: LastFmTag[];
  genreBreakdown: { name: string; count: number }[];
}

interface LastFmContextType {
  apiKey: string;
  username: string;
  period: string;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  data: LastFmData;
  setApiKey: (key: string) => void;
  setUsername: (name: string) => void;
  setPeriod: (period: string) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const defaultData: LastFmData = {
  user: null,
  topArtists: [],
  topTracks: [],
  topAlbums: [],
  recentTracks: [],
  topTags: [],
  genreBreakdown: [],
};

const LastFmContext = createContext<LastFmContextType | undefined>(undefined);

export const LastFmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('lastfm_api_key') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('lastfm_username') || '');
  const [period, setPeriod] = useState('overall');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LastFmData>(defaultData);

  const connect = useCallback(async () => {
    if (!apiKey || !username) {
      setError('Please enter both API key and username');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createLastFmApi(apiKey);
      
      const [user, topArtists, topTracks, topAlbums, recentTracks, topTags] = await Promise.all([
        api.getUserInfo(username),
        api.getTopArtists(username, period, 50),
        api.getTopTracks(username, period, 50),
        api.getTopAlbums(username, period, 50),
        api.getRecentTracks(username, 30),
        api.getTopTags(username),
      ]);

      // Get genre breakdown from top artists
      const genreCounts: Record<string, number> = {};
      const artistTagPromises = topArtists.slice(0, 20).map(artist => 
        api.getArtistTags(artist.name).catch(() => [])
      );
      
      const artistTags = await Promise.all(artistTagPromises);
      artistTags.forEach((tags, index) => {
        const playcount = parseInt(topArtists[index]?.playcount || '0');
        tags.forEach(tag => {
          const tagName = tag.name.toLowerCase();
          genreCounts[tagName] = (genreCounts[tagName] || 0) + playcount;
        });
      });

      const genreBreakdown = Object.entries(genreCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

      setData({
        user,
        topArtists,
        topTracks,
        topAlbums,
        recentTracks,
        topTags,
        genreBreakdown,
      });

      setIsConnected(true);
      localStorage.setItem('lastfm_api_key', apiKey);
      localStorage.setItem('lastfm_username', username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Last.fm');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, username, period]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setData(defaultData);
    localStorage.removeItem('lastfm_api_key');
    localStorage.removeItem('lastfm_username');
  }, []);

  return (
    <LastFmContext.Provider
      value={{
        apiKey,
        username,
        period,
        isLoading,
        isConnected,
        error,
        data,
        setApiKey,
        setUsername,
        setPeriod,
        connect,
        disconnect,
      }}
    >
      {children}
    </LastFmContext.Provider>
  );
};

export const useLastFm = () => {
  const context = useContext(LastFmContext);
  if (context === undefined) {
    throw new Error('useLastFm must be used within a LastFmProvider');
  }
  return context;
};
