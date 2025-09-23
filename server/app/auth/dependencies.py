"""
Authentication dependencies for clean JWT handling
"""
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import jwt
import os
from datetime import datetime

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"

# Security scheme
security = HTTPBearer(auto_error=False)

class CurrentUser(BaseModel):
    user_id: str
    email: str
    full_name: Optional[str] = None
    
    class Config:
        from_attributes = True

def verify_token(credentials: HTTPAuthorizationCredentials) -> dict:
    """Verify JWT token and return user info"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        return {"user_id": user_id, "email": email}
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> CurrentUser:
    """
    Dependency to get current authenticated user
    Usage: current_user: CurrentUser = Depends(get_current_user)
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user_data = verify_token(credentials)
    
    # In production, you might want to fetch additional user data from database
    return CurrentUser(
        user_id=user_data["user_id"],
        email=user_data["email"],
        full_name=None  # Could fetch from database
    )

async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[CurrentUser]:
    """
    Optional authentication - returns None if no token provided
    Usage: current_user: Optional[CurrentUser] = Depends(get_current_user_optional)
    """
    if not credentials:
        return None
    
    try:
        user_data = verify_token(credentials)
        return CurrentUser(
            user_id=user_data["user_id"],
            email=user_data["email"],
            full_name=None
        )
    except HTTPException:
        return None
