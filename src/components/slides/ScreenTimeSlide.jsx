import { motion } from 'framer-motion';

const ScreenTimeSlide = ({ data, onNext }) => {
  const screenTime = data.analytics.screenTime;

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
    <div className="slide mesh-bg grid-pattern">
      {/* Intense glow for impact */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--neon-pink)] rounded-full blur-[200px] opacity-40"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Label */}
        <motion.div variants={itemVariants}>
          <span className="text-[var(--text-muted)] uppercase tracking-widest text-sm font-mono">
            Total skjermtid
          </span>
        </motion.div>

        {/* Big number */}
        <motion.div
          variants={itemVariants}
          className="my-8"
        >
          <div className="flex items-baseline justify-center gap-4">
            <motion.span
              className="stat-number text-[120px] sm:text-[180px] text-gradient leading-none"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {screenTime.hours}
            </motion.span>
            <span className="text-4xl sm:text-6xl text-[var(--text-secondary)] font-medium">
              timer
            </span>
          </div>
          <motion.p
            className="text-2xl sm:text-3xl text-[var(--text-secondary)] mt-2"
            variants={itemVariants}
          >
            og <span className="text-white">{screenTime.minutes} minutter</span>
          </motion.p>
        </motion.div>

        {/* Context */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 inline-block mb-8"
        >
          <p className="text-[var(--text-secondary)] mb-4">
            Det er {screenTime.comparison}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--neon-cyan)]">
                {screenTime.totalVideos.toLocaleString()}
              </div>
              <div className="text-[var(--text-muted)]">videoer</div>
            </div>
            <div className="w-px h-10 bg-[var(--bg-elevated)]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--neon-lime)]">
                ~{screenTime.perDay}
              </div>
              <div className="text-[var(--text-muted)]">min/dag snitt</div>
            </div>
          </div>
        </motion.div>

        {/* Fun comparison bars */}
        <motion.div
          variants={itemVariants}
          className="space-y-3 max-w-md mx-auto text-left"
        >
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--text-muted)]">TikTok</span>
              <span className="text-[var(--neon-pink)] font-mono">{screenTime.hours}t</span>
            </div>
            <div className="h-3 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)]"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--text-muted)]">En Marvel-film</span>
              <span className="text-[var(--text-muted)] font-mono">~2.5t</span>
            </div>
            <div className="h-3 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--bg-surface)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((2.5 / screenTime.hours) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--text-muted)]">Game of Thrones (alt)</span>
              <span className="text-[var(--text-muted)] font-mono">~70t</span>
            </div>
            <div className="h-3 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--bg-surface)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((70 / screenTime.hours) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Next button */}
        <motion.div variants={itemVariants} className="mt-10">
          <button onClick={onNext} className="btn-neon btn-neon-outline">
            Men når scrollet du? →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScreenTimeSlide;
