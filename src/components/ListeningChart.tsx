import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { useLastFm } from '@/contexts/LastFmContext';

export const ListeningChart = () => {
  const { data } = useLastFm();
  
  const chartData = data.topArtists.slice(0, 8).map((artist) => ({
    name: artist.name.length > 8 ? artist.name.slice(0, 8) + '…' : artist.name,
    plays: parseInt(artist.playcount),
  }));

  if (chartData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="border border-border/30 p-6"
    >
      <h2 className="font-display text-lg font-medium text-foreground mb-6">Artist Distribution</h2>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="plays" radius={[2, 2, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? 'hsl(350, 100%, 60%)' : 'hsl(0, 0%, 25%)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
