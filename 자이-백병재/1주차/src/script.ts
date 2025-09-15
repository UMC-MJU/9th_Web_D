const  input = document.getElementById('input') as HTMLInputElement;
const form = document.getElementById('form') as HTMLFormElement;
const todolist = document.getElementById('todo-list') as HTMLUListElement;
const donelist = document.getElementById('done-list') as HTMLUListElement;
// HTML 입력 요소 가져오기

type doList = {
    id: number;
    text: string;
};
// 할 일 항목의 타입 정의

let todos: doList[] = []; 
let dones: doList[] = [];
// 할 일과 완료된 할 일 항목을 저장할 배열

const renderLists = (): void => {  
    todolist.innerHTML = '';
    donelist.innerHTML = '';
    // 기존 목록 초기화 

    todos.forEach((todo) : void => {
        const li = createTodoItem(todo, false);
        todolist.appendChild(li);
});

    dones.forEach((todo) : void => {
        const li = createTodoItem(todo, true);
        donelist.appendChild(li);
});

}

const getText = (): string => {
    return input.value.trim();
} // 입력 필드에서 텍스트 가져오기 (공백 제거)

const addTodo = (text: string): void => {
    todos.push ({id: Date.now(),text,});
    input.value = '';
    renderLists();
}

const completeTodo = (todo:doList): void => {
    todos = todos.filter(t => t.id !== todo.id);
    dones.push(todo);
    renderLists();
} // 할 일 > 완료로 이동

const deleteDone = (todo:doList): void => {
    dones = dones.filter(t => t.id !== todo.id);
    renderLists();
} // 완료 > 삭제


form.addEventListener('submit', (e : Event) : void => {
    e.preventDefault();
    const text = getText();
    if (text) {
        addTodo(text);
    }
}
);

renderLists(); // 초기 렌더링

//<!-- <p class="item">2024-01-01</p>
//<button class="item-button">삭제</button> -->

const createTodoItem = (todo: doList, done: boolean ): HTMLElement => {
    const li = document.createElement('li');
    li.classList.add('list-item');
    li.textContent = todo.text;
    const button = document.createElement('button');
    button.classList.add('item-button');

    if(done) {
        button.textContent = '삭제';
        button.style.backgroundColor = 'red';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = 'green';
    }


button.addEventListener('click', (): void => {
    if(done) {
        deleteDone(todo);
    } else {
        completeTodo(todo);
    }
});

li.appendChild(button);
return li;

}