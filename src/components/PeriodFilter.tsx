import { motion } from 'framer-motion';
import { useLastFm } from '@/contexts/LastFmContext';

const periods = [
  { value: '7day', label: '7D' },
  { value: '1month', label: '1M' },
  { value: '3month', label: '3M' },
  { value: '6month', label: '6M' },
  { value: '12month', label: '1Y' },
  { value: 'overall', label: 'All' },
];

export const PeriodFilter = () => {
  const { period, setPeriod } = useLastFm();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1 mb-8"
    >
      <span className="text-xs text-muted-foreground font-light mr-3">Period</span>
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => setPeriod(p.value)}
          className={`px-3 py-1.5 text-xs font-light transition-all duration-300 border ${
            period === p.value
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {p.label}
        </button>
      ))}
    </motion.div>
  );
};
