from django.urls import path
from . import views

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
    path("api/token/",view=views.log_view,name="login"),
    
    # refresh
    path("api/token/logout/",view=views.logout_view,name="refresh")
]