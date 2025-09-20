// 0. HTML 요소 가져오기
const input_form = document.getElementById('root_form') as HTMLFormElement;
const input_text = document.getElementById('input_text') as HTMLInputElement;
const todo_list = document.getElementById('list_todo') as HTMLUListElement;
const done_list = document.getElementById('list_done') as HTMLUListElement;

// 1. 내용을 작성 후 '추가' 버튼을 누르면 '할 일' 리스트에 추가되야 한다.
const create_todo_item = (text: string) => {
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
}

// 2. '할 일' 리스트에서 '한 일' 리스트로 이동시킬 수 있어야 한다.
const done_item = (li: HTMLLIElement) => {
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
}

// 3. '한 일' 리스트에서 제거될 수 있어야 한다.
const delete_item = (li: HTMLLIElement) => {
    li.remove();
};

// form 제출 이벤트 리스너
input_form.addEventListener('submit', (event) => {
    event.preventDefault();

    const item_text = input_text.value.trim();

    if (item_text !== "") {
        create_todo_item(item_text);
        input_text.value = "";
        input_text.focus();
    }
});