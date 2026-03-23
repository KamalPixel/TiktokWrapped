import { motion } from 'framer-motion';

const WelcomeSlide = ({ data, onNext }) => {
  const year = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="slide mesh-bg">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 -left-20 w-80 h-80 bg-[var(--neon-pink)] rounded-full blur-[180px] opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-[var(--neon-cyan)] rounded-full blur-[200px] opacity-25"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.25, 0.35, 0.25]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--neon-purple)] rounded-full blur-[250px] opacity-10" />
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-4 h-4 bg-[var(--neon-lime)] rotate-45"
        animate={{
          y: [-20, 20, -20],
          rotate: [45, 135, 45]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/5 w-6 h-6 border-2 border-[var(--neon-pink)] rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-3 h-8 bg-[var(--neon-cyan)] opacity-50"
        animate={{
          rotate: [0, 180, 360],
          y: [-10, 10, -10]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Year badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--bg-elevated)] text-[var(--text-muted)] text-sm font-mono mb-8">
            {year}
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl sm:text-8xl font-bold mb-6 tracking-tight"
        >
          <span className="block text-gradient animate-gradient">Din</span>
          <span className="block text-white">TikTok</span>
          <span className="block text-gradient-fire">Wrapped</span>
        </motion.h1>

        {/* Stats teaser */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 mb-8 inline-block"
        >
          <div className="flex items-center gap-8 text-sm">
            <div className="text-center">
              <div className="stat-number text-3xl text-[var(--neon-pink)] text-glow-pink">
                {data.stats.totalVideos.toLocaleString()}
              </div>
              <div className="text-[var(--text-muted)] mt-1">videoer sett</div>
            </div>
            <div className="w-px h-12 bg-[var(--bg-elevated)]" />
            <div className="text-center">
              <div className="stat-number text-3xl text-[var(--neon-cyan)] text-glow-cyan">
                {data.stats.totalLikes.toLocaleString()}
              </div>
              <div className="text-[var(--text-muted)] mt-1">likes gitt</div>
            </div>
            {data.stats.totalComments > 0 && (
              <>
                <div className="w-px h-12 bg-[var(--bg-elevated)]" />
                <div className="text-center">
                  <div className="stat-number text-3xl text-[var(--neon-lime)]">
                    {data.stats.totalComments.toLocaleString()}
                  </div>
                  <div className="text-[var(--text-muted)] mt-1">kommentarer</div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <button
            onClick={onNext}
            className="btn-neon btn-neon-pink group flex items-center gap-3 mx-auto"
          >
            <span>La oss begynne</span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </button>
        </motion.div>

        {/* Demo badge */}
        {data.isDemo && (
          <motion.p
            variants={itemVariants}
            className="mt-6 text-[var(--text-muted)] text-sm"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--neon-purple)]/10 border border-[var(--neon-purple)]/30">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-purple)] animate-pulse" />
              Demo-modus
            </span>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default WelcomeSlide;
