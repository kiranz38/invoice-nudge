from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.config import settings
from src.database import get_session
from src.models.user import User
from src.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut, UserUpdate, ChangePasswordRequest
from src.services.auth_service import hash_password, create_token, verify_password
from src.api.dependencies import get_current_user

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=TokenResponse)
async def register_user(
    register_request: RegisterRequest,
    db: AsyncSession = Depends(get_session),
):
    if await db.scalar(select(User).where(User.email == register_request.email)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed_password = hash_password(register_request.password)
    user = User(
        email=register_request.email,
        password_hash=hashed_password,
        name=register_request.name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_token(user.id)
    return TokenResponse(access_token=token, token_type="bearer")


@router.post("/login", response_model=TokenResponse)
async def login_user(
    login_request: LoginRequest,
    db: AsyncSession = Depends(get_session),
):
    user = await db.scalar(select(User).where(User.email == login_request.email))
    if not user or not verify_password(login_request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_token(user.id)
    return TokenResponse(access_token=token, token_type="bearer")


@router.get("/me", response_model=UserOut)
async def get_current_user_profile(user: User = Depends(get_current_user)):
    return user


@router.put("/me", response_model=UserOut)
async def update_user_profile(
    user_update: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if user_update.name:
        user.name = user_update.name
    if user_update.business_name:
        user.business_name = user_update.business_name
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_user_password(
    change_password_request: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if not verify_password(change_password_request.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid current password")
    hashed_password = hash_password(change_password_request.new_password)
    user.password_hash = hashed_password
    await db.commit()
    await db.refresh(user)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    await db.delete(user)
    await db.commit()