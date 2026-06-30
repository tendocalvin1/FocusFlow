from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .serialisers import *
from .models import *
from datetime import date, timedelta
from django.utils import timezone

# Create your views here.
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])

def register_view(request):
    
