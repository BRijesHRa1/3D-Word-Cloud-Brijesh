import nltk
from sklearn.feature_extraction.text import TfidfVectorizer

nltk.download("stopwords", quiet=True)
from nltk.corpus import stopwords

# NLTK's english stopwords + common news article filler
STOP_WORDS = set(stopwords.words("english")) | {
    "said", "also", "would", "could", "one", "two", "new",
    "like", "get", "even", "much", "many", "may", "us",
    "say", "says", "according", "told", "year", "years",
    # stuff that leaks in from news site chrome
    "photo", "photos", "image", "images", "copyright",
    "newsletter", "subscribe", "sign", "signing", "log", "login",
    "advertisement", "cookie", "cookies", "privacy", "policy",
    "associated", "press", "reuters", "getty",
}

TOP_N = 50


def extract_keywords(text: str) -> list[dict]:
    """Run TF-IDF on the article text and return the top keywords with scores."""

    if not text or len(text.split()) < 10:
        raise ValueError("Text is too short for meaningful keyword extraction.")

    # Split into sentences so TF-IDF has multiple docs to compare against
    sentences = [s.strip() for s in text.replace("!", ".").replace("?", ".").split(".") if s.strip()]

    # If the text is basically one giant sentence, chunk it manually
    if len(sentences) < 2:
        sentences = [text[i:i+200] for i in range(0, len(text), 200)]

    vectorizer = TfidfVectorizer(
        stop_words=list(STOP_WORDS),
        max_features=500,
        min_df=1,
        max_df=0.85,
        ngram_range=(1, 2),
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z]{2,}\b",  # 3+ letters, no numbers
    )

    tfidf_matrix = vectorizer.fit_transform(sentences)
    feature_names = vectorizer.get_feature_names_out()

    # Average scores across all sentences to get overall importance
    avg_scores = tfidf_matrix.mean(axis=0).A1

    word_weights = [
        {"word": word, "weight": round(float(score), 4)}
        for word, score in zip(feature_names, avg_scores)
        if score > 0
    ]
    word_weights.sort(key=lambda x: x["weight"], reverse=True)

    return word_weights[:TOP_N]
