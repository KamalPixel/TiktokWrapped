import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { calculateScreenTime, analyzeTopCreators, analyzeHashtags } from '../../utils/analytics';

const ShareSlide = ({ data }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareCardStyle, setShareCardStyle] = useState('stats');
  const cardRef = useRef(null);

  const screenTime = useMemo(() => calculateScreenTime(data.viewHistory), [data.viewHistory]);
  const topCreators = useMemo(() => analyzeTopCreators(data.viewHistory, 3), [data.viewHistory]);
  const hashtagData = useMemo(() => analyzeHashtags(data.viewHistory, 5), [data.viewHistory]);

  const year = new Date().getFullYear();

  const downloadCard = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0b',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `tiktok-wrapped-${year}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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
    <div className="slide mesh-bg">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-pink)] rounded-full blur-[200px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--neon-cyan)] rounded-full blur-[180px] opacity-15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--neon-lime)] rounded-full blur-[150px] opacity-10" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Del din <span className="text-gradient">Wrapped</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Last ned og del på sosiale medier
          </p>
        </motion.div>

        {/* Style selector */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-2 mb-6"
        >
          {['stats', 'creators', 'vibe'].map((style) => (
            <button
              key={style}
              onClick={() => setShareCardStyle(style)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${shareCardStyle === style
                  ? 'bg-[var(--neon-pink)] text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-white'
                }
              `}
            >
              {style === 'stats' && 'Statistikk'}
              {style === 'creators' && 'Skapere'}
              {style === 'vibe' && 'Vibe'}
            </button>
          ))}
        </motion.div>

        {/* Share card preview */}
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <div
            ref={cardRef}
            className="aspect-[9/16] max-w-xs mx-auto rounded-3xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a1d 100%)'
            }}
          >
            {/* Card background effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--neon-pink)] rounded-full blur-[100px] opacity-30" />
              <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-[var(--neon-cyan)] rounded-full blur-[80px] opacity-20" />
              <div className="absolute bottom-40 right-1/4 w-40 h-40 bg-[var(--neon-lime)] rounded-full blur-[70px] opacity-15" />
            </div>

            {/* Card content */}
            <div className="relative h-full p-6 flex flex-col">
              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-[var(--text-muted)] text-xs font-mono mb-2">{year}</p>
                <h3 className="text-2xl font-bold">
                  <span className="text-gradient">TikTok</span>{' '}
                  <span className="text-white">Wrapped</span>
                </h3>
              </div>

              {/* Dynamic content based on style */}
              <div className="flex-1 flex flex-col justify-center">
                {shareCardStyle === 'stats' && (
                  <div className="text-center space-y-6">
                    <div>
                      <div className="stat-number text-6xl text-gradient mb-1">
                        {screenTime.hours}t
                      </div>
                      <p className="text-[var(--text-muted)] text-sm">total skjermtid</p>
                    </div>
                    <div className="flex justify-center gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--neon-cyan)]">
                          {data.stats.totalVideos.toLocaleString()}
                        </div>
                        <p className="text-[var(--text-muted)] text-xs">videoer</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--neon-lime)]">
                          {data.stats.totalLikes.toLocaleString()}
                        </div>
                        <p className="text-[var(--text-muted)] text-xs">likes</p>
                      </div>
                    </div>
                  </div>
                )}

                {shareCardStyle === 'creators' && (
                  <div className="space-y-4">
                    <p className="text-center text-[var(--text-muted)] text-sm mb-4">
                      Mine topp skapere
                    </p>
                    {topCreators.topCreators.map((creator, index) => (
                      <div
                        key={creator.name}
                        className="flex items-center gap-3 bg-[var(--bg-surface)]/50 rounded-xl p-3"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                          style={{
                            background: index === 0 ? 'var(--neon-pink)' :
                                       index === 1 ? 'var(--neon-cyan)' :
                                       'var(--neon-lime)'
                          }}
                        >
                          {index + 1}
                        </div>
                        <span className="text-white font-medium flex-1 truncate">
                          {creator.name}
                        </span>
                        <span className="text-[var(--text-muted)] text-sm font-mono">
                          {creator.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {shareCardStyle === 'vibe' && (
                  <div className="text-center space-y-6">
                    <div>
                      <p className="text-[var(--text-muted)] text-sm mb-2">Min TikTok-personlighet</p>
                      <h4 className="text-3xl font-bold text-gradient-acid">
                        {hashtagData.personality}
                      </h4>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {hashtagData.topHashtags.slice(0, 5).map((tag, index) => (
                        <span
                          key={tag.tag}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{
                            background: index === 0 ? 'var(--neon-pink)' :
                                        index === 1 ? 'var(--neon-cyan)' :
                                        index === 2 ? 'var(--neon-lime)' :
                                        'var(--bg-elevated)',
                            color: index < 3 ? 'white' : 'var(--text-secondary)'
                          }}
                        >
                          {tag.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center mt-auto pt-6">
                <p className="text-[var(--text-muted)] text-xs">
                  tiktok-wrapped.app
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download button */}
        <motion.div variants={itemVariants} className="text-center">
          <button
            onClick={downloadCard}
            disabled={isGenerating}
            className="btn-neon btn-neon-pink inline-flex items-center gap-3"
          >
            {isGenerating ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Genererer...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Last ned bilde
              </>
            )}
          </button>

          <p className="text-[var(--text-muted)] text-sm mt-4">
            Perfekt for Instagram Stories, TikTok eller Snapchat
          </p>
        </motion.div>

        {/* Share tips */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <div className="flex justify-center gap-4">
            <div className="glass-card px-4 py-3 text-center">
              <p className="text-2xl mb-1">📱</p>
              <p className="text-[var(--text-muted)] text-xs">Del på Stories</p>
            </div>
            <div className="glass-card px-4 py-3 text-center">
              <p className="text-2xl mb-1">🎵</p>
              <p className="text-[var(--text-muted)] text-xs">Post på TikTok</p>
            </div>
            <div className="glass-card px-4 py-3 text-center">
              <p className="text-2xl mb-1">💬</p>
              <p className="text-[var(--text-muted)] text-xs">Send til venner</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ShareSlide;
