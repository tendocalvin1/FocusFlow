from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Register(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email = models.EmailField()
    password = models.CharField(max_length=15)
    
    
    def __str__(self):
        return f"{self.first_name} - {self.last_name}"
    
    
class Login(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.username}"
    
    
class Logout(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.username}"
    