from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class UserOut(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    business_name: Optional[str] = None
    plan: str
    created_at: Optional[datetime] = None

    model_config = {'from_attributes': True}


class UserUpdate(BaseModel):
    name: str | None = None
    business_name: str | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)