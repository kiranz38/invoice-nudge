from pydantic_settings import BaseSettings
from datetime import timedelta

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://user:pass@localhost:5432/db"
    secret_key: str = "change-me"
    resend_api_key: str = ""
    from_email: str = "invoicenudge@jumproo.ai"
    frontend_url: str = "http://localhost:3000"
    allowed_origins: str = "http://localhost:3000"
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_pro_price_id: str = ""
    stripe_enterprise_price_id: str = ""
    product_name: str = "InvoiceNudge"
    product_version: str = "1.0.0"
    model_config = {"env_file": ".env"}

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

settings = Settings()