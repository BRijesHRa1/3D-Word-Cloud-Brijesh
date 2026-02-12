from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    url: str


class WordCloudItem(BaseModel):
    word: str
    weight: float


class AnalyzeResponse(BaseModel):
    words: list[WordCloudItem]
