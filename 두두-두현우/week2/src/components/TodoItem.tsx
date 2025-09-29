import type { Todo } from "../types/Todo";
import { useTheme } from "../hooks/useTheme";
import { useTodos } from "../hooks/useTodos";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const { isDark } = useTheme();
  const { updateTodoStatus, deleteTodo } = useTodos();

  const getButtonContent = () => {
    switch (todo.status) {
      case "todo":
        return {
          text: "▷",
          color: "blue",
          action: () => updateTodoStatus(todo.id, "inProgress"),
        };
      case "inProgress":
        return {
          text: "✓",
          color: "green",
          action: () => updateTodoStatus(todo.id, "done"),
        };
      case "done":
        return { text: "✕", color: "red", action: () => deleteTodo(todo.id) };
      default:
        return { text: "", color: "", action: () => {} };
    }
  };

  const button = getButtonContent();

  return (
    <li
      className={`rounded-xl p-4 mb-3 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 ${
        isDark ? "bg-gray-600" : "bg-white"
      }`}
    >
      <span className={isDark ? "text-white" : "text-gray-800"}>
        {todo.text}
      </span>
      <button
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-base cursor-pointer transition-all hover:scale-110 text-white ${
          button.color === "blue"
            ? "bg-blue-500 hover:bg-blue-600"
            : button.color === "green"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
        onClick={button.action}
      >
        {button.text}
      </button>
    </li>
  );
};

export default TodoItem;
