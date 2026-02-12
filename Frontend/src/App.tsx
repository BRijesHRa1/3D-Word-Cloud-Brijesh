import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import UrlInput from "./components/UrlInput";
import WordCloud from "./components/WordCloud/WordCloud";
import Loader from "./components/Loader";
import { useAnalyze } from "./hooks/useAnalyze";
import { MousePointer2 } from "lucide-react";

const WORD_COUNTS = [10, 25, 30, 50] as const;

function AppContent() {
  const { words, loading, error, analyze } = useAnalyze();
  const [wordLimit, setWordLimit] = useState(30);

  const showCloud = words.length > 0 || loading;
  const visibleWords = words.slice(0, wordLimit);

  return (
    <Layout>
      <div className={`relative w-full h-full min-h-screen flex flex-col ${!showCloud ? "items-center justify-center" : ""}`}>

        <motion.div
          layout
          className={`z-50 w-full flex flex-col ${showCloud ? "absolute top-6 left-6 items-start max-w-[400px]" : "items-center max-w-4xl px-4"}`}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <AnimatePresence>
            {!showCloud && (
              <motion.div
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                className="text-center mb-8"
              >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[var(--text-primary)] mb-4 transition-colors duration-500">
                  3D Word Cloud
                </h1>
                <p className="text-lg text-[var(--text-secondary)] font-light transition-colors duration-500">
                  Visualize the topics in <span className="text-purple-500 font-medium">real-time 3D.</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full">
            <UrlInput
              onSubmit={analyze}
              loading={loading}
              minimized={showCloud}
              onReset={() => window.location.reload()}
            />
          </div>

          <AnimatePresence>
            {!showCloud && error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center max-w-xl mx-auto backdrop-blur-md w-full"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Centered loader while fetching */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="scale-150">
                <Loader />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D word cloud */}
        <AnimatePresence>
          {showCloud && !loading && (
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <WordCloud words={visibleWords} />

              {/* Word count pill selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 1.2 } }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-full glass-panel border border-[var(--glass-border)] shadow-lg"
              >
                {WORD_COUNTS.map((count) => (
                  <button
                    key={count}
                    onClick={() => setWordLimit(count)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
                      wordLimit === count
                        ? "bg-[var(--accent-primary)] text-white shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {count}
                  </button>
                ))}
                <span className="text-[10px] text-[var(--text-secondary)] pl-1 pr-2 uppercase tracking-wider">words</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 1 } }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[var(--text-secondary)] text-xs uppercase tracking-widest pointer-events-none transition-colors duration-500"
              >
                <MousePointer2 className="w-4 h-4" />
                <span>Drag to Rotate • Scroll to Zoom</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
