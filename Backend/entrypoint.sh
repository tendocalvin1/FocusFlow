#!/bin/sh

set -e

echo "=================================="
echo "Starting FocusFlow Backend..."
echo "=================================="

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Setting up Social Apps & Sites..."
python manage.py setup_social_apps

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."

exec gunicorn Backend.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --capture-output \
    --worker-tmp-dir /dev/shm