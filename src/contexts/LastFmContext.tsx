import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { createLastFmApi, LastFmUser, LastFmArtist, LastFmTrack, LastFmAlbum, LastFmTag, RecentTrack } from '@/lib/lastfm';

interface LastFmData {
  user: LastFmUser | null;
  topArtists: LastFmArtist[];
  topTracks: LastFmTrack[];
  topAlbums: LastFmAlbum[];
  recentTracks: RecentTrack[];
  topTags: LastFmTag[];
  genreBreakdown: { name: string; count: number }[];
  similarArtists: { name: string; match: number; image: string }[];
  weeklyChart: { name: string; playcount: number; day: string }[];
}

interface Profile {
  id: string;
  user_id: string;
  lastfm_username: string;
  lastfm_session_key: string | null;
  display_name: string | null;
  avatar_url: string | null;
  country: string | null;
  playcount: number;
}

interface LastFmContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  period: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  data: LastFmData;
  apiKey: string | null;
  setPeriod: (period: string) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  fetchData: () => Promise<void>;
}

const defaultData: LastFmData = {
  user: null,
  topArtists: [],
  topTracks: [],
  topAlbums: [],
  recentTracks: [],
  topTags: [],
  genreBreakdown: [],
  similarArtists: [],
  weeklyChart: [],
};

const LastFmContext = createContext<LastFmContextType | undefined>(undefined);

export const LastFmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [period, setPeriod] = useState('overall');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LastFmData>(defaultData);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Fetch API key on mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const result = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lastfm-auth?action=get-api-key`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({}),
          }
        );
        const data = await result.json();
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      } catch (err) {
        console.error('Failed to fetch API key:', err);
      }
    };
    fetchApiKey();
  }, []);

  // Setup auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
        setData(defaultData);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData as Profile);
    }
  };

  const fetchData = useCallback(async () => {
    if (!profile?.lastfm_username || !apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const api = createLastFmApi(apiKey);
      const username = profile.lastfm_username;
      
      const [userInfo, topArtists, topTracks, topAlbums, recentTracks, topTags] = await Promise.all([
        api.getUserInfo(username),
        api.getTopArtists(username, period, 50),
        api.getTopTracks(username, period, 50),
        api.getTopAlbums(username, period, 50),
        api.getRecentTracks(username, 50),
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

      // Get similar artists for top artist
      let similarArtists: { name: string; match: number; image: string }[] = [];
      if (topArtists.length > 0) {
        try {
          const similar = await api.getSimilarArtists(topArtists[0].name, 8);
          similarArtists = similar;
        } catch (e) {
          console.error('Failed to get similar artists:', e);
        }
      }

      setData({
        user: userInfo,
        topArtists,
        topTracks,
        topAlbums,
        recentTracks,
        topTags,
        genreBreakdown,
        similarArtists,
        weeklyChart: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [profile?.lastfm_username, apiKey, period]);

  // Fetch data when profile or period changes
  useEffect(() => {
    if (profile && apiKey) {
      fetchData();
    }
  }, [profile, apiKey, period, fetchData]);

  const login = useCallback(async () => {
    const callbackUrl = `${window.location.origin}/callback`;
    
    const result = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lastfm-auth?action=get-auth-url`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ callbackUrl }),
      }
    );
    const data = await result.json();
    
    if (data.authUrl) {
      window.location.href = data.authUrl;
    } else {
      setError('Failed to get auth URL');
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setData(defaultData);
  }, []);

  return (
    <LastFmContext.Provider
      value={{
        user,
        session,
        profile,
        period,
        isLoading,
        isAuthenticated: !!user && !!profile,
        error,
        data,
        apiKey,
        setPeriod,
        login,
        logout,
        fetchData,
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
