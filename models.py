from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


# ==================================================
# USER MODEL
# ==================================================

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Relationship with prediction history
    predictions = relationship(
        "PredictionHistory",
        back_populates="user"
    )


# ==================================================
# PREDICTION HISTORY MODEL
# ==================================================

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Disease selected for screening
    disease_type = Column(
        String,
        nullable=False
    )

    # AI prediction result
    prediction = Column(
        String,
        nullable=False
    )

    # AI confidence percentage
    confidence = Column(
        Float,
        nullable=False
    )

    # Uploaded image filename
    image_name = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Relationship with User
    user = relationship(
        "User",
        back_populates="predictions"
    )