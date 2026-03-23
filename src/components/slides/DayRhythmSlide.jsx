import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const ChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <p className="text-white font-medium">{payload[0].payload.hour}</p>
        <p className="text-[var(--neon-cyan)]">{payload[0].value.toLocaleString()} videoer</p>
      </div>
    );
  }
  return null;
};

const DayRhythmSlide = ({ data, onNext }) => {
  const hourlyData = data.analytics.hourlyActivity;
  const weeklyData = data.analytics.weeklyActivity;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="slide mesh-bg">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-[var(--neon-cyan)] rounded-full blur-[200px] opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--neon-orange)] rounded-full blur-[180px] opacity-15"
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="text-[var(--text-muted)] uppercase tracking-widest text-sm font-mono">
            Din døgnrytme
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4">
            Du er en{' '}
            <span className="text-gradient-fire">{hourlyData.userType}</span>
          </h2>
        </motion.div>

        {/* Peak hour highlight */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center gap-4 glass-card px-6 py-4">
            <div className="text-left">
              <p className="text-[var(--text-muted)] text-sm">Peak scrolling</p>
              <p className="text-2xl font-bold text-white">
                kl. {hourlyData.peakHour.toString().padStart(2, '0')}:00
              </p>
            </div>
            <div className="w-px h-10 bg-[var(--bg-elevated)]" />
            <div className="text-left">
              <p className="text-[var(--text-muted)] text-sm">Favorittdag</p>
              <p className="text-2xl font-bold text-[var(--neon-cyan)]">
                {weeklyData.peakDay}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Hourly chart */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 mb-6"
        >
          <p className="text-[var(--text-muted)] text-sm mb-4 font-mono uppercase tracking-wider">
            Aktivitet per time
          </p>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData.chartData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  interval={3}
                />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="videos"
                  stroke="var(--neon-cyan)"
                  strokeWidth={2}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly chart */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6"
        >
          <p className="text-[var(--text-muted)] text-sm mb-4 font-mono uppercase tracking-wider">
            Aktivitet per ukedag
          </p>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.chartData.map((day, index) => {
              const maxCount = Math.max(...weeklyData.dayCounts);
              const height = maxCount > 0 ? (day.videos / maxCount) * 100 : 0;
              const isMax = day.videos === maxCount;

              return (
                <motion.div
                  key={day.day}
                  className="flex-1 flex flex-col items-center"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="relative w-full">
                    <motion.div
                      className={`
                        w-full rounded-t-lg transition-colors
                        ${isMax
                          ? 'bg-gradient-to-t from-[var(--neon-pink)] to-[var(--neon-orange)]'
                          : 'bg-[var(--bg-elevated)]'
                        }
                      `}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 8)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + 0.1 * index }}
                      style={{ minHeight: '8px', maxHeight: '100px' }}
                    />
                    {isMax && (
                      <motion.div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 text-[var(--neon-pink)] text-xs font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        🔥
                      </motion.div>
                    )}
                  </div>
                  <p className="text-[var(--text-muted)] text-xs mt-2">{day.day}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Next */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button onClick={onNext} className="btn-neon btn-neon-outline">
            Hvem så du mest på? →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DayRhythmSlide;
