from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI(
    title="ResilienceIQ API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "application": "ResilienceIQ"
    }

@app.get("/api/accounts/{account_id}", tags=["Accounts"])
def get_account_profile(account_id: int):
    file_path = os.path.join("data", "processed_profiles.csv")
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404, 
            detail="Processed profiles dataset not found. Please run data_pipeline.py first."
        )
    
    try:
        df = pd.read_csv(file_path)
        id_col = "client_id" if "client_id" in df.columns else "account_id"
        
        # Filter rows for this ID
        records = df[df[id_col] == account_id]
        
        if records.empty:
            raise HTTPException(status_code=404, detail=f"Account ID {account_id} not found.")
            
        # Convert to standard python objects, replacing NaNs with None safely
        clean_records = records.astype(object).where(pd.notnull(records), None).to_dict(orient="records")
        
        return clean_records
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")