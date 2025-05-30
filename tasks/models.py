from django.db import models
from django.contrib.auth.models import User  # Import built-in User

class Task(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50)
    priority = models.CharField(max_length=10)
    due_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
