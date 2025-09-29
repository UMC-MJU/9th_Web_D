import { useState, type JSX } from 'react';
import type { TTodo } from '../types/todo';

const Todo = (): JSX.Element => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newTodo: TTodo = { id: Date.now(), text };
    setTodos(prev => [...prev, newTodo]);
    setInput('');
  };

  const completeTodo = (todo: TTodo) => {
    // 할 일 목록에서 제거하고 완료 목록에 추가
    setTodos(prev => prev.filter(t => t.id !== todo.id));
    setDoneTodos(prev => [todo, ...prev]);
  };

  const deleteTodo = (todo: TTodo) => {
    // 완료 목록에서 제거
    setDoneTodos(prev => prev.filter(t => t.id !== todo.id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">달수 TODO</h1>

      <form onSubmit={handleSubmit} className="todo-container__form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="todo-container__input"
          placeholder="할 일 입력"
          required
        />
        <button type="submit" className="todo-container__button">
          할 일 추가
        </button>
      </form>

      <div className="render-container">
        {/* 할 일 섹션 */}
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul id="todo-list" className="render-container__list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  onClick={() => completeTodo(todo)}
                  style={{ backgroundColor: '#28a745' }}
                  className="render-container__item-button"
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 완료 섹션 */}
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul id="todo-list" className="render-container__list">
            {doneTodos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo)}
                  style={{ backgroundColor: '#dc3545' }}
                  className="render-container__item-button"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Todo;
