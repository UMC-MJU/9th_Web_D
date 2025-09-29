import { createContext } from "react";
import type { Todo } from "../types/Todo";

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  updateTodoStatus: (id: number, status: Todo["status"]) => void;
  deleteTodo: (id: number) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined
);
