import type { Todo } from "../types/Todo";

interface TodoItemProps {
  todo: Todo;
  onMoveToInProgress: (id: number) => void;
  onMoveToDone: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({
  todo,
  onMoveToInProgress,
  onMoveToDone,
  onDelete,
}: TodoItemProps) => {
  const getButtonContent = () => {
    switch (todo.status) {
      case "todo":
        return {
          text: "▷",
          color: "blue",
          action: () => onMoveToInProgress(todo.id),
        };
      case "inProgress":
        return {
          text: "✓",
          color: "green",
          action: () => onMoveToDone(todo.id),
        };
      case "done":
        return { text: "✕", color: "red", action: () => onDelete(todo.id) };
      default:
        return { text: "", color: "", action: () => {} };
    }
  };

  const button = getButtonContent();

  return (
    <li className="bg-white dark:bg-gray-600 rounded-xl p-4 mb-3 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1">
      <span className="text-gray-800 dark:text-white">{todo.text}</span>
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
