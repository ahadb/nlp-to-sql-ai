import os
from typing import Optional

class EnvironmentConfig:
    """Simple environment configuration loader"""
    
    def __init__(self):
        self.environment = os.getenv("ENVIRONMENT", "dev")
        self.load_environment_file()
    
    def load_environment_file(self):
        """Load environment-specific .env file"""
        # First load the base .env file
        if os.path.exists(".env"):
            self._load_env_file(".env")
        
        # Then load environment-specific file to override
        env_file = f".env.{self.environment}"
        if os.path.exists(env_file):
            self._load_env_file(env_file)
    
    def _load_env_file(self, file_path: str):
        """Load environment variables from a specific file"""
        with open(file_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value
    
    @property
    def is_dev(self) -> bool:
        return self.environment == "dev"
    
    @property
    def is_prod(self) -> bool:
        return self.environment == "prod"
    
    @property
    def supabase_url(self) -> Optional[str]:
        return os.getenv("SUPABASE_URL")
    
    @property
    def supabase_anon_key(self) -> Optional[str]:
        return os.getenv("SUPABASE_ANON_KEY")
    
    @property
    def supabase_service_role_key(self) -> Optional[str]:
        return os.getenv("SUPABASE_SERVICE_KEY")
    
    @property
    def database_url(self) -> str:
        return os.getenv("DATABASE_URL", "sqlite:///./nlp_sql.db")
    
    @property
    def openai_api_key(self) -> Optional[str]:
        return os.getenv("OPENAI_API_KEY")
    
    @property
    def debug(self) -> bool:
        return os.getenv("DEBUG", "false").lower() == "true"

# Global config instance
env_config = EnvironmentConfig()
