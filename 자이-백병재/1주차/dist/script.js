"use strict";
const input_form = document.getElementById('root_form');
const input_text = document.getElementById('input_text');
const todo_list = document.getElementById('list_todo');
const done_list = document.getElementById('list_done');
const create_todo_item = (text) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const button = document.createElement('button');
    span.innerText = text;
    button.innerText = '완료';
    button.addEventListener('click', () => {
        done_item(li);
    });
    li.appendChild(span);
    li.appendChild(button);
    todo_list.appendChild(li);
};
const done_item = (li) => {
    const button = li.querySelector('button');
    if (button) {
        li.removeChild(button);
    }
    const new_button = document.createElement('button');
    new_button.innerText = "삭제";
    new_button.addEventListener('click', () => {
        delete_item(li);
    });
    li.appendChild(new_button);
    done_list.appendChild(li);
};
const delete_item = (li) => {
    li.remove();
};
input_form.addEventListener('submit', (event) => {
    event.preventDefault();
    const item_text = input_text.value.trim();
    if (item_text !== "") {
        create_todo_item(item_text);
        input_text.value = "";
        input_text.focus();
    }
});
