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
  return (
    <div className="render_section">
      <h3 className="render_title">{title}</h3>
      <div className="render_count">{todos.length}</div>
      <div className="render_list">
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
