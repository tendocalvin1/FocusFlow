"""
WSGI config for Backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""
# This file helps in deployment as the wsgi file is one of the files connected to Docker and helps
# in containerising the application

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")

application = get_wsgi_application()
