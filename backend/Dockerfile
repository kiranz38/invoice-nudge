FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir .

COPY start.py .
COPY alembic.ini .
COPY alembic/ alembic/
COPY src/ src/

EXPOSE 8000

CMD ["sh", "-c", "python start.py && uvicorn src.api.app:app --host 0.0.0.0 --port ${PORT:-8000}"]
