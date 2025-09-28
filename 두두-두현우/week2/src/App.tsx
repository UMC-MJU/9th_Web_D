import { useState } from "react";
import "./App.css";
import type { Todo } from "./types/Todo";
import TodoForm from "./components/TodoForm";
import TodoSection from "./components/TodoSection";
import Stats from "./components/Stats";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // 할 일 추가
  const addTodo = (text: string) => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: text.trim(),
        status: "todo",
      };
      setTodos([...todos, newTodo]);
    }
  };

  // 할 일 상태 변경
  const moveToInProgress = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: "inProgress" } : todo
      )
    );
  };

  const moveToDone = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, status: "done" } : todo))
    );
  };

  // 할 일 삭제
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 통계 계산
  const totalCount = todos.length;
  const todoCount = todos.filter((t) => t.status === "todo").length;
  const inProgressCount = todos.filter((t) => t.status === "inProgress").length;
  const doneCount = todos.filter((t) => t.status === "done").length;

  // 필터링된 할 일들
  const todoList = todos.filter((todo) => todo.status === "todo");
  const inProgressList = todos.filter((todo) => todo.status === "inProgress");
  const doneList = todos.filter((todo) => todo.status === "done");

  return (
    <div className="container">
      {/* Header */}
      <h1 className="title">TODO</h1>
      <h2 className="subtitle">할 일을 효율적으로 관리하세요</h2>

      {/* Form */}
      <TodoForm onAddTodo={addTodo} />

      {/* Render Sections */}
      <div className="render">
        <TodoSection
          title="시작 전"
          todos={todoList}
          onMoveToInProgress={moveToInProgress}
          onMoveToDone={moveToDone}
          onDelete={deleteTodo}
        />

        <TodoSection
          title="진행 중"
          todos={inProgressList}
          onMoveToInProgress={moveToInProgress}
          onMoveToDone={moveToDone}
          onDelete={deleteTodo}
        />

        <TodoSection
          title="완료"
          todos={doneList}
          onMoveToInProgress={moveToInProgress}
          onMoveToDone={moveToDone}
          onDelete={deleteTodo}
        />
      </div>

      {/* Stats */}
      <Stats
        totalCount={totalCount}
        todoCount={todoCount}
        inProgressCount={inProgressCount}
        doneCount={doneCount}
      />
    </div>
  );
}

export default App;
