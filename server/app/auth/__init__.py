"""
Authentication module for clean JWT handling
"""
from .dependencies import get_current_user, get_current_user_optional, CurrentUser

__all__ = ["get_current_user", "get_current_user_optional", "CurrentUser"]
