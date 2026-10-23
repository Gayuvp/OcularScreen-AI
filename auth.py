from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

import models
from database import get_db

from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# PASSWORD HASHING
# ==========================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# ==========================================
# JWT CONFIGURATION
# ==========================================

SECRET_KEY = "ocularscreenai_secret_key_2026"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ==========================================
# REGISTER REQUEST
# ==========================================

class RegisterRequest(BaseModel):

    name: str

    email: EmailStr

    password: str


# ==========================================
# LOGIN REQUEST
# ==========================================

class LoginRequest(BaseModel):

    email: EmailStr

    password: str


# ==========================================
# CREATE ACCESS TOKEN
# ==========================================

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# ==========================================
# REGISTER API
# ==========================================

@router.post("/register")
def register_user(
    user: RegisterRequest,
    db: Session = Depends(get_db)
):

    # Check if email already exists
    existing_user = db.query(
        models.User
    ).filter(
        models.User.email == user.email
    ).first()


    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )


    # Hash password
    hashed_password = pwd_context.hash(
        user.password
    )


    # Create user
    new_user = models.User(

        name=user.name,

        email=user.email,

        password_hash=hashed_password
    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    return {

        "success": True,

        "message": "User registered successfully!",

        "user": {

            "id": new_user.id,

            "name": new_user.name,

            "email": new_user.email

        }

    }


# ==========================================
# LOGIN API
# ==========================================

@router.post("/login")
def login_user(
    user: LoginRequest,
    db: Session = Depends(get_db)
):

    # Find user by email
    existing_user = db.query(
        models.User
    ).filter(
        models.User.email == user.email
    ).first()


    # Check whether user exists
    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )


    # Verify password
    password_correct = pwd_context.verify(
        user.password,
        existing_user.password_hash
    )


    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )


    # Create JWT token
    access_token = create_access_token(
        {
            "sub": str(existing_user.id),
            "email": existing_user.email
        }
    )


    return {

        "success": True,

        "message": "Login successful!",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {

            "id": existing_user.id,

            "name": existing_user.name,

            "email": existing_user.email

        }

    }