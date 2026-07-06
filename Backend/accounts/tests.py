from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase



# Create your tests here.

class RegisterTests(APITestCase):
    def test_user_can_register(self):
        data = {
    "username": "arthur",
    "first_name": "Arthur",
    "last_name": "Smith",
    "email": "smith@gmail.com",
    "password": "password123!"
    }
        
        response = self.client.post(reverse("register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.get(username="arthur")
        self.assertEqual(user.email, "smith@gmail.com")
        self.assertTrue(user.check_password("password123!"))
        
            
    def test_cannot_register_duplicate_email(self):
            User.objects.create_user(
            username="arthur",
            email="smith@gmail.com",
            password="password123!"
        )

            data = {
            "username": "tendo",
            "first_name": "Tendo",
            "last_name": "Calvin",
            "email": "smith@gmail.com",
            "password": "password123!"
        }

            response = self.client.post(reverse("register"),data,format="json")
            self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
            self.assertIn("email", response.data)


    # Missing password
    def test_registration_requires_password(self):

        data = {
            "username": "arthur",
            "first_name": "Arthur",
            "last_name": "Morgan",
            "email": "arthur@example.com"
        }

        response = self.client.post(reverse("register"),data,format="json")
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)
        

    # Invalid Email
    def test_registration_requires_valid_email(self):

        data = {
            "username": "arthur",
            "first_name": "Arthur",
            "last_name": "Morgan",
            "email": "not-an-email",
            "password": "Password123!"
        }
        response = self.client.post(reverse("register"),data,format="json")
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)