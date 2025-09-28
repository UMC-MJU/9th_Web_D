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
    <div className="bg-gray-50 rounded-2xl p-8 mb-8 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
        <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">
          ⊕
        </span>
        새 할 일 추가
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors focus:border-blue-500"
            placeholder="할 일을 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-4 rounded-xl text-base font-semibold cursor-pointer transition-colors hover:bg-blue-600"
          >
            + 추가
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
