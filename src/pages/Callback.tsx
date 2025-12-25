import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authenticating with Last.fm...');

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No token received from Last.fm');
        return;
      }

      try {
        setMessage('Exchanging token for session...');

        const result = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lastfm-auth?action=exchange-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await result.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.session) {
          // Set the session in Supabase client
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });

          setStatus('success');
          setMessage(`Welcome, ${data.lastfmUsername}!`);

          // Redirect to home after short delay
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          throw new Error('No session received');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-md w-full text-center space-y-6 relative z-10"
      >
        <motion.div
          animate={status === 'loading' ? { rotate: 360 } : {}}
          transition={status === 'loading' ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            status === 'loading' ? 'bg-primary/20' :
            status === 'success' ? 'bg-green-500/20' :
            'bg-destructive/20'
          }`}
        >
          {status === 'loading' && <Loader2 className="w-8 h-8 text-primary" />}
          {status === 'success' && <CheckCircle className="w-8 h-8 text-green-500" />}
          {status === 'error' && <XCircle className="w-8 h-8 text-destructive" />}
        </motion.div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {status === 'loading' ? 'Connecting...' :
             status === 'success' ? 'Success!' :
             'Authentication Failed'}
          </h1>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {status === 'error' && (
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline text-sm"
          >
            Return to home
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Callback;
