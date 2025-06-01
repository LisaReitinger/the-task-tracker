from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50)
    priority = models.CharField(max_length=10, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')])
    due_date = models.DateField(blank=True, null=True)
    completed = models.BooleanField(default=False)  # Add default value
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Associate the task with a user

    def __str__(self):
        return self.title
