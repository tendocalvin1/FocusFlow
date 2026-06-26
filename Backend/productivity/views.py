from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .serialisers import *
from .models import *
from datetime import date

# Create your views here.


# APIs for goals
@api_view(["GET", "POST"])
def goals_view(request):
    if request.method == "GET":
        users = Goal.objects.all()
        serializer = GoalSerializer(users, many= True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    else:
        data = request.data
        serializer = GoalSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
@api_view(["GET", "PUT", "DELETE"])
def goals_detail_view(request, pk):
    try:
        user = Goal.objects.get(pk = pk)
    except user.DoesNotExist as e:
        return Response({"msg": f"Error {e}"}, status= status.HTTP_404_NOT_FOUND)
    
    
    if request.method == "GET":
        serialiser = GoalSerializer(user)
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serialiser = GoalSerializer(user, data = request.data, partial = True)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_202_ACCEPTED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    else:
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    
# APIs for tasks [using the http method: GET, POST, DELETE, PUT]
@api_view(["GET", "POST"])
def tasks_view(request):

    if request.method == "GET":
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data,status=status.HTTP_201_CREATED)

    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET", "PUT", "DELETE"])
def task_detail_view(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({"detail": "Task not found"},status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        serializer = TaskSerializer(task)
        return Response(serializer.data,status=status.HTTP_200_OK)

    elif request.method == "PUT":
        serializer = TaskSerializer(task,data=request.data,partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_200_OK)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    task.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



# APIs for focus session [using the http method: GET, POST]
@api_view(["GET", "POST"])
def focus_sessions_view(request):
    if request.method == "GET":
        sessions = FocusSession.objects.all()
        serializer = FocusSessionSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Create a new focus session
    elif request.method == "POST":
        serializer = FocusSessionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def focus_session_detail_view(request, pk):
    try:
        session = FocusSession.objects.get(pk=pk)
    except FocusSession.DoesNotExist:
        return Response({"detail": "Focus session not found"},status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = FocusSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        serializer = FocusSessionSerializer(session,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# APIs for streaks [using the http method: GET]
@api_view(["GET"])
def streaks_view(request):
    streaks = Streak.objects.all()
    serializer = StreakSerializer(streaks,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)


    
