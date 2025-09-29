import { useMemo } from "react";
import TodoForm from "./components/TodoForm";
import TodoSection from "./components/TodoSection";
import Stats from "./components/Stats";
import ThemeToggle from "./components/ThemeToggle";
import { useTheme } from "./hooks/useTheme";
import { useTodos } from "./hooks/useTodos";
import type { Todo } from "./types/Todo";

function App() {
  const { todos } = useTodos();
  const { isDark } = useTheme();

  const todoList = useMemo(
    () => todos.filter((todo: Todo) => todo.status === "todo"),
    [todos]
  );
  const inProgressList = useMemo(
    () => todos.filter((todo: Todo) => todo.status === "inProgress"),
    [todos]
  );
  const doneList = useMemo(
    () => todos.filter((todo: Todo) => todo.status === "done"),
    [todos]
  );

  const totalCount = todos.length;
  const todoCount = todoList.length;
  const inProgressCount = inProgressList.length;
  const doneCount = doneList.length;

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

        {/* Form */}
        <TodoForm />

        {/* Render Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TodoSection status="todo" todos={todoList} />

          <TodoSection status="inProgress" todos={inProgressList} />

          <TodoSection status="done" todos={doneList} />
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
