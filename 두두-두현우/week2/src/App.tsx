import { useState } from "react";
import type { Todo } from "./types/Todo";
import TodoForm from "./components/TodoForm";
import TodoSection from "./components/TodoSection";
import Stats from "./components/Stats";
import ThemeToggle from "./components/ThemeToggle";
import { useTheme } from "./hooks/useTheme";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { isDark } = useTheme();

  // 디버깅용
  console.log("App 컴포넌트 - 다크모드 상태:", isDark);

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
    <div
      className={`min-h-screen p-5 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto rounded-3xl shadow-2xl p-10 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <h1
          className={`text-4xl font-bold text-center mb-3 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          TODO
        </h1>
        <h2
          className={`text-lg text-center mb-5 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          할 일을 효율적으로 관리하세요
        </h2>
        {/* 디버깅용 상태 표시 */}
        <div className="text-center mb-5 p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            현재 모드: {isDark ? "다크모드" : "라이트모드"} | HTML 클래스:{" "}
            {typeof window !== "undefined"
              ? document.documentElement.className
              : "N/A"}
          </span>
        </div>

        {/* 간단한 다크모드 테스트 카드 */}
        <div className="mb-5 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            다크모드 테스트 카드
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            이 카드는 다크모드에서 회색 배경과 흰색 텍스트로 표시되어야 합니다.
          </p>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-blue-500 text-white rounded">
              블루 버튼
            </div>
            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
              다크모드 적용 버튼
            </div>
          </div>
        </div>

        {/* Form */}
        <TodoForm onAddTodo={addTodo} />

        {/* Render Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Theme Toggle Button */}
      <ThemeToggle />
    </div>
  );
}

export default App;
