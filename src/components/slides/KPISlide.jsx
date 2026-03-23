import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { COLORS } from '../../constants';

const KPISlide = ({ data, onNext }) => {
  // bruker pre-kalkulert analytics data
  const { screenTime, hourlyActivity, contentCategories, calendar } = data.analytics;

  // bare enkle beregninger her, tunge ting er allerede gjort
  const kpis = useMemo(() => {
    const peakHourFormatted = `${hourlyActivity.peakHour.toString().padStart(2, '0')}:00`;
    const top3Categories = contentCategories.categories.slice(0, 3);

    // konsistens-score - bruker calendar data som allerede har daglige tellinger
    const daysActive = calendar.totalActiveDays;
    const avgDaily = screenTime.totalVideos / Math.max(daysActive, 1);
    const consistencyScore = Math.min(100, Math.max(0, Math.round(70 + (daysActive / 365) * 30)));

    return {
      totalHours: screenTime.hours,
      totalMinutes: screenTime.minutes,
      totalVideos: screenTime.totalVideos,
      avgPerDay: Math.round(avgDaily),
      avgMinutesPerDay: screenTime.perDay,
      peakHour: peakHourFormatted,
      peakHourLabel: getPeakHourLabel(hourlyActivity.peakHour),
      top3Categories,
      consistencyScore,
      consistencyLabel: getConsistencyLabel(consistencyScore),
      daysActive,
      activeDaysPercentage: Math.round((daysActive / 365) * 100),
      maxStreak: calendar.maxStreak,
      userType: hourlyActivity.userType
    };
  }, [screenTime, hourlyActivity, contentCategories, calendar]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="slide mesh-bg">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.pink}15 0%, transparent 60%)`,
            filter: 'blur(120px)',
            top: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.aqua}12 0%, transparent 60%)`,
            filter: 'blur(100px)',
            bottom: '-20%',
            right: '-10%',
          }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <span className="text-gray-500 uppercase tracking-widest text-sm font-mono">Oversikt</span>
          <h2 className="text-4xl sm:text-6xl font-bold mt-3">
            Dine <span style={{ color: COLORS.pink }}>Nøkkeltall</span>
          </h2>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Total Usage Time */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 lg:col-span-1 glass-card p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ background: COLORS.pink }} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⏱️</span>
                <span className="text-gray-500 text-sm uppercase tracking-wider">Total Brukstid</span>
              </div>
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="text-5xl lg:text-6xl font-bold"
                  style={{ color: COLORS.pink }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {kpis.totalHours}
                </motion.span>
                <span className="text-2xl text-gray-400">timer</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                + {kpis.totalMinutes} minutter
              </p>
            </div>
          </motion.div>

          {/* Average Per Day */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ background: COLORS.aqua }} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📊</span>
                <span className="text-gray-500 text-sm uppercase tracking-wider">Snitt/Dag</span>
              </div>
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="text-4xl lg:text-5xl font-bold"
                  style={{ color: COLORS.aqua }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {kpis.avgPerDay}
                </motion.span>
                <span className="text-xl text-gray-400">videoer</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                ~{kpis.avgMinutesPerDay} min/dag
              </p>
            </div>
          </motion.div>

          {/* Peak Usage Time */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ background: '#bf00ff' }} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🔥</span>
                <span className="text-gray-500 text-sm uppercase tracking-wider">Peak Time</span>
              </div>
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-white font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {kpis.peakHour}
              </motion.div>
              <p className="text-gray-500 text-sm mt-2">
                {kpis.peakHourLabel}
              </p>
            </div>
          </motion.div>

          {/* Top 3 Categories */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 lg:col-span-1 glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <span className="text-gray-500 text-sm uppercase tracking-wider">Topp Kategorier</span>
            </div>
            <div className="space-y-3">
              {kpis.top3Categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{cat.name}</span>
                      <span className="font-mono" style={{ color: cat.color }}>{cat.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Consistency Score */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📈</span>
              <span className="text-gray-500 text-sm uppercase tracking-wider">Konsistens</span>
            </div>

            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke={getConsistencyColor(kpis.consistencyScore)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={251}
                  initial={{ strokeDashoffset: 251 }}
                  animate={{ strokeDashoffset: 251 - (251 * kpis.consistencyScore) / 100 }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{kpis.consistencyScore}</span>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-2">
              {kpis.consistencyLabel}
            </p>
          </motion.div>

          {/* Active Days & Streak */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🗓️</span>
              <span className="text-gray-500 text-sm uppercase tracking-wider">Aktivitet</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <motion.span
                  className="text-3xl font-bold"
                  style={{ color: COLORS.aqua }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {kpis.daysActive}
                </motion.span>
                <p className="text-gray-500 text-xs mt-1">aktive dager</p>
              </div>
              <div>
                <motion.span
                  className="text-3xl font-bold"
                  style={{ color: COLORS.pink }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {kpis.maxStreak}
                </motion.span>
                <p className="text-gray-500 text-xs mt-1">dager streak</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* User Type Badge */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${COLORS.pink}20, ${COLORS.aqua}20)`,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span className="text-2xl">🏷️</span>
            <span className="text-white font-semibold">Du er: {kpis.userType}</span>
          </div>
        </motion.div>

        {/* Next button */}
        <motion.div variants={itemVariants} className="text-center mt-10">
          <button
            onClick={onNext}
            className="px-8 py-4 rounded-2xl font-semibold text-white text-lg"
            style={{ background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.aqua})` }}
          >
            Se mer detaljer →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

function getPeakHourLabel(hour) {
  if (hour >= 5 && hour < 9) return 'Tidlig morgen';
  if (hour >= 9 && hour < 12) return 'Formiddag';
  if (hour >= 12 && hour < 14) return 'Lunsjtid';
  if (hour >= 14 && hour < 17) return 'Ettermiddag';
  if (hour >= 17 && hour < 20) return 'Tidlig kveld';
  if (hour >= 20 && hour < 23) return 'Sen kveld';
  return 'Nattetid';
}

function getConsistencyLabel(score) {
  if (score >= 80) return 'Veldig jevn';
  if (score >= 60) return 'Ganske jevn';
  if (score >= 40) return 'Varierende';
  if (score >= 20) return 'Uforutsigbar';
  return 'Sporadisk';
}

function getConsistencyColor(score) {
  if (score >= 80) return '#00f2ea';
  if (score >= 60) return '#b8ff00';
  if (score >= 40) return '#ff6b00';
  return '#ff0050';
}

export default KPISlide;
