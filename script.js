const API_URL = "https://6af0b70011a6aa866e7fb4aa.mockapi.io/tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const loading = document.getElementById("loading");
const statusMessage = document.getElementById("statusMessage");

// Отримання завдань
async function loadTasks() {
    loading.style.display = "block";
    statusMessage.textContent = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Помилка завантаження");
        }

        const tasks = await response.json();
        renderTasks(tasks);

    } catch (error) {
        statusMessage.textContent = error.message;
    } finally {
        loading.style.display = "none";
    }
}

// Відображення завдань
function renderTasks(tasks) {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        const name = document.createElement("span");

        name.textContent = task.name;

        if (task.completed) {
            name.classList.add("completed");
        }

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Повернути" : "Виконано";
        completeButton.onclick = () => updateTask(task.id, !task.completed);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Видалити";
        deleteButton.onclick = () => deleteTask(task.id);

        li.append(name, completeButton, deleteButton);
        taskList.appendChild(li);
    });
}

// Додавання завдання
taskForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (name === "") {
        statusMessage.textContent = "Введіть текст завдання!";
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                completed: false
            })
        });

        if (!response.ok) {
            throw new Error("Не вдалося додати завдання");
        }

        taskInput.value = "";
        await loadTasks();

    } catch (error) {
        statusMessage.textContent = error.message;
    }
});

// Видалення завдання
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Не вдалося видалити завдання");
        }

        await loadTasks();

    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

// Зміна статусу
async function updateTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: completed
            })
        });

        if (!response.ok) {
            throw new Error("Не вдалося змінити статус");
        }

        await loadTasks();

    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

// Запуск програми
loadTasks();