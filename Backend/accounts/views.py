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

# register
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])

def register_view(request):
    if request.metthod == "GET":
        serialiser = RegisterSerializer(users, many=True)
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    else:
        data = request.data
        serialiser = RegisterSerializer(data = data)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def register_details_view(request, pk):
    try:
        user = User.objects.get(pk = pk)
    except user.DoesNotExist as e:
        return Response({"msg": f"Error {e}"}, status= status.HTTP_404_NOT_FOUND)
    
    
    if request.method == "GET":
        serialiser = RegisterSerializer(user)
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serialiser = RegisterSerializer(user, data = request.data, partial = True)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_202_ACCEPTED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    else:
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


# login
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def login_view(request):
    if request.metthod == "GET":
        serialiser = UserSerializer(users, many=True)
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    else:
        data = request.data
        serialiser = UserSerializer(data = data)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def login_detail_view(request, pk):
    try:
        user = User.objects.get(pk = pk)
    except user.DoesNotExist as e:
        return Response({"msg": f"Error {e}"}, status= status.HTTP_404_NOT_FOUND)
    
    
    if request.method == "GET":
        serialiser = UserSerializer(user)
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serialiser = UserSerializer(user, data = request.data, partial = True)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_202_ACCEPTED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    


# logout 
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    if request.metthod == "GET":
        serialiser = UserSerializer(users, many=True)
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    else:
        data = request.data
        serialiser = UserSerializer(data = data)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def logout_detail_view(request, pk):
    try:
        user = User.objects.get(pk = pk)
    except user.DoesNotExist as e:
        return Response({"msg": f"Error {e}"}, status= status.HTTP_404_NOT_FOUND)
    
    
    if request.method == "GET":
        serialiser = UserSerializer(user)
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serialiser = UserSerializer(user, data = request.data, partial = True)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_202_ACCEPTED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
     

