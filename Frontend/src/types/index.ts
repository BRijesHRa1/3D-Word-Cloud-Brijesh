export interface WordCloudItem {
  word: string;
  weight: number;
}

export interface AnalyzeResponse {
  words: WordCloudItem[];
}
