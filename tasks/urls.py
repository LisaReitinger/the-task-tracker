from django.urls import path
from . import views

urlpatterns = [
    path('task/toggle/<int:pk>/', views.toggle_task_completion, name='toggle_task_completion'),
]