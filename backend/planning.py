from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api", tags=["Planning"])

class PlanRequest(BaseModel):
    account_id: int
    monthly_shortfall: float
    runway_months: float
    buffer_left: float

class FinancialPlanResponse(BaseModel):
    urgency_level: str  # e.g., "Critical", "Moderate", "Secure"
    recommended_actions: List[str]
    target_buffer: float
    suggested_monthly_savings: float

@router.post("/plan", response_model=FinancialPlanResponse)
def generate_personalized_plan(payload: PlanRequest):
    """Generates an automated, personalized financial resilience plan based on stress test metrics."""
    try:
        # Determine urgency based on runway
        if payload.runway_months < 3:
            urgency_level = "Critical"
            actions = [
                "Immediately pause non-essential subscription services and discretionary spending.",
                "Contact utility providers or lenders to discuss temporary hardship deferrals.",
                "Explore short-term income replacement or gig opportunities to cover the monthly shortfall."
            ]
        elif payload.runway_months < 6:
            urgency_level = "Moderate"
            actions = [
                "Aim to cut discretionary dining and entertainment spending by 20%.",
                "Redirect savings toward rebuilding your emergency buffer.",
                "Review monthly recurring bills for cheaper alternatives."
            ]
        else:
            urgency_level = "Secure"
            actions = [
                "Maintain your current healthy buffer and automated savings habit.",
                "Consider allocating excess buffer cash into high-yield savings or investments."
            ]

        # Calculate target buffer and monthly savings target
        target_buffer = payload.monthly_shortfall * 6 if payload.monthly_shortfall > 0 else 5000.0
        suggested_monthly_savings = max(100.0, payload.monthly_shortfall * 0.2)

        return {
            "urgency_level": urgency_level,
            "recommended_actions": actions,
            "target_buffer": round(target_buffer, 2),
            "suggested_monthly_savings": round(suggested_monthly_savings, 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))