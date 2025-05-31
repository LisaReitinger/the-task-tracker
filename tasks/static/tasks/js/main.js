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
            })
            .catch(error => {
                console.error('Error:', error);
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