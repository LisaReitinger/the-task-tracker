document.addEventListener("DOMContentLoaded", () => {
  console.log("Task Dashboard JavaScript loaded");

  // Initialize checkbox functionality
  initializeCheckboxes();

  // Initialize notification system
  initializeNotifications();

  // Initialize clear completed functionality
  initializeClearCompleted();
});

function initializeCheckboxes() {
  const checkboxes = document.querySelectorAll(".task-checkbox");
  console.log(`Found ${checkboxes.length} task checkboxes`);

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleTaskToggle);
  });
}

function handleTaskToggle(event) {
  const checkbox = event.target;
  const taskId = checkbox.dataset.taskId;
  const taskName = checkbox.dataset.taskName;
  const completed = checkbox.checked;
  const taskCard = checkbox.closest(".task-card");

  console.log(
    `Task ${taskId} (${taskName}) toggled to ${
      completed ? "completed" : "pending"
    }`
  );

  // Disable checkbox during request
  checkbox.disabled = true;

  // Add loading state
  taskCard.classList.add("task-updating");

  // Make API request
  fetch(`/task/toggle/${taskId}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(
        `Task ${taskName} completion status updated: ${data.completed}`
      );

      // Show success notification
      showNotification(
        `Task "${taskName}" marked as ${
          data.completed ? "completed" : "pending"
        }`,
        "success"
      );

      // Animate task movement between sections
      moveTaskBetweenSections(taskCard, data.completed);

      // Update task counts
      updateTaskCounts();
    })
    .catch((error) => {
      console.error("Error updating task:", error);

      // Revert checkbox state on error
      checkbox.checked = !completed;

      // Show error notification
      showNotification(
        `Failed to update task "${taskName}". Please try again.`,
        "error"
      );
    })
    .finally(() => {
      // Re-enable checkbox and remove loading state
      checkbox.disabled = false;
      taskCard.classList.remove("task-updating");
    });
}

function moveTaskBetweenSections(taskCard, isCompleted) {
  const pendingSection = document.getElementById("pending-tasks");
  const completedSection = document.getElementById("completed-tasks");

  // Add animation class
  taskCard.classList.add("task-moving");

  // Wait for animation to start, then move the task
  setTimeout(() => {
    // Remove empty states if they exist
    removeEmptyStates();

    if (isCompleted) {
      // Move to completed section
      taskCard.classList.add("completed-task");
      completedSection.appendChild(taskCard);
    } else {
      // Move to pending section
      taskCard.classList.remove("completed-task");
      pendingSection.appendChild(taskCard);
    }

    // Remove animation class and add completion animation
    taskCard.classList.remove("task-moving");
    taskCard.classList.add("task-moved");

    // Remove moved class after animation
    setTimeout(() => {
      taskCard.classList.remove("task-moved");
    }, 300);

    // Update empty states if needed
    updateEmptyStates();
  }, 150);
}

function updateTaskActions(taskCard, isCompleted) {
  // No longer hide edit buttons - all tasks should be editable
  // This function is kept for future customizations if needed
}

function updateTaskCounts() {
  const pendingTasks = document.querySelectorAll(
    "#pending-tasks .task-card"
  ).length;
  const completedTasks = document.querySelectorAll(
    "#completed-tasks .task-card"
  ).length;
  const totalTasks = pendingTasks + completedTasks;

  // Update sidebar stats
  updateStatNumber("Total", totalTasks);
  updateStatNumber("Pending", pendingTasks);
  updateStatNumber("Done", completedTasks);

  // Update section headers
  updateSectionCount("pending-section", pendingTasks);
  updateSectionCount("completed-section", completedTasks);

  // Update clear button visibility
  const clearButton = document.getElementById("clear-completed");
  if (clearButton) {
    clearButton.style.display = completedTasks > 0 ? "block" : "none";
  }
}

function updateStatNumber(label, count) {
  const stats = document.querySelectorAll(".stat-item");
  stats.forEach((stat) => {
    const statLabel = stat.querySelector(".stat-label");
    if (statLabel && statLabel.textContent === label) {
      const statNumber = stat.querySelector(".stat-number");
      if (statNumber) {
        statNumber.textContent = count;
        // Add bounce animation
        statNumber.classList.add("stat-updated");
        setTimeout(() => statNumber.classList.remove("stat-updated"), 300);
      }
    }
  });
}

function updateSectionCount(sectionId, count) {
  const section = document.getElementById(sectionId);
  if (section) {
    const countElement = section.querySelector(".task-count");
    if (countElement) {
      countElement.textContent = `(${count})`;
    }
  }
}

function removeEmptyStates() {
  const emptyStates = document.querySelectorAll(".empty-state");
  emptyStates.forEach((state) => state.remove());
}

function updateEmptyStates() {
  const pendingTasks = document.querySelectorAll("#pending-tasks .task-card");
  const completedTasks = document.querySelectorAll(
    "#completed-tasks .task-card"
  );

  // Add empty state for pending tasks if needed
  if (pendingTasks.length === 0) {
    const pendingSection = document.getElementById("pending-tasks");
    const emptyState = createEmptyState(
      "No pending tasks",
      "Great job! All tasks are completed."
    );
    pendingSection.appendChild(emptyState);
  }

  // Add empty state for completed tasks if needed
  if (completedTasks.length === 0) {
    const completedSection = document.getElementById("completed-tasks");
    const emptyState = createEmptyState(
      "No completed tasks",
      "Complete some tasks to see them here!"
    );
    completedSection.appendChild(emptyState);
  }
}

function createEmptyState(title, message) {
  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";
  emptyState.innerHTML = `
        <h3>${title}</h3>
        <p>${message}</p>
    `;
  return emptyState;
}

function initializeClearCompleted() {
  const clearButton = document.getElementById("clear-completed");
  if (clearButton) {
    clearButton.addEventListener("click", handleClearCompleted);
  }
}

function handleClearCompleted() {
  const completedTasks = document.querySelectorAll(
    "#completed-tasks .task-card"
  );

  if (completedTasks.length === 0) return;

  if (
    confirm(
      `Are you sure you want to delete all ${completedTasks.length} completed tasks?`
    )
  ) {
    const taskIds = Array.from(completedTasks).map(
      (card) => card.dataset.taskId
    );

    // Delete tasks one by one
    Promise.all(taskIds.map((taskId) => deleteTask(taskId)))
      .then(() => {
        showNotification(
          `Successfully deleted ${taskIds.length} completed tasks`,
          "success"
        );

        // Remove all completed task cards with animation
        completedTasks.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("task-removing");
            setTimeout(() => card.remove(), 300);
          }, index * 100);
        });

        // Update counts after animation
        setTimeout(() => {
          updateTaskCounts();
          updateEmptyStates();
        }, taskIds.length * 100 + 300);
      })
      .catch((error) => {
        console.error("Error clearing completed tasks:", error);
        showNotification(
          "Failed to clear completed tasks. Please try again.",
          "error"
        );
      });
  }
}

function deleteTask(taskId) {
  return fetch(`/task/delete/${taskId}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
  });
}

// Notification System
function initializeNotifications() {
  // Create notification container if it doesn't exist
  if (!document.getElementById("notification-container")) {
    const container = document.createElement("div");
    container.id = "notification-container";
    container.className = "notification-container";
    document.body.appendChild(container);
  }
}

function showNotification(message, type = "success") {
  const container = document.getElementById("notification-container");
  const notification = document.createElement("div");

  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${
              type === "success" ? "✓" : "⚠"
            }</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

  container.appendChild(notification);

  // Trigger animation
  setTimeout(() => notification.classList.add("notification-show"), 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.remove("notification-show");
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Utility Functions
function getCSRFToken() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrftoken") {
      return value;
    }
  }
  return "";
}

