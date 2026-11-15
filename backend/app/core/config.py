"""
Application Configuration Settings for IceToImpact Platform
"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "IceToImpact – Glacial Lake Monitoring & GLOF Analysis Platform"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///database/icetoimpact.db")
    OUTPUTS_DIR: str = os.getenv("OUTPUTS_DIR", "outputs")
    DATASETS_DIR: str = os.getenv("DATASETS_DIR", "DATASETS/dataset")
    MODELS_DIR: str = os.getenv("MODELS_DIR", "models")
    CORS_ORIGINS: list = ["*"]

    class Config:
        case_sensitive = True


settings = Settings()
