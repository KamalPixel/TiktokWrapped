import { motion } from 'framer-motion';
import { useMemo } from 'react';

const CalendarSlide = ({ data, onNext }) => {
  const calendarData = data.analytics.calendar;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const weeks = useMemo(() => {
    const result = [];
    let currentWeek = [];

    const firstDay = new Date(calendarData.calendarData[0]?.date);
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      currentWeek.push(null);
    }

    calendarData.calendarData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push(null);
    }
    if (currentWeek.length) {
      result.push(currentWeek);
    }

    return result;
  }, [calendarData.calendarData]);

  const getLevelColor = (level) => {
    switch (level) {
      case 0: return 'bg-[var(--bg-elevated)]';
      case 1: return 'bg-[var(--neon-pink)]/20';
      case 2: return 'bg-[var(--neon-pink)]/40';
      case 3: return 'bg-[var(--neon-pink)]/60';
      case 4: return 'bg-[var(--neon-pink)]';
      default: return 'bg-[var(--bg-elevated)]';
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];

  return (
    <div className="slide mesh-bg">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--neon-cyan)] rounded-full blur-[200px] opacity-15"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <span className="text-[var(--text-muted)] uppercase tracking-widest text-sm font-mono">
            Ditt år i piksler
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4">
            Aktivitets<span className="text-gradient">kalender</span>
          </h2>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          <div className="glass-card px-6 py-4 text-center">
            <div className="stat-number text-3xl text-[var(--neon-pink)] mb-1">
              {calendarData.maxStreak}
            </div>
            <p className="text-[var(--text-muted)] text-sm">dager i strekk (maks)</p>
          </div>
          <div className="glass-card px-6 py-4 text-center">
            <div className="stat-number text-3xl text-[var(--neon-cyan)] mb-1">
              {calendarData.totalActiveDays}
            </div>
            <p className="text-[var(--text-muted)] text-sm">aktive dager</p>
          </div>
          {calendarData.mostActiveDay && (
            <div className="glass-card px-6 py-4 text-center">
              <div className="stat-number text-3xl text-[var(--neon-lime)] mb-1">
                {calendarData.mostActiveDay.count}
              </div>
              <p className="text-[var(--text-muted)] text-sm">videoer {calendarData.mostActiveDay.formatted}</p>
            </div>
          )}
        </motion.div>

        {/* Calendar heatmap */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 overflow-x-auto"
        >
          {/* Month labels */}
          <div className="flex mb-2 text-[var(--text-muted)] text-xs font-mono">
            <div className="w-8" /> {/* Spacer for day labels */}
            {months.map((month) => (
              <div key={month} className="flex-1 text-center">
                {month}
              </div>
            ))}
          </div>

          {/* Day labels */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 mr-2 text-[var(--text-muted)] text-xs font-mono justify-around">
              <span>Søn</span>
              <span>Man</span>
              <span>Tir</span>
              <span>Ons</span>
              <span>Tor</span>
              <span>Fre</span>
              <span>Lør</span>
            </div>

            {/* Heatmap grid - rotated to show weeks as columns */}
            <div className="flex gap-[2px] flex-1 overflow-x-auto pb-2">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`
                        w-3 h-3 rounded-sm
                        ${day ? getLevelColor(day.level) : 'bg-transparent'}
                        ${day?.level === 4 ? 'glow-pink' : ''}
                      `}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.3 + weekIndex * 0.01,
                        duration: 0.2
                      }}
                      title={day ? `${day.date}: ${day.count} videoer` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 text-[var(--text-muted)] text-xs">
            <span>Mindre</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
              />
            ))}
            <span>Mer</span>
          </div>
        </motion.div>

        {/* Fun insight */}
        {calendarData.mostActiveDay && (
          <motion.div
            variants={itemVariants}
            className="text-center mt-6 text-[var(--text-secondary)]"
          >
            <p>
              Din mest aktive dag var{' '}
              <span className="text-[var(--neon-lime)] font-bold">
                {calendarData.mostActiveDay.formatted}
              </span>
              {' '}– du så hele{' '}
              <span className="text-white font-bold">
                {calendarData.mostActiveDay.count} videoer
              </span>
              !
            </p>
          </motion.div>
        )}

        {/* Next */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button onClick={onNext} className="btn-neon btn-neon-pink">
            Del din Wrapped! →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CalendarSlide;
