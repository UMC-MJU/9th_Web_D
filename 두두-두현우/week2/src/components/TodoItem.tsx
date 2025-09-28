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
    <li className="render-container_item">
      <span>{todo.text}</span>
      <button
        className="render-container_item-button"
        style={{ backgroundColor: button.color }}
        onClick={button.action}
      >
        {button.text}
      </button>
    </li>
  );
};

export default TodoItem;
