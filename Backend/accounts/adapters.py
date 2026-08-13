from django.conf import settings

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


SOCIAL_COMPLETE = getattr(settings, "SOCIAL_LOGIN_COMPLETE_URL", "/_auth/social/complete/")


class FocusFlowAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        is_social = bool(
            request.session.get("socialaccount_sociallogin")
            or getattr(request, "_social_login_flow", False)
        )
        if is_social:
            return SOCIAL_COMPLETE
        return super().get_login_redirect_url(request)

    def get_logout_redirect_url(self, request):
        frontend = getattr(settings, "FRONTEND_URL", "/")
        if not frontend.startswith("http"):
            return frontend or "/"
        return frontend.rstrip("/") + "/"


class FocusFlowSocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(self, request, sociallogin):
        return True

    def save_user(self, request, sociallogin, form=None):
        request._social_login_flow = True
        return super().save_user(request, sociallogin, form)

    def pre_social_login(self, request, sociallogin):
        request._social_login_flow = True
        try:
            sociallogin.state["next"] = SOCIAL_COMPLETE
        except Exception:
            pass
