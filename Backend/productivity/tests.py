from datetime import date
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from  .models import Goal, Task, FocusSession, Streak
from .serialisers import GoalSerializer, TaskSerializer, FocusSessionSerializer, StreakSerializer
from rest_framework.authentication import SessionAuthentication, BaseAuthentication


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
            goal_date = date.today()
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
            "goal_date": str(date.today()),
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
            'goal_date' : str(date.today()),
            'completed' : False
        }
        
        response = self.client.post(reverse('goals-view'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)