from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from .serialisers import *
from drf_spectacular.utils import extend_schema, extend_schema_view


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
