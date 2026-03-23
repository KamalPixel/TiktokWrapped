import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseZipFile, parseJsonFiles } from '../utils/parser';
import { COLORS } from '../constants';
import { useMousePosition } from '../hooks/useMousePosition';

const Upload = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ stage: '', progress: 0 });
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const mousePosition = useMousePosition();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(async (files) => {
    setIsLoading(true);
    setError(null);

    try {
      let data;
      const zipFile = Array.from(files).find(f =>
        f.name.endsWith('.zip') || f.type === 'application/zip'
      );

      if (zipFile) {
        data = await parseZipFile(zipFile, setProgress);
      } else {
        const jsonFiles = Array.from(files).filter(f =>
          f.name.endsWith('.json') || f.type === 'application/json'
        );
        if (jsonFiles.length === 0) throw new Error('Ingen gyldige filer funnet.');
        data = await parseJsonFiles(jsonFiles, setProgress);
      }

      if (data.stats.totalVideos === 0 && data.stats.totalLikes === 0) {
        throw new Error('Ingen TikTok-data funnet.');
      }
      onDataLoaded(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files?.length) processFiles(files);
  }, [processFiles]);

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files?.length) processFiles(files);
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-[1000px] h-[1000px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.pink}20 0%, transparent 60%)`,
            filter: 'blur(100px)',
            left: '60%',
            top: '-20%',
            x: mousePosition.x * -30,
            y: mousePosition.y * -30,
          }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.aqua}18 0%, transparent 60%)`,
            filter: 'blur(100px)',
            left: '-20%',
            bottom: '-10%',
            x: mousePosition.x * 40,
            y: mousePosition.y * 40,
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.pink}10 0%, transparent 60%)`,
            filter: 'blur(80px)',
            right: '10%',
            bottom: '20%',
            x: mousePosition.x * -20,
            y: mousePosition.y * -20,
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main layout - Split design */}
      <div className="relative h-full flex flex-col lg:flex-row">
        {/* Left side - Branding */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Year tag */}
            <motion.div
              className="inline-flex items-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.aqua})` }}
              />
              <span className="text-gray-500 font-mono text-sm tracking-widest">2025 EDITION</span>
            </motion.div>

            {/* Main title */}
            <h1 className="text-6xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.85]">
              <span className="block text-white">TikTok</span>
              <span
                className="block"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.pink} 0%, ${COLORS.aqua} 100%)`,
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient-flow 4s ease infinite',
                }}
              >
                Wrapped
              </span>
            </h1>

            {/* Tagline */}
            <motion.p
              className="mt-8 text-xl lg:text-2xl text-gray-400 max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Oppdag historien bak scrollingen din.
              <br />
              <span className="text-gray-600">Alt prosesseres lokalt. Ingenting deles.</span>
            </motion.p>

            {/* Stats preview */}
            <motion.div
              className="mt-12 flex gap-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { label: 'Videoer', icon: '▶' },
                { label: 'Timer', icon: '◷' },
                { label: 'Skapere', icon: '★' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl mb-2 opacity-30">{stat.icon}</div>
                  <div className="text-gray-600 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right side - Upload interface */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              x: mousePosition.x * -10,
              y: mousePosition.y * -10,
            }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-20"
                >
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    {/* Outer ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: '3px solid transparent',
                        borderTopColor: COLORS.pink,
                        borderRightColor: COLORS.pink,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Inner ring */}
                    <motion.div
                      className="absolute inset-3 rounded-full"
                      style={{
                        border: '3px solid transparent',
                        borderBottomColor: COLORS.aqua,
                        borderLeftColor: COLORS.aqua,
                      }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Center */}
                    <div className="absolute inset-6 rounded-full bg-black flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{progress.progress}%</span>
                    </div>
                  </div>
                  <p className="text-xl text-gray-400">
                    {progress.stage === 'loading' && 'Leser fil...'}
                    {progress.stage === 'parsing' && 'Parser TikTok-data...'}
                    {progress.stage === 'processing' && 'Behandler videoer...'}
                    {progress.stage === 'analyzing' && 'Knuser tallene dine...'}
                    {progress.stage === 'complete' && 'Klar!'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Upload card */}
                  <motion.label
                    htmlFor="file-input"
                    className="block cursor-pointer group"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="relative rounded-3xl p-12 transition-all duration-500 border-2 border-dashed"
                      style={{
                        borderColor: isDragging ? COLORS.pink : '#222',
                        background: isDragging ? `${COLORS.pink}08` : 'rgba(255,255,255,0.02)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: isDragging
                          ? `0 0 80px ${COLORS.pink}30, inset 0 0 80px ${COLORS.pink}05`
                          : '0 20px 60px rgba(0,0,0,0.4)',
                      }}
                    >
                      <input
                        id="file-input"
                        type="file"
                        accept=".zip,.json"
                        multiple
                        onChange={handleFileInput}
                        className="hidden"
                      />

                      {/* Icon */}
                      <motion.div
                        className="flex justify-center mb-8"
                        animate={isDragging ? { scale: 1.1, y: -10 } : { y: [0, -8, 0] }}
                        transition={isDragging ? {} : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                          <defs>
                            <linearGradient id="uploadGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={COLORS.pink} />
                              <stop offset="100%" stopColor={COLORS.aqua} />
                            </linearGradient>
                          </defs>
                          {/* Folder base */}
                          <path
                            d="M15 30 L15 80 Q15 85 20 85 L80 85 Q85 85 85 80 L85 40 Q85 35 80 35 L50 35 L42 25 L20 25 Q15 25 15 30Z"
                            fill="none"
                            stroke="url(#uploadGrad)"
                            strokeWidth="2.5"
                          />
                          {/* Arrow */}
                          <motion.g
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <path
                              d="M50 75 L50 50"
                              stroke="url(#uploadGrad)"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            <path
                              d="M38 60 L50 48 L62 60"
                              stroke="url(#uploadGrad)"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.g>
                        </svg>
                      </motion.div>

                      {/* Text */}
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold text-white mb-3">
                          {isDragging ? 'Slipp for å laste opp' : 'Slipp TikTok-data her'}
                        </h3>
                        <p className="text-gray-500 text-lg">
                          eller klikk for å velge fil
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-gray-400 text-sm">
                          <span>Støtter</span>
                          <span style={{ color: COLORS.aqua }}>.json</span>
                          <span>&</span>
                          <span style={{ color: COLORS.pink }}>.zip</span>
                        </div>
                      </div>
                    </div>
                  </motion.label>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-4 rounded-xl text-center"
                        style={{
                          background: `${COLORS.pink}15`,
                          border: `1px solid ${COLORS.pink}30`,
                          color: COLORS.pink,
                        }}
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Help button */}
                  <div className="mt-8">
                    <motion.button
                      onClick={() => setShowHelp(!showHelp)}
                      className="w-full px-6 py-5 rounded-2xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {showHelp ? 'Lukk' : 'Hvordan få tak i TikTok-data?'}
                    </motion.button>
                  </div>

                  {/* Help panel */}
                  <AnimatePresence>
                    {showHelp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-gray-800">
                          <h4 className="text-white font-semibold mb-4 text-lg">Slik eksporterer du TikTok-data:</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { n: '01', t: 'Åpne TikTok-appen', c: COLORS.pink },
                              { n: '02', t: 'Gå til Innstillinger', c: COLORS.pink },
                              { n: '03', t: 'Velg "Konto"', c: COLORS.pink },
                              { n: '04', t: 'Velg "Last ned data"', c: COLORS.aqua },
                              { n: '05', t: 'Velg JSON-format', c: COLORS.aqua },
                            ].map((step) => (
                              <div key={step.n} className="flex items-start gap-3">
                                <span className="font-mono font-bold" style={{ color: step.c }}>{step.n}</span>
                                <span className="text-gray-400">{step.t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: COLORS.aqua }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-gray-600 text-sm">100% klient-side prosessering</span>
        </div>
        <div className="text-gray-600 text-sm">
          Laget med <span style={{ color: COLORS.pink }}>♥</span> for personvern
        </div>
      </motion.div>

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Upload;
