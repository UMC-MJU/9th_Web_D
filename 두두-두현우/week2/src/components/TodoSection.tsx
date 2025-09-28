import type { Todo } from "../types/Todo";
import TodoItem from "./TodoItem";

interface TodoSectionProps {
  title: string;
  todos: Todo[];
  onMoveToInProgress: (id: number) => void;
  onMoveToDone: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoSection = ({
  title,
  todos,
  onMoveToInProgress,
  onMoveToDone,
  onDelete,
}: TodoSectionProps) => {
  const getSectionIcon = () => {
    switch (title) {
      case "시작 전":
        return { icon: "⊙", bgColor: "bg-blue-500" };
      case "진행 중":
        return { icon: "▷", bgColor: "bg-orange-500" };
      case "완료":
        return { icon: "✔", bgColor: "bg-green-500" };
      default:
        return { icon: "⊙", bgColor: "bg-blue-500" };
    }
  };

  const getCountStyle = () => {
    switch (title) {
      case "시작 전":
        return "bg-gray-200 text-gray-600";
      case "진행 중":
        return "bg-orange-100 text-orange-700";
      case "완료":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  const sectionIcon = getSectionIcon();

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
        <span
          className={`${sectionIcon.bgColor} text-white w-6 h-6 rounded-full flex items-center justify-center text-sm`}
        >
          {sectionIcon.icon}
        </span>
        {title}
      </h3>
      <div
        className={`inline-block ${getCountStyle()} px-3 py-1 rounded-full text-sm font-semibold mb-5`}
      >
        {todos.length}
      </div>
      <div className="min-h-[200px]">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onMoveToInProgress={onMoveToInProgress}
            onMoveToDone={onMoveToDone}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoSection;
