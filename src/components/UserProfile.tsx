import { motion } from 'framer-motion';
import { Calendar, Headphones, MapPin, ExternalLink, LogOut } from 'lucide-react';
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
    month: 'long',
    day: 'numeric',
  });

  const playcount = parseInt(user.playcount).toLocaleString();
  const avatar = getImage(user.image, 'extralarge') || profile?.avatar_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg"
               style={{ boxShadow: '0 0 30px hsla(45, 90%, 55%, 0.2)' }}>
            {avatar ? (
              <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-4xl font-display font-bold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-lg">
            <Headphones className="w-4 h-4 text-secondary-foreground" />
          </div>
        </motion.div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {user.realname || user.name}
            </h1>
            {user.realname && (
              <p className="text-muted-foreground">@{user.name}</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
            {user.country && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                {user.country}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-secondary" />
              Since {formattedDate}
            </span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              View on Last.fm <ExternalLink className="w-3 h-3" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center md:text-right"
        >
          <p className="text-muted-foreground text-sm mb-1">Total Scrobbles</p>
          <p className="font-display text-4xl md:text-5xl font-bold gradient-text stat-glow">
            {playcount}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
