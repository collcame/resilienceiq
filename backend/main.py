from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import simulation
import planning  # 1. Import your new planning module

app = FastAPI(title="ResilienceIQ API", version="0.1.0")

# Configure CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Include routers
app.include_router(simulation.router)
app.include_router(planning.router)

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}