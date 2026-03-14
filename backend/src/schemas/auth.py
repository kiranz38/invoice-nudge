from pydantic import BaseModel, EmailStr, Field, model_validator
from datetime import datetime
from src.config import settings

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8)

    @model_validator(mode='before')
    def validate_email(cls, v):
        if v.lower() != v:
            raise ValueError('Email must be in lowercase')
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'

class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    business_name: str
    plan: str
    created_at: datetime

    model_config = {'from_attributes': True}

class UserUpdate(BaseModel):
    name: str | None = None
    business_name: str | None = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)

    @model_validator(mode='before')
    def validate_new_password(cls, v):
        if v.lower() == v:
            raise ValueError('New password must contain at least one uppercase letter')
        return v