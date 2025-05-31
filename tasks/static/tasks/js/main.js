document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript loaded');

    // Handle task completion toggle
    const checkboxes = document.querySelectorAll('.task-completed');
    console.log('Checkboxes:', checkboxes);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const taskId = checkbox.dataset.taskId;
            const completed = checkbox.checked;
            console.log(`Checkbox for task ${taskId} changed to ${completed}`);

            fetch(`/task/toggle/${taskId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(`Task ${taskId} completion status: ${data.completed}`);
                showNotification(`Task ${taskId} marked as ${data.completed ? 'completed' : 'incomplete'}`);
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred while updating the task.', 'error');
            });
        });
    });
});

// Function to get CSRF token from cookies
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}

// Function to show notifications
function showNotification(message, type = 'success') {
    console.log(`Notification: ${message}, Type: ${type}`);
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}