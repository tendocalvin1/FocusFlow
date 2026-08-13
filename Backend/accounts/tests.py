from django.urls import reverse
from django.core.management import call_command
from django.core.exceptions import ImproperlyConfigured
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase
from allauth.socialaccount.models import SocialApp
from io import StringIO
from unittest.mock import patch

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


class SocialLoginCompleteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="sso-user",
            email="sso@focusflow.io",
            password="sso-user-pw-1!"
        )

    def test_social_complete_redirects_anonymous_to_error(self):
        url = reverse("social_login_complete")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn("oauth/callback", response["Location"])
        self.assertIn("error=unauthenticated", response["Location"])

    def test_social_complete_redirects_authenticated_to_spa_with_jwt(self):
        self.client.force_login(self.user)
        url = reverse("social_login_complete")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        location = response["Location"]
        self.assertIn("/oauth/callback", location)
        self.assertIn("access=", location)
        self.assertIn("refresh=", location)

    def test_social_complete_tokens_are_valid_simplejwt(self):
        self.client.force_login(self.user)
        url = reverse("social_login_complete")
        response = self.client.get(url)
        location = response["Location"]
        from urllib.parse import urlparse, parse_qs
        parsed = parse_qs(urlparse(location).query)
        access_token = parsed["access"][0]
        response = self.client.post(
            reverse("token_verify"),
            {"token": access_token},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_social_complete_does_not_leak_secrets(self):
        self.client.force_login(self.user)
        url = reverse("social_login_complete")
        response = self.client.get(url)
        self.assertNotIn("GOOGLE_CLIENT", response.get("Location", ""))
        self.assertNotIn("client_secret", str(response.serialize()).lower())


class SocialAppConfigurationTests(APITestCase):
    def _call_setup(self):
        out = StringIO()
        call_command("setup_social_apps", stdout=out)
        return out.getvalue()

    @override_settings(DEBUG=False)
    @patch.dict(
        "os.environ",
        {
            "DEBUG": "False",
            "SITE_DOMAIN": "focusflow-3n3u.onrender.com",
            "GOOGLE_CLIENT_ID": "google-client-id",
            "GOOGLE_CLIENT_SECRET": "google-client-secret",
            "GITHUB_CLIENT_ID": "github-client-id",
            "GITHUB_CLIENT_SECRET": "github-client-secret",
        },
        clear=False,
    )
    def test_setup_social_apps_creates_site_and_provider_apps(self):
        self._call_setup()

        site = Site.objects.get(id=1)
        self.assertEqual(site.domain, "focusflow-3n3u.onrender.com")
        self.assertEqual(site.name, "focusflow-3n3u.onrender.com")

        google = SocialApp.objects.get(provider="google")
        github = SocialApp.objects.get(provider="github")

        self.assertEqual(google.client_id, "google-client-id")
        self.assertTrue(google.secret)
        self.assertIn(site, google.sites.all())

        self.assertEqual(github.client_id, "github-client-id")
        self.assertTrue(github.secret)
        self.assertIn(site, github.sites.all())

    @override_settings(DEBUG=False)
    @patch.dict(
        "os.environ",
        {
            "DEBUG": "False",
            "SITE_DOMAIN": "focusflow-3n3u.onrender.com",
            "GOOGLE_CLIENT_ID": "google-client-id",
            "GOOGLE_CLIENT_SECRET": "google-client-secret",
            "GITHUB_CLIENT_ID": "github-client-id",
            "GITHUB_CLIENT_SECRET": "github-client-secret",
        },
        clear=False,
    )
    def test_setup_social_apps_is_idempotent(self):
        self._call_setup()
        self._call_setup()

        self.assertEqual(SocialApp.objects.filter(provider="google").count(), 1)
        self.assertEqual(SocialApp.objects.filter(provider="github").count(), 1)
        self.assertEqual(Site.objects.filter(id=1).count(), 1)

    @override_settings(DEBUG=False)
    @patch.dict(
        "os.environ",
        {
            "DEBUG": "False",
            "SITE_DOMAIN": "focusflow-3n3u.onrender.com",
            "GOOGLE_CLIENT_ID": "",
            "GOOGLE_CLIENT_SECRET": "",
            "GITHUB_CLIENT_ID": "github-client-id",
            "GITHUB_CLIENT_SECRET": "github-client-secret",
        },
        clear=False,
    )
    def test_setup_social_apps_fails_clearly_for_missing_production_credentials(self):
        with self.assertRaises(ImproperlyConfigured):
            self._call_setup()

    @override_settings(DEBUG=True)
    @patch.dict(
        "os.environ",
        {
            "DEBUG": "True",
            "SITE_DOMAIN": "localhost",
            "GOOGLE_CLIENT_ID": "",
            "GOOGLE_CLIENT_SECRET": "",
            "GITHUB_CLIENT_ID": "",
            "GITHUB_CLIENT_SECRET": "",
        },
        clear=False,
    )
    def test_setup_social_apps_allows_missing_credentials_in_local_debug(self):
        output = self._call_setup()
        self.assertIn("required to configure google OAuth", output)
        self.assertEqual(SocialApp.objects.count(), 0)

    @patch.dict(
        "os.environ",
        {
            "DATABASE_URL": "postgres://user:secret@example/db",
            "SECRET_KEY": "django-secret",
            "DEBUG": "False",
            "FRONTEND_URL": "https://focus-flow-bay-zeta.vercel.app",
            "GOOGLE_CLIENT_ID": "google-client-id",
            "GOOGLE_CLIENT_SECRET": "google-client-secret",
            "GITHUB_CLIENT_ID": "github-client-id",
            "GITHUB_CLIENT_SECRET": "github-client-secret",
        },
        clear=False,
    )
    def test_inspect_oauth_config_redacts_sensitive_values(self):
        site = Site.objects.get(id=1)
        site.domain = "focusflow-3n3u.onrender.com"
        site.name = "focusflow-3n3u.onrender.com"
        site.save()
        app = SocialApp.objects.create(
            provider="google",
            name="FocusFlow Google",
            client_id="google-client-id",
            secret="google-client-secret",
        )
        app.sites.add(site)

        out = StringIO()
        call_command("inspect_oauth_config", stdout=out)
        output = out.getvalue()

        self.assertIn("GOOGLE_CLIENT_ID = configured", output)
        self.assertIn("GOOGLE_CLIENT_SECRET = configured", output)
        self.assertIn("provider=google", output)
        self.assertIn("client_id=configured", output)
        self.assertIn("secret=configured", output)
        self.assertNotIn("google-client-secret", output)
        self.assertNotIn("postgres://user:secret@example/db", output)


class JWTRegressionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="jwt-check",
            email="jwt-check@focusflow.io",
            password="jwt-pw-9!"
        )

    def test_token_obtain_still_works(self):
        response = self.client.post(
            reverse("token_obtain_pair"),
            {"username": "jwt-check", "password": "jwt-pw-9!"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self._access = response.data["access"]

    def test_token_refresh_still_works(self):
        obtain = self.client.post(
            reverse("token_obtain_pair"),
            {"username": "jwt-check", "password": "jwt-pw-9!"},
            format="json"
        )
        refresh = self.client.post(
            reverse("token_refresh"),
            {"refresh": obtain.data["refresh"]},
            format="json"
        )
        self.assertEqual(refresh.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh.data)

    def test_profile_protected_without_bearer(self):
        response = self.client.get(reverse("profile"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_accessible_with_bearer(self):
        obtain = self.client.post(
            reverse("token_obtain_pair"),
            {"username": "jwt-check", "password": "jwt-pw-9!"},
            format="json"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {obtain.data['access']}")
        response = self.client.get(reverse("profile"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "jwt-check")
