import { motion } from 'framer-motion';
import { COLORS } from '../../constants';

const SegmentationSlide = ({ data, onNext }) => {
  const timeSegments = data.analytics.timeSegments;
  const weekSegments = data.analytics.weekSegments;
  const contentCategories = data.analytics.contentCategories;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="slide mesh-bg overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.pink}15 0%, transparent 60%)`,
            filter: 'blur(100px)',
            top: '-20%',
            right: '-10%',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.aqua}12 0%, transparent 60%)`,
            filter: 'blur(100px)',
            bottom: '-10%',
            left: '-10%',
          }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <span className="text-gray-500 uppercase tracking-widest text-sm font-mono">Dypdykk</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-3">
            Din <span style={{ color: COLORS.pink }}>Segmentering</span>
          </h2>
        </motion.div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
          {/* Time of Day */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{timeSegments.dominant.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-white">Tid på døgnet</h3>
                <p className="text-gray-500 text-sm">Når scroller du mest?</p>
              </div>
            </div>

            <div className="space-y-4">
              {timeSegments.segments.map((segment, index) => (
                <motion.div
                  key={segment.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{segment.icon}</span>
                      <span className="text-white font-medium">{segment.name}</span>
                      <span className="text-gray-600 text-sm">({segment.range})</span>
                    </div>
                    <span className="text-gray-400 font-mono">{segment.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: segment.id === timeSegments.dominant.id
                          ? `linear-gradient(90deg, ${COLORS.pink}, ${COLORS.aqua})`
                          : 'rgba(255,255,255,0.2)'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${segment.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Insights */}
            {timeSegments.insights.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                {timeSegments.insights.map((insight, i) => (
                  <p key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span>{insight.icon}</span>
                    <span>{insight.text}</span>
                  </p>
                ))}
              </div>
            )}
          </motion.div>

          {/* Weekday vs Weekend */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="text-xl font-semibold text-white">Ukedag vs Helg</h3>
                <p className="text-gray-500 text-sm">{weekSegments.behaviorDescription}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Weekday */}
              <div className="text-center">
                <motion.div
                  className="w-28 h-28 rounded-full flex items-center justify-center mb-3 mx-auto"
                  style={{
                    background: `conic-gradient(${COLORS.pink} ${weekSegments.weekday.percentage * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                  }}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="w-20 h-20 rounded-full bg-[#0a0a0c] flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{weekSegments.weekday.percentage}%</span>
                  </div>
                </motion.div>
                <p className="text-white font-medium">{weekSegments.weekday.icon} Ukedager</p>
                <p className="text-gray-500 text-sm">{weekSegments.weekday.avgPerDay} videoer/dag</p>
              </div>

              {/* VS */}
              <div className="text-gray-600 text-2xl font-bold">vs</div>

              {/* Weekend */}
              <div className="text-center">
                <motion.div
                  className="w-28 h-28 rounded-full flex items-center justify-center mb-3 mx-auto"
                  style={{
                    background: `conic-gradient(${COLORS.aqua} ${weekSegments.weekend.percentage * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                  }}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <div className="w-20 h-20 rounded-full bg-[#0a0a0c] flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{weekSegments.weekend.percentage}%</span>
                  </div>
                </motion.div>
                <p className="text-white font-medium">{weekSegments.weekend.icon} Helg</p>
                <p className="text-gray-500 text-sm">{weekSegments.weekend.avgPerDay} videoer/dag</p>
              </div>
            </div>

            <div className="text-center p-4 rounded-xl" style={{ background: `${COLORS.aqua}10` }}>
              <p className="text-lg font-semibold" style={{ color: COLORS.aqua }}>
                {weekSegments.behaviorType}
              </p>
            </div>
          </motion.div>

          {/* Content Categories - Full width */}
          <motion.div variants={itemVariants} className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="text-xl font-semibold text-white">Innholdstyper</h3>
                  <p className="text-gray-500 text-sm">Hva ser du mest på?</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: COLORS.pink }}>
                  {contentCategories.personality.title}
                </p>
                <p className="text-gray-500 text-sm">{contentCategories.personality.description}</p>
              </div>
            </div>

            {/* Category bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contentCategories.categories.slice(0, 8).map((category, index) => (
                <motion.div
                  key={category.id}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <span className="text-2xl w-10 text-center">{category.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{category.name}</span>
                      <span className="text-gray-500 font-mono">{category.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: category.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.05 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Content insights */}
            {contentCategories.insights.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {contentCategories.insights.map((insight, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm text-gray-400"
                  >
                    <span>{insight.icon}</span>
                    <span>{insight.text}</span>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Next button */}
        <motion.div variants={itemVariants} className="text-center mt-10">
          <button
            onClick={onNext}
            className="px-8 py-4 rounded-2xl font-semibold text-white text-lg"
            style={{ background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.aqua})` }}
          >
            Se anbefalinger →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SegmentationSlide;
