from datetime import datetime, timedelta
import bcrypt
import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from src.config import settings
from src.models.user import User
from src.schemas.auth import RegisterRequest, TokenResponse


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_token(user_id: str) -> str:
    return jwt.encode(
        {"sub": user_id, "exp": datetime.utcnow() + timedelta(hours=24), "iat": datetime.utcnow()},
        settings.secret_key,
        algorithm="HS256",
    )


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.secret_key, algorithms=["HS256"])


async def register_user(db: AsyncSession, data: RegisterRequest) -> User:
    if await db.scalar(select(User).where(User.email == data.email)):
        raise HTTPException(status_code=409, detail="Email already registered")
    hashed_password = hash_password(data.password)
    user = User(email=data.email, password_hash=hashed_password, name=data.name)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def login_user(db: AsyncSession, email: str, password: str) -> TokenResponse:
    user = await db.scalar(select(User).where(User.email == email))
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user.id)
    return TokenResponse(access_token=token, token_type="bearer")


async def change_password(db: AsyncSession, user: User, current_pw: str, new_pw: str) -> None:
    if not verify_password(current_pw, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid current password")
    user.password_hash = hash_password(new_pw)
    db.add(user)
    await db.commit()
    await db.refresh(user)