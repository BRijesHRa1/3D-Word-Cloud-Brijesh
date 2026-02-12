from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="3D Word Cloud Brijesh",
    description="Crawl news articles and extract topic keywords via TF-IDF :)",
    version="1.0.0",
)

# Allow all origins so the React frontend can talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
