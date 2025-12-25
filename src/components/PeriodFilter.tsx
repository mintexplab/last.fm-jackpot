import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';

const periods = [
  { value: '7day', label: '7 Days' },
  { value: '1month', label: '1 Month' },
  { value: '3month', label: '3 Months' },
  { value: '6month', label: '6 Months' },
  { value: '12month', label: '12 Months' },
  { value: 'overall', label: 'All Time' },
];

export const PeriodFilter = () => {
  const { period, setPeriod } = useLastFm();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap justify-center gap-2"
    >
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => setPeriod(p.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            period === p.value
              ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          }`}
          style={period === p.value ? { boxShadow: '0 0 20px hsla(45, 90%, 55%, 0.3)' } : {}}
        >
          {p.label}
        </button>
      ))}
    </motion.div>
  );
};
