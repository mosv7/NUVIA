FROM python:3.13-slim
WORKDIR /service
RUN pip install --no-cache-dir uv==0.12.15
COPY apps/ai-service/pyproject.toml apps/ai-service/uv.lock ./
ARG AI_INFERENCE=false
RUN if [ "$AI_INFERENCE" = "true" ]; then uv sync --locked --no-dev --extra inference; else uv sync --locked --no-dev; fi
COPY apps/ai-service/app app
EXPOSE 8000
CMD ["uv", "run", "--no-sync", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
