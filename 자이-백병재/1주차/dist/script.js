"use strict";
const input = document.getElementById('input');
const form = document.getElementById('form');
const todolist = document.getElementById('todo-list');
const donelist = document.getElementById('done-list');
let todos = [];
let dones = [];
const renderLists = () => {
    todolist.innerHTML = '';
    donelist.innerHTML = '';
    todos.forEach((todo) => {
        const li = createTodoItem(todo, false);
        todolist.appendChild(li);
    });
    dones.forEach((todo) => {
        const li = createTodoItem(todo, true);
        donelist.appendChild(li);
    });
};
const getText = () => {
    return input.value.trim();
};
const addTodo = (text) => {
    todos.push({ id: Date.now(), text, });
    input.value = '';
    renderLists();
};
const completeTodo = (todo) => {
    todos = todos.filter(t => t.id !== todo.id);
    dones.push(todo);
    renderLists();
};
const deleteDone = (todo) => {
    dones = dones.filter(t => t.id !== todo.id);
    renderLists();
};
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = getText();
    if (text) {
        addTodo(text);
    }
});
renderLists();
const createTodoItem = (todo, done) => {
    const li = document.createElement('li');
    li.classList.add('list-item');
    li.textContent = todo.text;
    const button = document.createElement('button');
    button.classList.add('item-button');
    if (done) {
        button.textContent = '삭제';
        button.style.backgroundColor = 'red';
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = 'green';
    }
    button.addEventListener('click', () => {
        if (done) {
            deleteDone(todo);
        }
        else {
            completeTodo(todo);
        }
    });
    li.appendChild(button);
    return li;
};
