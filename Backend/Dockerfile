# use the official python image
FROM python:3.12-slim

# Prevent python from writing .pyc file
ENV PYTHONDONTWRITEBYTECODE=1

# show python output immediately
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# copy dependencies
COPY requirements.txt .

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt


# copy the rest of the project
COPY . .


# Expose Django's port
EXPOSE 8000


# Start the django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]



