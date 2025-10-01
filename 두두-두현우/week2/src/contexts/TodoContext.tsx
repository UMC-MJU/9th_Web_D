import { useState, useMemo, type ReactNode } from "react";
import { TodoContext } from "./TodoContext";
import type { Todo } from "../types/Todo";

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: text.trim(),
        status: "todo",
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    }
  };

  const updateTodoStatus = (id: number, status: Todo["status"]) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, status: status } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const value = useMemo(
    () => ({
      todos,
      addTodo,
      updateTodoStatus,
      deleteTodo,
    }),
    [todos]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
