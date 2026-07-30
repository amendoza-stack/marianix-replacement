from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    username_or_email: str = Field(..., description="Username o Email del usuario", example="anamendoza")
    password: str = Field(..., description="Contraseña de acceso", example="Lafken26")

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 3600
    user_info: "UserSummary"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class UserSummary(BaseModel):
    id: int
    username: str
    email: str
    nombre_completo: str
    roles: List[str]
    permisos: List[str]

    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    message: str
