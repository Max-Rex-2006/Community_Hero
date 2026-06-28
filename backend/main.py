from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ai import router as ai_router

app = FastAPI(title="Community Hero API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Community Hero API is running"}

app.include_router(ai_router)