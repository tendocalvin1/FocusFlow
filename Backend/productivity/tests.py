from datetime import date
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from  .models import Goal, Task, FocusSession, Streak
from .serialisers import GoalSerializer, TaskSerializer, FocusSessionSerializer, StreakSerializer

# Create your tests here.

# building a test class
class GoalAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username = "tendo",
            password = "calvin1234"
        )
        
        self.token = Token.objects.create(user = self.user)
        self.client.credentials(HTTP_AUTHORIZATION = "Token" + self.token.key)
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
        