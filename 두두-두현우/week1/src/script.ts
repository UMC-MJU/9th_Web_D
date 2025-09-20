// 1. HTML 요소 선택
const todoForm = document.getElementById("todo-form") as HTMLDivElement;
const todoInput = document.getElementById("form-input") as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const inProgressList = document.getElementById(
  "inProgress-list"
) as HTMLDivElement;
const doneList = document.getElementById("done-list") as HTMLDivElement;

// 2. 할 일이 어떻게 생길지 Type 정의
type Todo = {
  id: number;
  text: string;
  status: "todo" | "inProgress" | "done";
};

let todos: Todo[] = [];

// - 할 일 목록 랜더링 하는 함수 정의
const renderTasks = (): void => {
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  todos.forEach((todo): void => {
    const li = createTodoElement(todo);
    if (todo.status === "todo") {
      todoList.appendChild(li);
    } else if (todo.status === "inProgress") {
      inProgressList.appendChild(li);
    } else if (todo.status === "done") {
      doneList.appendChild(li);
    }
  });

  updateStats();
};

// 3. 할 일 텍스트 입력 처리 함수. 공백 자르기
const getTodoText = (): string => {
  return todoInput.value.trim();
};

// 4. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
  todos.push({ id: Date.now(), text, status: "todo" });
  todoInput.value = "";
  renderTasks();
};

// 5. 할 일 상태 변경 함수들
const moveToInProgress = (todo: Todo): void => {
  const index = todos.findIndex((t) => t.id === todo.id);
  if (index !== -1 && todos[index]) {
    todos[index].status = "inProgress";
    renderTasks();
  }
};

const moveToDone = (todo: Todo): void => {
  const index = todos.findIndex((t) => t.id === todo.id);
  if (index !== -1 && todos[index]) {
    todos[index].status = "done";
    renderTasks();
  }
};

// 6. 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
  todos = todos.filter((t): boolean => t.id !== todo.id);
  renderTasks();
};

// 7. 할 일 item 생성 함수 (상태에 따라 버튼 설정)
const createTodoElement = (todo: Todo): HTMLLIElement => {
  const li = document.createElement("li");
  li.classList.add("render-container_item");
  li.textContent = todo.text;

  const button = document.createElement("button");
  button.classList.add("render-container_item-button");

  if (todo.status === "todo") {
    button.textContent = "▷";
    button.style.backgroundColor = "blue";
    button.addEventListener("click", (): void => {
      moveToInProgress(todo);
    });
  } else if (todo.status === "inProgress") {
    button.textContent = "✓";
    button.style.backgroundColor = "green";
    button.addEventListener("click", (): void => {
      moveToDone(todo);
    });
  } else if (todo.status === "done") {
    button.textContent = "✕";
    button.style.backgroundColor = "red";
    button.addEventListener("click", (): void => {
      deleteTodo(todo);
    });
  }

  li.appendChild(button);
  return li;
};

// 8. 통계 업데이트 함수
const updateStats = (): void => {
  const totalCount = todos.length;
  const todoCount = todos.filter((t) => t.status === "todo").length;
  const inProgressCount = todos.filter((t) => t.status === "inProgress").length;
  const doneCount = todos.filter((t) => t.status === "done").length;

  const statsCounts = document.querySelectorAll(".stats_count");
  if (statsCounts.length >= 4) {
    if (statsCounts[0]) statsCounts[0].textContent = totalCount.toString();
    if (statsCounts[1]) statsCounts[1].textContent = todoCount.toString();
    if (statsCounts[2]) statsCounts[2].textContent = inProgressCount.toString();
    if (statsCounts[3]) statsCounts[3].textContent = doneCount.toString();
  }
};

// 9. 폼 이벤트 리스너
const addButton = document.querySelector(
  ".form_add_button"
) as HTMLButtonElement;
addButton.addEventListener("click", (e): void => {
  e.preventDefault();
  const text = getTodoText();
  if (text) {
    addTodo(text);
  }
});
