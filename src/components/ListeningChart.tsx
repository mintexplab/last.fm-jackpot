import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useLastFm } from '@/contexts/LastFmContext';

export const ListeningChart = () => {
  const { data } = useLastFm();
  
  const chartData = data.topArtists.slice(0, 8).map((artist) => ({
    name: artist.name.length > 10 ? artist.name.slice(0, 10) + '...' : artist.name,
    plays: parseInt(artist.playcount),
  }));

  if (chartData.length === 0) return null;

  const colors = [
    'hsl(320, 85%, 60%)',
    'hsl(180, 75%, 50%)',
    'hsl(270, 80%, 60%)',
    'hsl(320, 85%, 50%)',
    'hsl(180, 75%, 40%)',
    'hsl(270, 80%, 50%)',
    'hsl(320, 85%, 40%)',
    'hsl(180, 75%, 60%)',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground">Artist Plays</h2>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value.toLocaleString()} plays`, 'Plays']}
            />
            <Bar dataKey="plays" radius={[0, 8, 8, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
