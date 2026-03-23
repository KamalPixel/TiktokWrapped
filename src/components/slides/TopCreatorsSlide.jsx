import { motion } from 'framer-motion';

const TopCreatorsSlide = ({ data, onNext }) => {
  const creatorsData = data.analytics.topCreators;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'var(--neon-pink)';
      case 2: return 'var(--neon-cyan)';
      case 3: return 'var(--neon-lime)';
      default: return 'var(--text-muted)';
    }
  };

  const getRankGlow = (rank) => {
    switch (rank) {
      case 1: return 'glow-pink';
      case 2: return 'glow-cyan';
      case 3: return 'glow-lime';
      default: return '';
    }
  };

  const topCreator = creatorsData.topCreators[0];

  return (
    <div className="slide mesh-bg">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--neon-pink)] rounded-full blur-[250px] opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="text-[var(--text-muted)] uppercase tracking-widest text-sm font-mono">
            Dine favoritter
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-2">
            Topp <span className="text-gradient">Skapere</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            Du så på {creatorsData.totalUniqueCreators.toLocaleString()} unike skapere
          </p>
        </motion.div>

        {/* #1 Creator - Featured */}
        {topCreator && (
          <motion.div
            variants={itemVariants}
            className="glass-card p-6 mb-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-pink)] rounded-full blur-[80px] opacity-30" />

            <div className="relative flex items-center gap-6">
              <div className="relative">
                <div className={`
                  w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--neon-pink)] to-[var(--neon-purple)]
                  flex items-center justify-center text-3xl font-bold
                  ${getRankGlow(1)}
                `}>
                  #1
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {topCreator.name}
                </h3>
                <p className="text-[var(--text-muted)]">
                  <span className="text-[var(--neon-pink)] font-mono">{topCreator.count.toLocaleString()}</span> videoer sett
                </p>
              </div>

              <div className="text-right">
                <div className="text-4xl font-bold text-gradient">
                  {topCreator.percentage}%
                </div>
                <p className="text-[var(--text-muted)] text-sm">av all tid</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rest of top creators */}
        <div className="space-y-3">
          {creatorsData.topCreators.slice(1, 10).map((creator, index) => (
            <motion.div
              key={creator.name}
              variants={itemVariants}
              className="glass-card px-4 py-3 flex items-center gap-4 group hover:bg-[var(--bg-surface)] transition-colors"
            >
              {/* Rank */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{
                  backgroundColor: index < 2 ? `${getRankColor(creator.rank)}20` : 'var(--bg-elevated)',
                  color: getRankColor(creator.rank)
                }}
              >
                {creator.rank}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate group-hover:text-[var(--neon-cyan)] transition-colors">
                  {creator.name}
                </p>
              </div>

              {/* Count */}
              <div className="text-right">
                <span className="font-mono text-[var(--text-secondary)]">
                  {creator.count.toLocaleString()}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-24 h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: index < 2
                      ? `linear-gradient(90deg, ${getRankColor(creator.rank)}, ${getRankColor(creator.rank)}80)`
                      : 'var(--bg-surface)'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(creator.count / creatorsData.topCreators[0].count) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Next */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button onClick={onNext} className="btn-neon btn-neon-outline">
            Hva likte du? →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TopCreatorsSlide;
