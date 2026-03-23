import { motion } from 'framer-motion';

const CommentSlide = ({ data, onNext }) => {
  const commentData = data.analytics.comments;

  if (!commentData) {
    return (
      <div className="slide mesh-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-muted)]">Ingen kommentardata funnet</p>
          <button onClick={onNext} className="btn-neon btn-neon-outline mt-4">
            Neste →
          </button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="slide mesh-bg">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--neon-purple)] rounded-full blur-[200px] opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
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
            Din stemme
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-2">
            <span className="text-gradient">{commentData.commenterType}</span>
          </h2>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 mb-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="stat-number text-4xl text-[var(--neon-pink)] mb-1">
                {commentData.totalComments}
              </div>
              <p className="text-[var(--text-muted)] text-sm">kommentarer</p>
            </div>
            <div>
              <div className="stat-number text-4xl text-[var(--neon-cyan)] mb-1">
                {commentData.avgLength}
              </div>
              <p className="text-[var(--text-muted)] text-sm">snitt tegn</p>
            </div>
            <div>
              <div className="stat-number text-4xl text-[var(--neon-lime)] mb-1">
                {commentData.topWords.length}
              </div>
              <p className="text-[var(--text-muted)] text-sm">unike ord</p>
            </div>
          </div>
        </motion.div>

        {/* Sample comments */}
        <motion.div variants={itemVariants} className="mb-6">
          <p className="text-[var(--text-muted)] text-sm mb-4 font-mono uppercase tracking-wider text-center">
            Noen av dine kommentarer
          </p>
          <div className="space-y-3">
            {commentData.randomComments.map((comment, index) => (
              <motion.div
                key={index}
                className="glass-card p-4 relative overflow-hidden"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{
                    background: [
                      'var(--neon-pink)',
                      'var(--neon-cyan)',
                      'var(--neon-lime)',
                      'var(--neon-orange)',
                      'var(--neon-purple)'
                    ][index % 5]
                  }}
                />
                <p className="text-white pl-3 italic">"{comment.Comment}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Word cloud */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <p className="text-[var(--text-muted)] text-sm mb-4 font-mono uppercase tracking-wider">
            Dine favorittord
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {commentData.topWords.map((word, index) => (
              <motion.span
                key={word.word}
                className="px-4 py-2 rounded-full bg-[var(--bg-elevated)] text-white font-medium"
                style={{
                  fontSize: `${Math.max(0.8, 1.2 - index * 0.08)}rem`,
                  opacity: Math.max(0.5, 1 - index * 0.08)
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'var(--neon-pink)',
                }}
              >
                {word.word}
                <span className="text-[var(--text-muted)] text-xs ml-2">
                  ×{word.count}
                </span>
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Next */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button onClick={onNext} className="btn-neon btn-neon-outline">
            Se din aktivitetskalender →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CommentSlide;
