"""
URL configuration for taskmanager_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from tasks import views  # Assuming your views are in tasks/views.py

urlpatterns = [
    path('admin/', admin.site.urls),

    # Home page
    path('', views.home, name='home'),

    # Register and login
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),

    # Task views
    path('dashboard/', views.dashboard, name='dashboard'),
    path('task/create/', views.task_create, name='task_create'),
    path('task/update/<int:pk>/', views.task_update, name='task_update'),
    path('task/delete/<int:pk>/', views.task_delete, name='task_delete'),
    path('task/toggle/<int:pk>/', views.toggle_task_completion, name='toggle_task_completion'),
    path('error/', views.error, name='error'),  # Error page
]
