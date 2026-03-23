import { motion } from 'framer-motion';

const HashtagSlide = ({ data, onNext }) => {
  const hashtagData = data.analytics.hashtags;

  // deterministiske rotasjoner basert på index for variasjon i animasjonen
  const getRotation = (index) => ((index * 7) % 10) - 5;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  const getTagSize = (index) => {
    if (index === 0) return 'text-4xl sm:text-5xl';
    if (index < 3) return 'text-2xl sm:text-3xl';
    if (index < 6) return 'text-xl sm:text-2xl';
    if (index < 10) return 'text-lg';
    return 'text-base';
  };

  const getTagColor = (index) => {
    const colors = [
      'text-[var(--neon-pink)] text-glow-pink',
      'text-[var(--neon-cyan)] text-glow-cyan',
      'text-[var(--neon-lime)]',
      'text-[var(--neon-orange)]',
      'text-[var(--neon-purple)]'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="slide mesh-bg">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-[var(--neon-lime)] rounded-full blur-[180px] opacity-15"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[var(--neon-cyan)] rounded-full blur-[150px] opacity-20"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <span className="text-[var(--text-muted)] uppercase tracking-widest text-sm font-mono">
            Dine interesser
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-2">
            Du er <span className="text-gradient-acid">{hashtagData.personality}</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            Basert på {hashtagData.totalUniqueHashtags.toLocaleString()} unike hashtags
          </p>
        </motion.div>

        {/* Hashtag cloud */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-8 mb-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            {hashtagData.topHashtags.map((tag, index) => (
              <motion.span
                key={tag.tag}
                className={`
                  ${getTagSize(index)} ${getTagColor(index)}
                  font-bold cursor-default transition-transform hover:scale-110
                `}
                initial={{ opacity: 0, y: 20, rotate: getRotation(index) }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.1 }}
              >
                {tag.tag}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Top 5 breakdown */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <p className="text-[var(--text-muted)] text-sm mb-4 font-mono uppercase tracking-wider">
            Topp 5 hashtags
          </p>
          <div className="space-y-4">
            {hashtagData.topHashtags.slice(0, 5).map((tag, index) => (
              <motion.div
                key={tag.tag}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <span className={`font-mono text-lg ${getTagColor(index)}`}>
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <span className="flex-1 font-medium text-white">
                  {tag.tag}
                </span>
                <span className="font-mono text-[var(--text-muted)]">
                  {tag.count.toLocaleString()}
                </span>
                <div className="w-32 h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${
                        index === 0 ? 'var(--neon-pink)' :
                        index === 1 ? 'var(--neon-cyan)' :
                        index === 2 ? 'var(--neon-lime)' :
                        index === 3 ? 'var(--neon-orange)' :
                        'var(--neon-purple)'
                      }, transparent)`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(tag.count / hashtagData.topHashtags[0].count) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Personality traits */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mt-6"
        >
          {['Trendsetter', 'Engaged', 'Explorer'].map((trait) => (
            <span
              key={trait}
              className="px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--bg-elevated)] text-[var(--text-secondary)] text-sm"
            >
              {trait}
            </span>
          ))}
        </motion.div>

        {/* Next */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button onClick={onNext} className="btn-neon btn-neon-outline">
            Hva kommenterte du? →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HashtagSlide;
