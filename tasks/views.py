from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django.contrib import messages
from .forms import TaskForm
from .models import Task
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

def home(request):
    return render(request, 'tasks/index.html')

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.first_name = ""  # Set an empty string for first_name
            user.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'tasks/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard')
    else:
        form = AuthenticationForm()
    return render(request, 'tasks/login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.success(request, 'You have been successfully logged out.')
    return redirect('home')

@login_required
def dashboard(request):
    # Get all tasks for the user
    all_tasks = Task.objects.filter(user=request.user)

    # Filtering by category
    category = request.GET.get('category')
    if category:
        all_tasks = all_tasks.filter(category=category)

    # Sorting
    sort_by = request.GET.get('sort_by')
    if sort_by == 'due_date':
        all_tasks = all_tasks.order_by('due_date')
    elif sort_by == 'priority':
        # Custom ordering for priority
        priority_order = {'high': 1, 'medium': 2, 'low': 3}
        all_tasks = sorted(all_tasks, key=lambda x: priority_order.get(x.priority, 4))
    else:
        all_tasks = all_tasks.order_by('-id')  # Default: newest first

    # Separate completed and pending tasks
    pending_tasks = [task for task in all_tasks if not task.completed]
    completed_tasks = [task for task in all_tasks if task.completed]

    context = {
        'pending_tasks': pending_tasks,
        'completed_tasks': completed_tasks,
        'total_tasks': len(all_tasks),
        'completed_count': len(completed_tasks),
        'pending_count': len(pending_tasks),
    }

    return render(request, 'tasks/dashboard.html', context)

@login_required
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user  # Associate the task with the logged-in user
            task.save()  # Save the task to the database
            return redirect('dashboard')  # Redirect to the dashboard after saving
    else:
        form = TaskForm()
    return render(request, 'tasks/task_form.html', {'form': form})

@login_required
def task_update(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            return redirect('dashboard')
    else:
        form = TaskForm(instance=task)
    return render(request, 'tasks/task_form.html', {'form': form})

@login_required
def task_delete(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)
    if request.method == 'POST':
        task.delete()
        return redirect('dashboard')
    return render(request, 'tasks/task_confirm_delete.html', {'task': task})

@login_required
def new_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.save()
            return redirect('dashboard')  # Redirect to the dashboard after creating the task
    else:
        form = TaskForm()
    return render(request, 'tasks/task_form.html', {'form': form})

@login_required
def toggle_task_completion(request, pk):
    if request.method == 'POST':
        print(f"Toggle request received for task ID: {pk}")
        task = get_object_or_404(Task, pk=pk, user=request.user)
        task.completed = not task.completed
        task.save()
        print(f"Task {pk} completion status: {task.completed}")
        return JsonResponse({'completed': task.completed})
    return JsonResponse({'error': 'Invalid request'}, status=400)

def error(request):
    return render(request, 'tasks/error.html')