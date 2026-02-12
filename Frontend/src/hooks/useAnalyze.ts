import { useState } from "react";
import { API_BASE_URL } from "../config/constants";
import type { AnalyzeResponse, WordCloudItem } from "../types";

export function useAnalyze() {
  const [words, setWords] = useState<WordCloudItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (url: string) => {
    setLoading(true);
    setError(null);
    setWords([]);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Request failed (${res.status})`);
      }

      const data: AnalyzeResponse = await res.json();
      setWords(data.words);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { words, loading, error, analyze };
}
