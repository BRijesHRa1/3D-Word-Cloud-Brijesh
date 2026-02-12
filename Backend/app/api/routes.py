from fastapi import APIRouter, HTTPException
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.crawler import fetch_html
from app.services.extractor import extract_text
from app.services.nlp import extract_keywords

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"ok": True}


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_url(request: AnalyzeRequest):
    """Fetch article from URL, extract text, and return TF-IDF keywords."""

    # Fetch the page
    try:
        html = fetch_html(request.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ConnectionError as e:
        raise HTTPException(status_code=502, detail=str(e))

    # Pull out the article text
    try:
        text = extract_text(html)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Run keyword extraction
    try:
        keywords = extract_keywords(text)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return AnalyzeResponse(words=keywords)
