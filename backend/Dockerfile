FROM python:3.11

# Install Poetry
RUN pip install --upgrade pip \
  && pip install poetry

# Set work directory
WORKDIR /app

# Copy only the poetry config first (for better layer caching)
COPY pyproject.toml poetry.lock* /app/

# Install dependencies
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi --no-root

# Copy the rest of the code
COPY ./backend /app

# Expose and run
EXPOSE 8000
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
