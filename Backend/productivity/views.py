
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .serialisers import GoalSerializer, TaskSerializer, FocusSessionSerializer, StreakSerializer
from .models import Goal,Task,FocusSession,Streak
from datetime import  timedelta
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view

# Create your views here.


# APIs for goals
@extend_schema_view(
    get=extend_schema(summary="Retrieve-all-goals",responses=GoalSerializer(many=True)),
    post = extend_schema(summary="create-a-goal", request=GoalSerializer, responses={201: GoalSerializer})
)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def goals_view(request):
    if request.method == "GET":
        goals = Goal.objects.filter(user= request.user)
        serializer = GoalSerializer(goals, many= True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    else:
        data = request.data
        serializer = GoalSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(user = request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@extend_schema_view(
    get=extend_schema(summary="Retrieve-a-specific-goal",responses=GoalSerializer(many=True)),
    put = extend_schema(summary="update-a-goal", request=GoalSerializer, responses={201: GoalSerializer}),
    delete = extend_schema(summary="delete-a-goal", request=GoalSerializer, responses={404: GoalSerializer})
)    
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def goals_detail_view(request, pk):
    try:
        goal = Goal.objects.get(pk = pk, user = request.user)
    except Goal.DoesNotExist :
        return Response({"detail":"Goal not found"}, status= status.HTTP_404_NOT_FOUND)
    
    
    if request.method == "GET":
        serialiser = GoalSerializer(goal)
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serialiser = GoalSerializer(goal, data = request.data, partial = True)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_200_OK)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    else:
        goal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    
# APIs for tasks [using the http method: GET, POST, DELETE, PUT]
@extend_schema_view(
    get=extend_schema(summary="Retrieve-all-tasks",responses=TaskSerializer(many=True)),
    post = extend_schema(summary="create-a-task", request=TaskSerializer, responses={201: TaskSerializer})
)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def tasks_view(request):

    if request.method == "GET":
        tasks = Task.objects.filter(goal__user = request.user)
        serializer = TaskSerializer(tasks,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

    goal_id = request.data.get("goal")

    if not goal_id:
        return Response({"goal": ["This field is required."]},status=status.HTTP_400_BAD_REQUEST)

    try:
        goal = Goal.objects.get(pk=goal_id,user=request.user)

    except Goal.DoesNotExist:
        return Response({"goal": ["Goal not found."]},status=status.HTTP_404_NOT_FOUND)

    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(goal=goal)
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@extend_schema_view(
    get=extend_schema(summary="Retrieve-a-specific-task",responses=TaskSerializer(many=True)),
    put = extend_schema(summary="update-a-task", request=TaskSerializer, responses={201: TaskSerializer}),
    delete = extend_schema(summary="delete-a-task", request=TaskSerializer, responses={404: TaskSerializer})
)
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def task_detail_view(request, pk):
    try:
        task = Task.objects.get(pk=pk, goal__user = request.user)
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    elif request.method == "DELETE":
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



# APIs for focus session [using the http method: GET, POST]
@extend_schema_view(
    get=extend_schema(summary="Retrieve-all-focus-sessions",responses=FocusSessionSerializer(many=True)),
    post = extend_schema(summary="create-a-focus-session", request=FocusSessionSerializer, responses={201: FocusSessionSerializer})
)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def focus_sessions_view(request):
    if request.method == "GET":
        sessions = FocusSession.objects.filter(user = request.user)
        serializer = FocusSessionSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Create a new focus session
    elif request.method == "POST":
        serializer = FocusSessionSerializer(data=request.data)

        # if serializer.is_valid():
        #     serializer.save(user=request.user)
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        task_id = request.data.get("task")

        try:
            task = Task.objects.get(pk=task_id,goal__user=request.user)
        except Task.DoesNotExist:
            return Response({"task": ["Task not found."]},status=status.HTTP_404_NOT_FOUND)

        serializer = FocusSessionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user,task=task)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@extend_schema_view(
    get=extend_schema(summary="Retrieve-a-specific-focus-session",responses=FocusSessionSerializer(many=True)),
    put = extend_schema(summary="update-a-focus-session", request=FocusSessionSerializer, responses={201: FocusSessionSerializer}),
    delete = extend_schema(summary="delete-a-focus-session", request=FocusSessionSerializer, responses={404: FocusSessionSerializer})
)
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def focus_session_detail_view(request, pk):
    try:
        session = FocusSession.objects.get(pk=pk, user = request.user)
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
@extend_schema_view(
    get=extend_schema(summary="Retrieve-all-streaks",responses=StreakSerializer(many=True))
    
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def streaks_view(request):
    user = request.user
    streak, created = Streak.objects.get_or_create(user=user)
    today = timezone.localdate()
    yesterday = today - timedelta(days=1)
    all_completed = False

    if streak.last_evaluated_date == yesterday:
        serializer = StreakSerializer(streak)
        return Response(serializer.data, status=status.HTTP_200_OK)
    yesterday_goals = Goal.objects.filter(user=user,goal_date=yesterday)

    if yesterday_goals.exists():
        all_completed = not yesterday_goals.filter(completed=False).exists()

    if all_completed:
        streak.current_streak += 1

        if streak.current_streak > streak.longest_streak:
            streak.longest_streak = streak.current_streak
    else:
        streak.current_streak = 0

    

    # Mark yesterday as evaluated
    streak.last_evaluated_date = yesterday
    streak.save()
    serializer = StreakSerializer(streak)
    return Response(serializer.data, status=status.HTTP_200_OK)


    
