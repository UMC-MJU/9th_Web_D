import type { Todo } from "../types/Todo";
import TodoItem from "./TodoItem";
import { useTheme } from "../hooks/useTheme";
import { TODO_SECTIONS } from "../constants/todoSections";

interface TodoSectionProps {
  status: Todo["status"];
  todos: Todo[];
}

const TodoSection = ({ status, todos }: TodoSectionProps) => {
  const { isDark } = useTheme();
  const section = TODO_SECTIONS[status];

  return (
    <div
      className={`rounded-2xl p-6 shadow-lg ${
        isDark ? "bg-gray-700" : "bg-gray-50"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-4 flex items-center gap-3 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        <span
          className={`${section.bgColor} text-white w-6 h-6 rounded-full flex items-center justify-center text-sm`}
        >
          {section.icon}
        </span>
        {section.title}
      </h3>
      <div
        className={`inline-block ${section.countStyle} px-3 py-1 rounded-full text-sm font-semibold mb-5`}
      >
        {todos.length}
      </div>
      <div className="min-h-[200px]">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default TodoSection;
