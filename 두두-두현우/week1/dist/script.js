"use strict";
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("form-input");
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("inProgress-list");
const doneList = document.getElementById("done-list");
let todos = [];
const renderTasks = () => {
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    doneList.innerHTML = "";
    todos.forEach((todo) => {
        const li = createTodoElement(todo);
        if (todo.status === "todo") {
            todoList.appendChild(li);
        }
        else if (todo.status === "inProgress") {
            inProgressList.appendChild(li);
        }
        else if (todo.status === "done") {
            doneList.appendChild(li);
        }
    });
    updateStats();
};
const getTodoText = () => {
    return todoInput.value.trim();
};
const addTodo = (text) => {
    todos.push({ id: Date.now(), text, status: "todo" });
    todoInput.value = "";
    renderTasks();
};
const moveToInProgress = (todo) => {
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1 && todos[index]) {
        todos[index].status = "inProgress";
        renderTasks();
    }
};
const moveToDone = (todo) => {
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1 && todos[index]) {
        todos[index].status = "done";
        renderTasks();
    }
};
const deleteTodo = (todo) => {
    todos = todos.filter((t) => t.id !== todo.id);
    renderTasks();
};
const createTodoElement = (todo) => {
    const li = document.createElement("li");
    li.classList.add("render-container_item");
    li.textContent = todo.text;
    const button = document.createElement("button");
    button.classList.add("render-container_item-button");
    if (todo.status === "todo") {
        button.textContent = "▷";
        button.style.backgroundColor = "blue";
        button.addEventListener("click", () => {
            moveToInProgress(todo);
        });
    }
    else if (todo.status === "inProgress") {
        button.textContent = "✓";
        button.style.backgroundColor = "green";
        button.addEventListener("click", () => {
            moveToDone(todo);
        });
    }
    else if (todo.status === "done") {
        button.textContent = "✕";
        button.style.backgroundColor = "red";
        button.addEventListener("click", () => {
            deleteTodo(todo);
        });
    }
    li.appendChild(button);
    return li;
};
const updateStats = () => {
    const totalCount = todos.length;
    const todoCount = todos.filter((t) => t.status === "todo").length;
    const inProgressCount = todos.filter((t) => t.status === "inProgress").length;
    const doneCount = todos.filter((t) => t.status === "done").length;
    const statsCounts = document.querySelectorAll(".stats_count");
    if (statsCounts.length >= 4) {
        if (statsCounts[0])
            statsCounts[0].textContent = totalCount.toString();
        if (statsCounts[1])
            statsCounts[1].textContent = todoCount.toString();
        if (statsCounts[2])
            statsCounts[2].textContent = inProgressCount.toString();
        if (statsCounts[3])
            statsCounts[3].textContent = doneCount.toString();
    }
};
const addButton = document.querySelector(".form_add_button");
addButton.addEventListener("click", (e) => {
    e.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
