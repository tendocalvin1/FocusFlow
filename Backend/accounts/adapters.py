from urllib.parse import urlencode
from django.conf import settings
from django.shortcuts import redirect

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


class FocusFlowAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        return settings.LOGIN_REDIRECT_URL

    def get_logout_redirect_url(self, request):
        frontend = getattr(settings, "FRONTEND_URL", "/")
        return frontend.rstrip("/") + "/"


class FocusFlowSocialAccountAdapter(DefaultSocialAccountAdapter):
    def get_connect_redirect_url(self, request, socialaccount):
        return settings.LOGIN_REDIRECT_URL

    def get_login_redirect_url(self, request):
        return settings.LOGIN_REDIRECT_URL

    def is_open_for_signup(self, request, sociallogin):
        return True
