"""
NLP module.
Uses TF-IDF with NLTK stop words to extract keywords from article text.
"""

import nltk
from sklearn.feature_extraction.text import TfidfVectorizer

# Download NLTK stop words (only runs once)
nltk.download("stopwords", quiet=True)
from nltk.corpus import stopwords

# Combine NLTK stop words with additional common news filler words
STOP_WORDS = set(stopwords.words("english")) | {
    # Common filler words in news articles
    "said", "also", "would", "could", "one", "two", "new",
    "like", "get", "even", "much", "many", "may", "us",
    "say", "says", "according", "told", "year", "years",
    # News site / webpage boilerplate
    "photo", "photos", "image", "images", "copyright",
    "newsletter", "subscribe", "sign", "signing", "log", "login",
    "advertisement", "cookie", "cookies", "privacy", "policy",
    "associated", "press", "reuters", "getty",
}

# Number of top keywords to return
TOP_N = 50


def extract_keywords(text: str) -> list[dict]:
    """
    Performs TF-IDF keyword extraction on the given text.

    Splits the text into sentence-like chunks to give TF-IDF
    multiple 'documents' to compare against, producing better
    term importance scores.

    Args:
        text: The cleaned article text to analyze.

    Returns:
        A list of dictionaries with 'word' and 'weight' keys,
        sorted by weight in descending order (top 50).
        Example: [{"word": "economy", "weight": 0.83}, ...]

    Raises:
        ValueError: If the text is too short to analyze.
    """
    if not text or len(text.split()) < 10:
        raise ValueError("Text is too short for meaningful keyword extraction.")

    # Split text into sentence-like chunks for TF-IDF
    # TF-IDF works best with multiple documents to compare
    sentences = [s.strip() for s in text.replace("!", ".").replace("?", ".").split(".") if s.strip()]

    # Ensure we have enough chunks
    if len(sentences) < 2:
        sentences = [text[i:i+200] for i in range(0, len(text), 200)]

    vectorizer = TfidfVectorizer(
        stop_words=list(STOP_WORDS),
        max_features=500,
        min_df=1,
        max_df=0.85,
        ngram_range=(1, 2),
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z]{2,}\b",
    )

    tfidf_matrix = vectorizer.fit_transform(sentences)
    feature_names = vectorizer.get_feature_names_out()

    # Average TF-IDF scores across all sentences
    avg_scores = tfidf_matrix.mean(axis=0).A1

    # Build word-weight pairs and sort by weight
    word_weights = [
        {"word": word, "weight": round(float(score), 4)}
        for word, score in zip(feature_names, avg_scores)
        if score > 0
    ]
    word_weights.sort(key=lambda x: x["weight"], reverse=True)

    return word_weights[:TOP_N]
