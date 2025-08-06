import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # App settings
    APP_NAME: str = "NLP-to-SQL API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Database settings
    DB_NAME: str = os.getenv("DB_NAME", "")
    DB_USER: str = os.getenv("DB_USER", "")
    DB_PASS: str = os.getenv("DB_PASS", "")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "5432"))
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080"
    ]
    
    def __init__(self):
        # Add production domain if set
        if os.getenv("FRONTEND_URL"):
            self.ALLOWED_ORIGINS.append(os.getenv("FRONTEND_URL"))
    
    def validate(self):
        """Validate required settings are present"""
        required_vars = ["DB_NAME", "DB_USER", "OPENAI_API_KEY"]
        missing = [var for var in required_vars if not getattr(self, var)]
        
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

# Create settings instance
settings = Settings()
