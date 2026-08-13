from urllib.parse import urlencode
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from .serialisers import *
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.conf import settings
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
import logging


logger = logging.getLogger(__name__)


# Create your views here.
# These are the end points for the authentication system
"""
    Register a new user account.
"""
@extend_schema_view(
    post = extend_schema(summary="create-a-user", request=RegisterSerializer, responses={201: RegisterSerializer})
)
@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
        serializer = RegisterSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

"""
    Retrieve the authenticated user's profile
"""
@extend_schema_view(
    get=extend_schema(summary="get-user-profile",responses=RegisterSerializer(many=True))
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

        


"""
    changing the password of the user
"""
@extend_schema_view(
    post=extend_schema(summary="change-password-of-user",responses=ChangePasswordSerializer(many=True))
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    serializer = ChangePasswordSerializer(data = request.data)
    if serializer.is_valid():
        user = request.user
        
    # verify the old password
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"old_password" : ["Incorrect password"]}, status=status.HTTP_400_BAD_REQUEST)
    # set the new password
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"message" : "Password changed successfully"}, status=status.HTTP_200_OK)
    # handle serializer validation errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    



"""
    A user logging out
"""

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


@extend_schema(exclude=True)
@api_view(["GET"])
@permission_classes([AllowAny])
def social_login_complete_view(request):
    """
    After django-allauth completes Google/GitHub OAuth (Django session is now
    authenticated), bridge the authenticated session into JWT tokens and
    redirect the browser back to the frontend SPA.
    """
    user = getattr(request, "user", None)
    frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173").rstrip("/")
    target = f"{frontend}/oauth/callback"
    logger.info(
        "OAuth JWT bridge reached: authenticated=%s frontend_configured=%s user_id=%s",
        bool(user and user.is_authenticated),
        bool(frontend),
        getattr(user, "id", None) if user and user.is_authenticated else None,
    )

    def _redirect_to_spa(query=None):
        if query:
            sep = "&" if "?" in target else "?"
            return redirect(f"{target}{sep}{urlencode(query, doseq=False)}")
        return redirect(target)

    if not user or not user.is_authenticated:
        logger.warning("OAuth JWT bridge reached without an authenticated user.")
        return _redirect_to_spa({"error": "unauthenticated"})

    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    params = {
        "access": str(access),
        "refresh": str(refresh),
    }

    # Best-effort cleanup of allauth temp session marker (not strictly
    # required, since session cookie is backend-only and SPA lives on a
    # different origin).
    for _key in ("socialaccount_sociallogin",):
        try:
            if _key in request.session:
                del request.session[_key]
        except Exception:
            pass

    try:
        request.session.modified = True
    except Exception:
        pass

    logger.info("OAuth JWT bridge minted tokens for user_id=%s", user.id)
    return _redirect_to_spa(params)
