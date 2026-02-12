import { useState, type FormEvent } from "react";
import { Link2, ArrowRight, X } from "lucide-react";
import { SAMPLE_URLS } from "../config/constants";
import { motion } from "framer-motion";
import Loader from "./Loader";

interface Props {
  onSubmit: (url: string) => void;
  loading: boolean;
  minimized: boolean;
  onReset: () => void;
}

export default function UrlInput({ onSubmit, loading, minimized, onReset }: Props) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  };

  const handleSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    onSubmit(sampleUrl);
  };

  return (
    <motion.div
      layout
      className={`relative w-full mx-auto transition-all ${
        minimized
          ? "bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 rounded-full py-2 px-3 flex items-center justify-between backdrop-blur-xl border shadow-lg max-w-[200px]"
          : "glass-panel p-1.5 md:p-2 max-w-2xl"
      }`}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {minimized ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center w-full gap-2 min-w-0"
        >
          <Link2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span className="text-sm text-[var(--text-primary)] truncate flex-1 font-medium text-center">
            {url ? new URL(url).hostname : "Analyzing..."}
          </span>
          <button
            onClick={onReset}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors shrink-0"
            title="Reset"
          >
            <X className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col w-full"
        >
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[var(--text-secondary)] pointer-events-none">
              <Link2 className="w-5 h-5 opacity-60" />
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a news article URL..."
                className="w-full bg-transparent border-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] pl-12 pr-4 py-4 text-lg focus:ring-0 focus:outline-none font-light tracking-wide rounded-xl"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="hidden sm:flex items-center gap-2 btn-primary px-6 py-2 my-1.5 mr-1.5 text-sm font-medium min-w-[120px] justify-center"
              >
                {loading ? <Loader /> : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Mobile submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !url.trim()}
            className="sm:hidden w-full btn-primary py-3 mt-2 rounded-xl flex justify-center items-center gap-2"
          >
            {loading ? <Loader /> : "Analyze"}
          </button>

          {/* Quick-pick URLs */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 mb-2 px-2 pb-2">
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium py-1.5">
              Try:
            </span>
            {SAMPLE_URLS.map((sample) => (
              <button
                key={sample.url}
                onClick={() => handleSample(sample.url)}
                disabled={loading}
                className="chip hover:text-[var(--text-primary)] transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
