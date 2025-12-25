import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, LogOut } from 'lucide-react';
import { useLastFm } from '@/contexts/LastFmContext';
import { getImage } from '@/lib/lastfm';
import { Button } from '@/components/ui/button';

export const UserProfile = () => {
  const { data, logout, profile } = useLastFm();
  const { user } = data;

  if (!user) return null;

  const registeredDate = new Date(parseInt(user.registered.unixtime) * 1000);
  const formattedDate = registeredDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  const playcount = parseInt(user.playcount).toLocaleString();
  const avatar = getImage(user.image, 'extralarge') || profile?.avatar_url;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-b border-border/30 pb-8 mb-8"
    >
      <div className="flex flex-col md:flex-row items-start gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-border/50"
        >
          {avatar ? (
            <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-display font-medium text-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </motion.div>

        <div className="flex-1 space-y-3">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground">
              {user.realname || user.name}
            </h2>
            {user.realname && (
              <p className="text-muted-foreground text-sm font-light">@{user.name}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-light">
            {user.country && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {user.country}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="text-primary font-medium">{playcount} scrobbles</span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors font-light"
            >
              Last.fm <ExternalLink className="w-3 h-3" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-xs text-muted-foreground hover:text-primary h-auto p-0 font-light"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
