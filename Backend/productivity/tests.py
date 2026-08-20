import json
from datetime import date, timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from  .models import Goal, Task, FocusSession, Streak
from .serialisers import GoalSerializer, TaskSerializer, FocusSessionSerializer, StreakSerializer
from rest_framework.authentication import SessionAuthentication, BaseAuthentication
from unittest.mock import patch


# Create your tests here.
# unit tests for the productivity application
# building a test class for the goal API 
# test cases for the goal API for focusflow
class GoalAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username = "tendo",
            password = "calvin1234"
        )
        
        self.token = Token.objects.create(user = self.user)
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)
        self.goal = Goal.objects.create(
            user = self.user,
            title = "Software engineer",
            description = "Build and maintain web and mobile applications",
            target_date = date.today()
        )


# Test 1: Can an authenticated user retrieve all goals
    def test_get_allgaols(self):
        response = self.client.get(reverse("goals-view"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        
# Test 2: Unauthenticated user should fail.
    def test_get_goals_requires_authentication(self):
        self.client.credentials()
        response = self.client.get(reverse("goals-view"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        

# Test 3: Create a goal.
    def test_create_goal(self):
        data = {
            "user" : 1,
            "title" : "Learn DevOps",
            "description" : "Containerisation",
            "target_date": str(date.today()),
            "completed" : False
        }
        
        response = self.client.post(reverse('goals-view'), data, format='json')
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Goal.objects.count(), 2)
        self.assertEqual(response.data['title'], "Learn DevOps")
        
        
# Test 4: Missing title.
    def test_create_goal_without_title(self):
        data = {
            'description' : 'Missing title',
            'target_date' : str(date.today()),
            'completed' : False
        }
        response = self.client.post(reverse('goals-view'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)


class ProductivityPlanAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="planner", password="planner-password")
        self.other_user = User.objects.create_user(username="other-planner", password="other-password")
        self.client.force_authenticate(user=self.user)
        self.goal = Goal.objects.create(
            user=self.user,
            title="Ship FocusFlow AI",
            priority="HIGH",
            status="IN_PROGRESS",
            progress=40,
            target_date=date.today() + timedelta(days=3),
        )
        self.task = Task.objects.create(goal=self.goal, title="Write planner tests", priority="HIGH")
        Goal.objects.create(user=self.other_user, title="Private goal", target_date=date.today() + timedelta(days=2))
        Streak.objects.create(user=self.user, current_streak=4, longest_streak=9)

    def test_plan_requires_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(reverse("productivity-plan-view"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch.dict("os.environ", {"OPENAI_API_KEY": "test-key", "OPENAI_MODEL": "test-model"})
    @patch("productivity.ai_services.OpenAI")
    def test_plan_returns_structured_user_scoped_response(self, openai_class):
        openai_class.return_value.responses.create.return_value.output_text = json.dumps({
            "summary": "Focus on shipping the planner.",
            "priorities": [{"goal_id": self.goal.id, "reason": "Near deadline.", "priority": "HIGH"}],
            "plan": [{"day": "Monday", "tasks": [{"task_id": self.task.id, "title": self.task.title, "estimated_minutes": 60, "reason": "Unblock delivery."}]}],
            "risks": [],
            "recommendations": ["Keep one deep-work block protected."],
        })
        response = self.client.post(reverse("productivity-plan-view"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["priorities"][0]["goal_id"], self.goal.id)
        request_input = openai_class.return_value.responses.create.call_args.kwargs["input"]
        self.assertIn("Ship FocusFlow AI", request_input)
        self.assertNotIn("Private goal", request_input)

    @patch.dict("os.environ", {}, clear=True)
    def test_missing_ai_configuration_is_safe(self):
        response = self.client.post(reverse("productivity-plan-view"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)

    @patch.dict("os.environ", {"OPENAI_API_KEY": "test-key"})
    @patch("productivity.ai_services.OpenAI")
    def test_invalid_ai_response_is_safe(self, openai_class):
        openai_class.return_value.responses.create.return_value.output_text = "{}"
        response = self.client.post(reverse("productivity-plan-view"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)

    @patch.dict("os.environ", {"OPENAI_API_KEY": "test-key"})
    @patch("productivity.ai_services.OpenAI")
    def test_provider_failure_is_safe(self, openai_class):
        openai_class.return_value.responses.create.side_effect = RuntimeError("provider unavailable")
        response = self.client.post(reverse("productivity-plan-view"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)

    def test_empty_productivity_data_is_safe(self):
        Goal.objects.filter(user=self.user).delete()
        response = self.client.post(reverse("productivity-plan-view"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["empty"])
        
        

# Task Tests [Tasks belong to a particular goal]
class TaskAPITestCase(APITestCase):
    def setUp(self):
        # user 1
        self.user = User.objects.create_user(username="dave", password="dave456#")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)
        
        # goal for user 1
        self.goal = Goal.objects.create(
            user =self.user,
            title = "Become Software Engineer",
            description = "Master system design and containerisation",
            target_date = date.today()
        ) 
        
        # existing task
        self.task = Task.objects.create(
            goal = self.goal,
            title = "Learn Backend engineering",
            description = "Test end points",
            priority = "medium",
            completed = True
        )
        
        
        
        # second user
        self.other_user = User.objects.create(
            username = "john",
            password = "johndave123"
        )
        
        # goal belonging to the second user
        self.other_goal = Goal.objects.create(
            user = self.other_user,
            title = 'private goal',
            description = "Not for everyone",
            # priority = "high",
            # completed = True,
            target_date = date.today()
            
        )
        
        
    
    # Test 1 : testing to get all tasks owned by the user
    def test_get_all_tasks(self):
        response = self.client.get(reverse("tasks-view"))
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        

# test 2 : Testing on authentication
    def test_tasks_require_authentication(self):
        self.client.credentials()
        response = self.client.get(reverse('tasks-view'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        

# test 3 : creating tasks
    def test_create_task(self):
        data = {
            "goal" : self.goal.id,
            "title" : "learn about Artificial Intelligence",
            "description" : "RAG and MCP",
            "priority" : "HIGH",
            "completed" : True
        }    
        response = self.client.post(reverse('tasks-view'), data, format='json')
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)
        self.assertEqual(response.data["title"], "learn about Artificial Intelligence")
        
        
# test 4 : creating tasks without goals
    def test_create_task_without_goal(self):
        data = {
            "title": "No goal",
            "description" : "No description",
            "priority" : "HIGH",
            "completed": False
        }
        response = self.client.post(reverse('tasks-view'), data, format='json')
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    # Test 5
    
    def test_cannot_create_task_for_another_users_goal(self):

        data = {
            "goal": self.other_goal.id,
            "title": "Hack",
            "description": "Should fail",
            "priority": "HIGH",
            "completed": False
        }
        response = self.client.post(reverse("tasks-view"),data,format="json")
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        

    # Test 6 : updating tasks of the user
    
    def test_update_task(self):

        data = {
            "title": "Updated Task"
        }
        response = self.client.put(reverse("task-detail-view",kwargs={"pk": self.task.id}),
            data,
            format="json"
        )
        self.task.refresh_from_db()
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.task.title, "Updated Task")
        
        

    # Test 7: deleting of a task
    
    def test_delete_task(self):
        response = self.client.delete(reverse("task-detail-view",kwargs={"pk": self.task.id}))
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)
        

# Testing FocusSessions

class FocusSessionAPITestCase(APITestCase):

    def setUp(self):
        
        # User
        self.user = User.objects.create_user(username="tendo",password="calvin1234")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        # Goal
        self.goal = Goal.objects.create(
            user=self.user,
            title="Backend Engineer",
            description="Learn DRF",
            target_date=date.today()
        )

        # Task
        self.task = Task.objects.create(
            goal=self.goal,
            title="Write Tests",
            description="Testing APIs",
            priority="HIGH",
            completed=False
        )
        start_time = timezone.now()
        end_time = start_time + timedelta(minutes=25)
        # Focus Session
        self.focus_session = FocusSession.objects.create(
            user=self.user,
            task=self.task,
            start_time = start_time,
            end_time = end_time,
            completed=False
        )

        # Second user
        self.other_user = User.objects.create_user(
            username="john",
            password="password123"
        )

        self.other_goal = Goal.objects.create(
            user=self.other_user,
            title="Private Goal",
            description="Private",
            target_date=date.today()
        )

        self.other_task = Task.objects.create(
            goal=self.other_goal,
            title="Private Task",
            description="Not yours",
            priority="LOW",
            completed=False
        )

# Test 1 : Authenticated user can retrieve their focus sessions    
    def test_get_all_focus_sessions(self):
        start_time = timezone.now()
        end_time = start_time + timedelta(minutes=25)
        FocusSession.objects.create(
            user=self.user,
            task=self.task,
            start_time = start_time,
            end_time = end_time,
            completed=False)
        response = self.client.get(reverse("focus-sessions-view"))
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        
# Test 2 : Unauthenticated user cannot retrieve sessions
    def test_get_focus_sessions_require_authentication(self):
        self.client.credentials()
        response = self.client.get(reverse('focus-sessions-view'))
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        

# Test 3 : User can create a focus session
    def test_create_focus_session(self):
        start_time = timezone.now()
        end_time = start_time + timedelta(minutes=25)
        data = {
        "user" : self.user.id,
        "task": self.task.id,
        "start_time" : start_time,
        "end_time" : end_time, 
        "completed": False
    }

        response = self.client.post(reverse("focus-sessions-view"),data,format="json")
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FocusSession.objects.count(), 2)
        
        
# Test 4: Creating a session without a task should fail
    def test_create_focus_session_without_task(self):
        response = self.client.post(reverse("focus-sessions-view"), format="json")
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)
        self.assertIn("task", response.data)
        
# Test 5 :User cannot create a session for another user's task
    def test_cannot_create_focus_session_for_other_users_task(self):
        data = {
        "task": self.other_task.id,
        "completed": False
        }
        response = self.client.post(reverse("focus-sessions-view"),data,format="json")
        # print(response.status_code)
        # print(response.data)
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)
        