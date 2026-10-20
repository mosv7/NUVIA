FROM python:3.13-slim
WORKDIR /service
RUN pip install --no-cache-dir uv==0.12.15
COPY apps/ai-service/pyproject.toml apps/ai-service/uv.lock ./
RUN uv sync --locked --no-dev
COPY apps/ai-service/app app
EXPOSE 8000
CMD ["uv", "run", "--no-sync", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
