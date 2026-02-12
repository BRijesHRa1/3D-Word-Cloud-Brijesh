import requests
from requests.exceptions import RequestException

# Pretend to be a real browser as some news sites block default python requests
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def fetch_html(url: str) -> str:
    """Basic function to fetch raw HTML from a URL and raise error on invalid URL or request failure."""

    if not url or not url.startswith(("http://", "https://")):
        raise ValueError(f"Invalid URL: '{url}'. Must start with http:// or https://")

    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        return response.text
    except RequestException as e:
        raise ConnectionError(f"Failed to fetch URL: {e}") from e
