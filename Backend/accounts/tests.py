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
        response = self.client.get(reverse("profile"))
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
        
        
# Change Password Test Suite
class ChangePasswordTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username = "tendo",
            email="tendo@gmail.com",
            password="tendo1234!"
        )
        
        self.client.force_authenticate(user=self.user)
        
# Test 1 — Successful Password Change
    def test_user_can_change_password(self):
        data = {
            "old_password" : "tendo1234!",
            "new_password" : "newtendo1234!"
        }
        
        response = self.client.post(reverse("change-password"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("newtendo1234!"))
        
# Test 2 — Wrong Old Password
    def test_change_password_fails_with_wrong_old_password(self):
        data = {
        "old_password": "wrongpassword",
        "new_password": "newtendo1234!"
        }
        response = self.client.post(reverse("change-password"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.refresh_from_db()
        self.assertFalse(self.user.check_password("newtendo1234!"))
        
# Test 3 — Missing Old Password
    def test_change_password_requires_old_new_password(self):
        data = {
        "new_password": "newtendo1234!"
    }
        response = self.client.post(reverse("change-password"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("old_password", response.data)
        
# Test 4 — Missing New Password
    def test_change_password_requires_new_password(self):
        data = {
            "old_password" : "tendo1234!"
        }
        response = self.client.post(reverse("change-password"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("new_password", response.data)
        
# Test 5 — Login Works with the New Password
    def test_can_login_with_new_password(self):
        response = self.client.post(reverse("change-password"), {"old_password" : "tendo1234!",
            "new_password" : "newtendo1234!"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=None)
        login = self.client.post(reverse("token_obtain_pair"),{
            "username": "tendo",
            "password": "newtendo1234!"
        },
        format="json"
    )

        self.assertEqual(login.status_code,status.HTTP_200_OK)
        self.assertIn("access", login.data)
        

# Test 6 — Old Password No Longer Works
    def test_old_password_no_longer_works(self):
        self.client.post(reverse("change-password"),
        {
            "old_password": "password123!",
            "new_password": "newpassword456!"
        },
        format="json"
    )

        self.client.force_authenticate(user=None)
        response = self.client.post(reverse("token_obtain_pair"),{"username": "tendo","password": "password123!"},format="json")
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)