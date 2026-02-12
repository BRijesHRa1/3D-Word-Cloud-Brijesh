# 3D Word Cloud Generator

A React + FastAPI app that extracts keywords from news articles and visualizes them in an interactive 3D sphere.

Built this to experiment with `react-three-fiber` and natural language processing.

## Quick Start (macOS)

I wrote a small script to handle the setup for both frontend and backend.

```bash
# Installs dependencies & starts both servers
./setup.sh
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000

## Tech Stack

**Frontend**

- **React (Vite)** – Fast and simple.
- **Three.js / React Three Fiber** – For the 3D scene.
- **Drei** – Useful helpers like `OrbitControls` and `Html` tooltips.
- **Tailwind CSS** – Styling and glassmorphism effects.
- **Framer Motion** – Smooth UI transitions.

**Backend**

- **FastAPI** – Super fast Python API.
- **BeautifulSoup4** – Scraping article content.
- **Scikit-learn (TF-IDF)** – Extracting keywords.
- **NLTK** – Filtering out stopwords.

## Notes

- The keyword extraction logic (`nlp.py`) uses TF-IDF on sentence chunks to find relevant terms.
- I added a custom `stop_words` list to filter out common news site noise like "subscribe", "photo", "advertisement", etc.
- Dark mode support is built-in (toggle in top-right).

---

Demo Video
https://github.com/BRijesHRa1/3D-Word-Cloud-Brijesh/issues/1#issue-3929583457
