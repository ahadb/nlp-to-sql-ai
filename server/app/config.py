"""
Configuration settings for QuantumSQL Backend
"""
import os
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    """Application settings"""
    
    # App Info
    APP_NAME: str = "QuantumSQL API"
    VERSION: str = "2.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    # Server Settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Database Settings (Local PostgreSQL)
    DB_NAME: str = os.getenv("DB_NAME", "quantumsql")
    DB_USER: str = os.getenv("DB_USER", "dev_user")
    DB_PASS: str = os.getenv("DB_PASS", "dev123")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "5432"))
    
    # OpenAI Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080"
    ]
    
    @property
    def database_url(self) -> str:
        """Get database connection URL"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    def validate(self) -> None:
        """Validate required settings"""
        required = ["DB_NAME", "DB_USER", "OPENAI_API_KEY"]
        missing = [var for var in required if not getattr(self, var)]
        
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

# Create settings instance
settings = Settings()
