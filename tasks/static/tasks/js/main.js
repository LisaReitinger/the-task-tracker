console.log('JavaScript file loaded successfully!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    console.log('JavaScript loaded');

    const taskList = document.getElementById('task-list');
    const doneTaskList = document.getElementById('done-task-list');
    const toggleDoneBtn = document.getElementById('toggle-done-btn');

    // Debugging: Check if elements are found
    if (!taskList) {
        console.error('Task list not found!');
        return;
    }

    if (!doneTaskList) {
        console.error('Done task list not found!');
        return;
    }

    if (!toggleDoneBtn) {
        console.error('Toggle Done button not found!');
        return;
    }

    console.log('Elements found:', taskList, doneTaskList, toggleDoneBtn);

    // Event listener for task checkboxes
    taskList.addEventListener('change', (event) => {
        if (event.target.classList.contains('task-checkbox')) {
            const taskCard = event.target.closest('.task-card');
            if (event.target.checked) {
                moveToDone(taskCard);
            } else {
                moveToInProgress(taskCard);
            }
        }
    });

    // Toggle visibility of the "Done" section
    toggleDoneBtn.addEventListener('click', () => {
        const doneTasksSection = document.getElementById('done-tasks');
        if (doneTasksSection.style.display === 'none') {
            doneTasksSection.style.display = 'block';
            toggleDoneBtn.textContent = 'Hide Done Tasks';
        } else {
            doneTasksSection.style.display = 'none';
            toggleDoneBtn.textContent = 'Show Done Tasks';
        }
    });

    // Move task to "Done" section
    function moveToDone(taskCard) {
        doneTaskList.appendChild(taskCard);
        console.log(`Task "${taskCard.dataset.title}" moved to Done`);
    }

    // Move task back to "In Progress" section
    function moveToInProgress(taskCard) {
        taskList.appendChild(taskCard);
        console.log(`Task "${taskCard.dataset.title}" moved to In Progress`);
    }
});