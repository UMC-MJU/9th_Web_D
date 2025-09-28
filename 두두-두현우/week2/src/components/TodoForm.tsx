import { useState } from "react";

interface TodoFormProps {
  onAddTodo: (text: string) => void;
}

const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="form_container">
      <h3 className="form_title">새 할 일 추가</h3>
      <form onSubmit={handleSubmit}>
        <div className="form_input_container">
          <input
            type="text"
            className="form_input"
            placeholder="할 일을 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            required
          />
          <button type="submit" className="form_add_button">
            + 추가
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
