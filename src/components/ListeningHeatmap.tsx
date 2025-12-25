import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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

  const getOpacity = (count: number) => {
    if (count === 0) return 0.05;
    return 0.2 + (count / heatmapData.maxCount) * 0.8;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="border border-border/30 p-6"
    >
      <h2 className="font-display text-lg font-medium text-foreground mb-6">Activity</h2>

      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Hour labels */}
          <div className="flex mb-1 ml-6">
            {HOURS.filter((_, i) => i % 6 === 0).map((hour) => (
              <div
                key={hour}
                className="text-[10px] text-muted-foreground font-light"
                style={{ width: `${100 / 4}%` }}
              >
                {hour}h
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-0.5">
            {DAYS.map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground w-5 font-light">{day}</span>
                <div className="flex-1 flex gap-px">
                  {HOURS.map((hour) => (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className="flex-1 aspect-square bg-primary transition-all"
                      style={{ opacity: getOpacity(heatmapData.matrix[dayIndex][hour]) }}
                      title={`${heatmapData.matrix[dayIndex][hour]} scrobbles`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
