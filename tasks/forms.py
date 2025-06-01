from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from .models import Task

# User Registration Form (Django's built-in UserCreationForm)
class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}),
            'password1': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}),
            'password2': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirm Password'}),
        }

# User Login Form (Django's built-in AuthenticationForm)
class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))

# Task Form (ModelForm based on Task model)
class TaskForm(forms.ModelForm):
    CATEGORY_CHOICES = [
        ('Work', 'Work'),
        ('Personal', 'Personal'),
        ('Health', 'Health'),
    ]

    category = forms.ChoiceField(choices=CATEGORY_CHOICES, widget=forms.Select(attrs={
        'class': 'form-control',
    }))
    due_date = forms.DateField(widget=forms.DateInput(attrs={
        'type': 'date',  # HTML5 date picker
        'class': 'form-control',
    }))

    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'priority', 'due_date']
