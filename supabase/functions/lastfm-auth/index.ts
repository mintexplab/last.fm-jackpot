import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LASTFM_API_KEY = Deno.env.get('LASTFM_API_KEY')!;
const LASTFM_API_SECRET = Deno.env.get('LASTFM_API_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function md5(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateApiSig(params: Record<string, string>): Promise<string> {
  const sortedKeys = Object.keys(params).sort();
  let sig = '';
  for (const key of sortedKeys) {
    sig += key + params[key];
  }
  sig += LASTFM_API_SECRET;
  return await md5(sig);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log('Last.fm auth action:', action);

    // Get auth URL for redirect
    if (action === 'get-auth-url') {
      const { callbackUrl } = await req.json();
      const authUrl = `https://www.last.fm/api/auth/?api_key=${LASTFM_API_KEY}&cb=${encodeURIComponent(callbackUrl)}`;
      
      console.log('Generated auth URL:', authUrl);
      
      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Exchange token for session
    if (action === 'exchange-token') {
      const { token } = await req.json();
      
      console.log('Exchanging token for session...');

      // Get session from Last.fm
      const params: Record<string, string> = {
        method: 'auth.getSession',
        api_key: LASTFM_API_KEY,
        token: token,
      };
      params.api_sig = await generateApiSig(params);
      params.format = 'json';

      const queryString = new URLSearchParams(params).toString();
      const sessionResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?${queryString}`);
      const sessionData = await sessionResponse.json();

      console.log('Session response:', JSON.stringify(sessionData));

      if (sessionData.error) {
        throw new Error(sessionData.message || 'Failed to get session from Last.fm');
      }

      const { session } = sessionData;
      const username = session.name;
      const sessionKey = session.key;

      // Get user info from Last.fm
      const userParams: Record<string, string> = {
        method: 'user.getInfo',
        user: username,
        api_key: LASTFM_API_KEY,
        format: 'json',
      };
      const userQueryString = new URLSearchParams(userParams).toString();
      const userResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?${userQueryString}`);
      const userData = await userResponse.json();

      console.log('User data:', JSON.stringify(userData));

      const user = userData.user;
      const avatarUrl = user.image?.find((img: { size: string; '#text': string }) => img.size === 'extralarge')?.['#text'] || '';

      // Create Supabase admin client
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // Create or sign in user with email based on Last.fm username
      const email = `${username.toLowerCase()}@lastfm.local`;
      const password = await md5(`${username}${LASTFM_API_SECRET}`);

      // Try to sign in first
      let authData: { session: any; user: any } | null = null;
      const signInResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If user doesn't exist, create them
      if (signInResult.error && signInResult.error.message.includes('Invalid login credentials')) {
        console.log('User does not exist, creating new user...');
        
        const signUpResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              lastfm_username: username,
              display_name: user.realname || username,
            },
          },
        });

        if (signUpResult.error) {
          throw signUpResult.error;
        }

        authData = {
          session: signUpResult.data.session,
          user: signUpResult.data.user,
        };

        // Create profile
        if (signUpResult.data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: signUpResult.data.user.id,
              lastfm_username: username,
              lastfm_session_key: sessionKey,
              display_name: user.realname || username,
              avatar_url: avatarUrl,
              country: user.country || null,
              playcount: parseInt(user.playcount) || 0,
              registered_at: user.registered?.unixtime 
                ? new Date(parseInt(user.registered.unixtime) * 1000).toISOString()
                : null,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }
      } else if (signInResult.error) {
        throw signInResult.error;
      } else {
        authData = {
          session: signInResult.data.session,
          user: signInResult.data.user,
        };

        // Update existing profile with new session key and info
        if (signInResult.data.user) {
          console.log('Updating existing profile...');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              lastfm_session_key: sessionKey,
              avatar_url: avatarUrl,
              playcount: parseInt(user.playcount) || 0,
            })
            .eq('user_id', signInResult.data.user.id);

          if (updateError) {
            console.error('Profile update error:', updateError);
          }
        }
      }

      console.log('Auth successful for user:', username);

      return new Response(
        JSON.stringify({
          success: true,
          session: authData?.session,
          user: authData?.user,
          lastfmUsername: username,
          sessionKey,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API key for client-side use
    if (action === 'get-api-key') {
      return new Response(
        JSON.stringify({ apiKey: LASTFM_API_KEY }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in lastfm-auth:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
