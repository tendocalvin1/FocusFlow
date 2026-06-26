from django.urls import path
from . import views

urlpatterns = [
   # Goals
    path("api/goals/",view=views.goals_view,name="goals-view"),
    path("api/goals/<int:pk>/",view=views.goals_detail_view,name="goal-detail-view"),

    # Tasks
    path("api/tasks/",view=views.tasks_view,name="tasks-view"),
    path("api/tasks/<int:pk>/",view=views.task_detail_view,name="task-detail-view"),

    # Focus Sessions
    path("api/focus-sessions/",view=views.focus_sessions_view,name="focus-sessions-view"),
    path("api/focus-sessions/<int:pk>/",view=views.focus_session_detail_view,name="focus-session-detail-view"),

    # Streaks
    path("api/streaks/",view=views.streaks_view,name="streaks-view")

]

# verify these end points
# GET    goals
# POST   goals
# PUT    goals
# DELETE goals

# GET    tasks
# POST   tasks
# PUT    tasks
# DELETE tasks

# GET    focus sessions
# POST   focus sessions


