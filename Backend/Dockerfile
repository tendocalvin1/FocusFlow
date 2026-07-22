
# Base Image
FROM python:3.12-slim


# Environment Variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1


# Working Directory
WORKDIR /app


# Install System Packages
RUN apt-get update && \
    apt-get install -y \
        gcc \
        libpq-dev \
        netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*


# Install Python Dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt


# Copy Project
COPY . .


# Make Entrypoint Executable
RUN chmod +x entrypoint.sh


# Create Non-Root User
RUN addgroup --system app && \
    adduser --system --ingroup app app

RUN chown -R app:app /app

USER app


# Expose Gunicorn Port
EXPOSE 8000


# Container Startup
ENTRYPOINT ["./entrypoint.sh"]