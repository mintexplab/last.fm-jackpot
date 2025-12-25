import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useLastFm } from '@/contexts/LastFmContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const ListeningHeatmap = () => {
  const { data } = useLastFm();
  const { recentTracks } = data;

  const heatmapData = useMemo(() => {
    const matrix: number[][] = DAYS.map(() => HOURS.map(() => 0));
    let maxCount = 1;

    recentTracks.forEach((track) => {
      if (track.date?.uts) {
        const date = new Date(parseInt(track.date.uts) * 1000);
        const day = date.getDay();
        const hour = date.getHours();
        matrix[day][hour]++;
        maxCount = Math.max(maxCount, matrix[day][hour]);
      }
    });

    return { matrix, maxCount };
  }, [recentTracks]);

  if (recentTracks.length === 0) return null;

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    const intensity = count / heatmapData.maxCount;
    if (intensity < 0.25) return 'bg-primary/20';
    if (intensity < 0.5) return 'bg-primary/40';
    if (intensity < 0.75) return 'bg-primary/60';
    return 'bg-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-secondary" />
        <h2 className="font-display text-2xl font-bold text-foreground">Listening Activity</h2>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex mb-2 ml-12">
            {HOURS.filter((_, i) => i % 3 === 0).map((hour) => (
              <div
                key={hour}
                className="text-xs text-muted-foreground"
                style={{ width: `${100 / 8}%` }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-10">{day}</span>
                <div className="flex-1 flex gap-0.5">
                  {HOURS.map((hour) => (
                    <motion.div
                      key={`${day}-${hour}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.01 * (dayIndex * 24 + hour) }}
                      className={`flex-1 aspect-square rounded-sm ${getColor(heatmapData.matrix[dayIndex][hour])} transition-all hover:ring-2 hover:ring-primary/50`}
                      title={`${day} ${hour}:00 - ${heatmapData.matrix[dayIndex][hour]} scrobbles`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-muted/30" />
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <div className="w-3 h-3 rounded-sm bg-primary/60" />
              <div className="w-3 h-3 rounded-sm bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Based on your most recent {recentTracks.length} scrobbles
      </p>
    </motion.div>
  );
};
