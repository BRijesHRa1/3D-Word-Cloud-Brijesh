from bs4 import BeautifulSoup

# These tags are just page chrome, not article content
NOISE_TAGS = ["script", "style", "nav", "footer", "header", "aside", "noscript", "iframe"]


def extract_text(html: str) -> str:
    """
    Pull meaningful text from HTML. Tries <article> first then fallback to collecting all <p> tags.
    """
    soup = BeautifulSoup(html, "html.parser")

    # Strip out noise first
    for tag in soup.find_all(NOISE_TAGS):
        tag.decompose()

    # Most news sites wrap the actual content in <article>
    article = soup.find("article")
    if article:
        text = article.get_text(separator=" ", strip=True)
        if len(text) > 100:
            return text

    # Fallback: just grab all paragraphs
    paragraphs = soup.find_all("p")
    text = " ".join(p.get_text(strip=True) for p in paragraphs)

    if not text or len(text) < 50:
        raise ValueError("Could not extract meaningful text from the page.")

    return text
