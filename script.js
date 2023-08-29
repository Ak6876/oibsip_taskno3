window.addEventListener('load', () => {
    const form = document.querySelector('#task-form');
    const input = document.querySelector('#task-input');
    const plist = document.querySelector('#pending-tasks');
    const completedList = document.querySelector('#completed-tasks');
    // Retrieve stored tasks from local storage
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    storedTasks.forEach(task => {
        createTaskElement(task);
    });
    storedCompletedTasks.forEach(completedTask => {
        createCompletedTaskElement(completedTask);
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = input.value;
        if (!task) {
            alert("please fill out the task");
            return;
        }
        createTaskElement(task);

        // Save the updated lists to local storage
        const tasks = Array.from(plist.children).map(taskDiv => taskDiv.querySelector('.text').value);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        input.value = "";
    });

    function createTaskElement(task) {
        const ptask = document.createElement("div");
        ptask.classList.add("task");

        const task_content = document.createElement("div");
        task_content.classList.add("content");

        ptask.appendChild(task_content);

        const task_input = document.createElement("input");
        task_input.classList.add("text");
        task_input.type = "text";
        task_input.value = task;
        task_input.setAttribute("readonly", "readonly");
        task_content.appendChild(task_input);

        const task_action = document.createElement("div");
        task_action.classList.add("action");

        const task_completed = document.createElement("button");
        task_completed.classList.add("completed");
        task_completed.innerHTML = "Completed";
        task_action.appendChild(task_completed);

        const task_edit = document.createElement("button");
        task_edit.classList.add("edit");
        task_edit.innerHTML = "Edit";

        const task_delete = document.createElement("button");
        task_delete.classList.add("delete");
        task_delete.innerHTML = "Delete";

        task_action.appendChild(task_edit);
        task_action.appendChild(task_delete);

        task_content.appendChild(task_action);

        plist.appendChild(ptask);

        task_edit.addEventListener('click', () => {
            if (task_edit.innerText.toLowerCase() === "edit") {
                task_input.removeAttribute("readonly");
                task_edit.focus();
                task_edit.innerText = "Save";
            } else {
                task_input.setAttribute("readonly", "readonly");
                task_edit.innerText = "Edit";
                updateLocalStorage();
            }
        });

        task_delete.addEventListener('click', () => {
            plist.removeChild(ptask);
            updateLocalStorage();
        });
    }
    function createCompletedTaskElement(completedTask) {
        const completedTaskDiv = document.createElement("div");
        completedTaskDiv.classList.add("ctask");

        const ctask_content = document.createElement("div");
        ctask_content.classList.add("content");

        completedTaskDiv.appendChild(ctask_content);

        const ctask_input = document.createElement("input");
        ctask_input.classList.add("text");
        ctask_input.type = "text";
        ctask_input.value = completedTask;
        ctask_input.setAttribute("readonly", "readonly");
        ctask_content.appendChild(ctask_input);

        const ctask_action = document.createElement("div");
        ctask_action.classList.add("action");
        completedTaskDiv.appendChild(ctask_action);

        const deleteCompletedButton = document.createElement("button");
        deleteCompletedButton.classList.add("delete");
        deleteCompletedButton.innerHTML = "Delete";
        ctask_action.appendChild(deleteCompletedButton);

        deleteCompletedButton.addEventListener('click', () => {
            completedList.removeChild(completedTaskDiv);
            updateCompletedLocalStorage();
        });

        completedList.appendChild(completedTaskDiv);
    }

    function updateLocalStorage() {
        const tasks = Array.from(plist.children).map(taskDiv => taskDiv.querySelector('.text').value);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateCompletedLocalStorage() {
        const completedTasks = Array.from(completedList.children).map(completedTaskDiv => completedTaskDiv.querySelector('.text').value);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    function moveToCompleted(taskDiv) {
        const taskText = taskDiv.querySelector('.text').value;
        createCompletedTaskElement(taskText);
        plist.removeChild(taskDiv);
        updateLocalStorage();
        updateCompletedLocalStorage();
    }

    plist.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('completed')) {
            const taskDiv = e.target.closest('.task');
            if (taskDiv) {
                moveToCompleted(taskDiv);
            }
        }
    });
});