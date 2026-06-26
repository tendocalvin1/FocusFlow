from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Goal(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="goals")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True,null=True)
    goal_date = models.DateField(db_index=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
    
# Task Model: A task belongs to a goal.
class Task(models.Model):
    PRIORITY_CHOICES = [
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
    ]

    goal = models.ForeignKey(Goal,on_delete=models.CASCADE,related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True,null=True)
    priority = models.CharField(max_length=10,choices=PRIORITY_CHOICES,default="MEDIUM")
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
    
    def __str__(self):
        return self.title
    

# Focus Session Model: A focus session belongs to: (i) User, (ii)Task
class FocusSession(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="focus_sessions")
    task = models.ForeignKey(Task,on_delete=models.CASCADE,related_name="focus_sessions")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True,blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.task.title}"
    
# Streak Model: One streak per user.
class Streak(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="streak")
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    
    # Last day whose goals have been evaluated
    last_evaluated_date = models.DateField(null=True,blank=True)

    class Meta:
        verbose_name = "Streak"
        verbose_name_plural = "Streaks"

    def __str__(self):
        return f"{self.user.username} - {self.current_streak}"


    
    
