from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

# writing unit tests for the focus flow application


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
        
        

# Login Tests using APIRestCase
class LoginTests(APITestCase):
    def setUp(self):
     self.user = User.objects.create_user(
         username="dave",
         first_name = "Kinyonyi",
         last_name = "David",
         email="david@gmail.com",
         password="dave1234!"
     )
     
# Test 1 — Successful Login

    def test_user_can_login(self):
        data = {
            "username" : "dave",
            "password" : "dave1234!"
        }
        
        response = self.client.post(reverse("token_obtain_pair"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        
# Test 2 — Wrong Password

    def test_login_fails_with_wrong_password(self):
        data = {
            "username" : "dave",
            "password" : "password"
        }
        
        response = self.client.post(reverse("token_obtain_pair"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        
# Test 3 — Unknown Username
    def test_login_fails_with_unknown_username(self):
        data = {
            "username" : "username",
            "password" : "dave1234!"
        }
        response = self.client.post(reverse("token_obtain_pair"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        
# Test 4 — Empty Request

    def test_login_requires_credentials(self):
        response = self.client.post(reverse("token_obtain_pair"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
        
# Profile Tests using APITestCase
class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="tendo",
            first_name="Tendo",
            last_name="Calvin",
            email="tendo@gmail.com",
            password="password123!"
        )
        
        
# Test 1 — Authenticated user can retrieve their profile
    def test_authenticated_user_can_view_profile(self):
        self.client.force_authenticate(user= self.user)
        response = self.client.post(reverse("profile"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"],"tendo")
        self.assertEqual(response.data["email"],"tendo@gmail.com")
        self.assertEqual(response.data["first_name"],"Tendo")
        self.assertEqual(response.data["last_name"],"Calvin")
        

# Test 2 — Anonymous users cannot access the endpoint
    def test_unauthenticated_user_cannot_view_profile(self):
        response = self.client.get(reverse("profile"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
# Test 3 — The endpoint returns the logged-in user's data
    def test_profile_returns_authenticated_user(self):
        arthur = User.objects.create_user(
            username="arthur",
            email="arthur@gmail.com",
            password="password123!"
        )
        self.client.force_authenticate(user=arthur)
        response = self.client.get(reverse("profile"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "arthur")
        self.assertNotEqual(response.data["username"], "Tendo")
