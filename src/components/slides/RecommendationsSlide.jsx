import { motion } from 'framer-motion';
import { COLORS } from '../../constants';

const RecommendationsSlide = ({ data, onNext }) => {
  const recommendations = data.analytics.recommendations;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#00f2ea';
    if (score >= 60) return '#b8ff00';
    if (score >= 40) return '#ff6b00';
    return '#ff0050';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Utmerket';
    if (score >= 60) return 'Bra';
    if (score >= 40) return 'Middels';
    return 'Kan forbedres';
  };

  return (
    <div className="slide mesh-bg overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.aqua}12 0%, transparent 60%)`,
            filter: 'blur(120px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto py-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <span className="text-gray-500 uppercase tracking-widest text-sm font-mono">Personlig</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-3">
            Dine <span style={{ color: COLORS.aqua }}>Anbefalinger</span>
          </h2>
          <p className="text-gray-500 mt-3 text-lg">{recommendations.summary}</p>
        </motion.div>

        {/* Health Score */}
        <motion.div variants={itemVariants} className="glass-card p-8 mb-8 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-wider mb-4">Din TikTok Helse-Score</p>

          <div className="relative w-48 h-48 mx-auto mb-6">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={getScoreColor(recommendations.score)}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={553}
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * recommendations.score) / 100 }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
              />
            </svg>

            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-5xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {recommendations.score}
              </motion.span>
              <span className="text-gray-500 text-sm">av 100</span>
            </div>
          </div>

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: `${getScoreColor(recommendations.score)}20` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span style={{ color: getScoreColor(recommendations.score) }} className="font-semibold">
              {getScoreLabel(recommendations.score)}
            </span>
          </motion.div>
        </motion.div>

        {/* Recommendations */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>💡</span> Personlige tips
          </h3>

          <div className="space-y-4">
            {recommendations.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                className="glass-card p-5 relative overflow-hidden"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.15 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Accent line */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: rec.color }}
                />

                <div className="flex items-start gap-4 pl-4">
                  <span className="text-3xl">{rec.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ background: `${rec.color}20`, color: rec.color }}
                      >
                        {rec.category}
                      </span>
                      {rec.priority === 'high' && (
                        <span className="text-xs text-red-400">● Viktig</span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">{rec.title}</h4>
                    <p className="text-gray-400">{rec.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick stats summary */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Mest aktiv', value: 'Kveld', icon: '🌆' },
            { label: 'Favorittdag', value: 'Lørdag', icon: '📅' },
            { label: 'Innholdstype', value: 'Humor', icon: '😂' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-white font-semibold mt-2">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pro tips */}
        <motion.div
          variants={itemVariants}
          className="mt-8 p-6 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${COLORS.pink}10, ${COLORS.aqua}10)`,
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>🎯</span> Pro-tips for bedre TikTok-vaner
          </h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span style={{ color: COLORS.pink }}>•</span>
              Sett daglige tidsbegrensninger i TikToks innstillinger
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: COLORS.aqua }}>•</span>
              Bruk "Ikke interessert" for å forbedre anbefalingene
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#b8ff00' }}>•</span>
              Ta pauser hver 30. minutt for øyehelse
            </li>
          </ul>
        </motion.div>

        {/* Next button */}
        <motion.div variants={itemVariants} className="text-center mt-10">
          <button
            onClick={onNext}
            className="px-8 py-4 rounded-2xl font-semibold text-white text-lg"
            style={{ background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.aqua})` }}
          >
            Fortsett →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RecommendationsSlide;
