from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models


router = APIRouter(
    prefix="/history",
    tags=["Analysis History"]
)


# ==========================================
# GET USER ANALYSIS HISTORY
# ==========================================

@router.get("/{user_id}")
def get_analysis_history(
    user_id: int,
    db: Session = Depends(get_db)
):

    # Check whether user exists
    user = db.query(
        models.User
    ).filter(
        models.User.id == user_id
    ).first()


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )


    # Get all predictions of this user
    history = db.query(
        models.PredictionHistory
    ).filter(
        models.PredictionHistory.user_id == user_id
    ).order_by(
        models.PredictionHistory.created_at.desc()
    ).all()


    # Prepare response
    history_data = []


    for item in history:

        history_data.append({

            "id": item.id,

            "disease_type": item.disease_type,

            "prediction": item.prediction,

            "confidence": item.confidence,

            "image_name": item.image_name,

            "created_at": item.created_at

        })


    return {

        "success": True,

        "total": len(history_data),

        "history": history_data

    }