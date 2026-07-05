from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    # register
    path("api/auth/register/",view=views.register_view,name="register"),
    
    # profile
    path("api/profile/",view=views.profile_view,name="profile"),
    
    # Change password
    path("api/auth/change-password/",view=views.change_password_view,name="change-password"),
    
    # logout
    path("api/auth/logout/",view=views.logout_view,name="logout"),
    
    # login
    path("api/token/",TokenObtainPairView.as_view(),name="token-obtsin-pair"),
    
    # refresh
    path("api/token/logout/",TokenRefreshView.as_view,name="token_refresh")
]