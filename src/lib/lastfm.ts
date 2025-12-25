const API_BASE = 'https://ws.audioscrobbler.com/2.0/';

export interface LastFmUser {
  name: string;
  realname: string;
  image: { size: string; '#text': string }[];
  playcount: string;
  registered: { unixtime: string };
  country: string;
  url: string;
}

export interface LastFmArtist {
  name: string;
  playcount: string;
  url: string;
  image: { size: string; '#text': string }[];
  mbid?: string;
}

export interface LastFmTrack {
  name: string;
  playcount: string;
  url: string;
  artist: {
    name: string;
    url: string;
  };
  image: { size: string; '#text': string }[];
  duration?: string;
}

export interface LastFmAlbum {
  name: string;
  playcount: string;
  url: string;
  artist: {
    name: string;
    url: string;
  };
  image: { size: string; '#text': string }[];
}

export interface LastFmTag {
  name: string;
  count: number;
  url: string;
}

export interface RecentTrack {
  name: string;
  artist: { '#text': string };
  album: { '#text': string };
  image: { size: string; '#text': string }[];
  date?: { uts: string; '#text': string };
  '@attr'?: { nowplaying: string };
  url: string;
}

export const getImage = (images: { size: string; '#text': string }[], size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' = 'extralarge'): string => {
  const img = images?.find(i => i.size === size) || images?.[images?.length - 1];
  return img?.['#text'] || '';
};

export const createLastFmApi = (apiKey: string) => {
  const fetchApi = async (method: string, params: Record<string, string> = {}) => {
    const url = new URL(API_BASE);
    url.searchParams.append('method', method);
    url.searchParams.append('api_key', apiKey);
    url.searchParams.append('format', 'json');
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.statusText}`);
    }
    return response.json();
  };

  return {
    getUserInfo: async (username: string): Promise<LastFmUser> => {
      const data = await fetchApi('user.getinfo', { user: username });
      return data.user;
    },

    getTopArtists: async (username: string, period: string = 'overall', limit: number = 50): Promise<LastFmArtist[]> => {
      const data = await fetchApi('user.gettopartists', { user: username, period, limit: limit.toString() });
      return data.topartists?.artist || [];
    },

    getTopTracks: async (username: string, period: string = 'overall', limit: number = 50): Promise<LastFmTrack[]> => {
      const data = await fetchApi('user.gettoptracks', { user: username, period, limit: limit.toString() });
      return data.toptracks?.track || [];
    },

    getTopAlbums: async (username: string, period: string = 'overall', limit: number = 50): Promise<LastFmAlbum[]> => {
      const data = await fetchApi('user.gettopalbums', { user: username, period, limit: limit.toString() });
      return data.topalbums?.album || [];
    },

    getRecentTracks: async (username: string, limit: number = 50): Promise<RecentTrack[]> => {
      const data = await fetchApi('user.getrecenttracks', { user: username, limit: limit.toString(), extended: '1' });
      return data.recenttracks?.track || [];
    },

    getTopTags: async (username: string): Promise<LastFmTag[]> => {
      const data = await fetchApi('user.gettoptags', { user: username });
      return data.toptags?.tag || [];
    },

    getArtistTags: async (artist: string): Promise<LastFmTag[]> => {
      const data = await fetchApi('artist.gettoptags', { artist });
      return data.toptags?.tag?.slice(0, 5) || [];
    },

    getSimilarArtists: async (artist: string, limit: number = 10): Promise<{ name: string; match: number; image: string }[]> => {
      const data = await fetchApi('artist.getsimilar', { artist, limit: limit.toString() });
      return (data.similarartists?.artist || []).map((a: any) => ({
        name: a.name,
        match: parseFloat(a.match) * 100,
        image: getImage(a.image, 'extralarge'),
      }));
    },

    getWeeklyArtistChart: async (username: string): Promise<any[]> => {
      const data = await fetchApi('user.getweeklyartistchart', { user: username });
      return data.weeklyartistchart?.artist || [];
    },
  };
};

export type LastFmApi = ReturnType<typeof createLastFmApi>;
