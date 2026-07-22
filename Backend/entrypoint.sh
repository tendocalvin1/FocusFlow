#!/bin/sh

set -e

echo "=================================="
echo "Starting FocusFlow Backend..."
echo "=================================="

echo "Waiting for PostgreSQL..."

until nc -z "$DB_HOST" "$DB_PORT"; do
    echo "Database unavailable..."
    sleep 2
done

echo "PostgreSQL is ready."

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."

exec gunicorn Backend.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -