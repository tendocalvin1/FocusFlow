from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    # register
    path("api/auth/register/",views.register_view,name="register"),

    # profile   
    path("api/profile/",views.profile_view,name="profile"),
    
    # change-password
    path("api/auth/change-password/",views.change_password_view,name="change-password"),
    
    # logout
    path("api/auth/logout/",views.logout_view,name="logout"),

    # login
    path("api/token/",TokenObtainPairView.as_view(),name="token_obtain_pair"),

    
    # refresh
    path("api/token/refresh/",TokenRefreshView.as_view(),name="token_refresh")
]