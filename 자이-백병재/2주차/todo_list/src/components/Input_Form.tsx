import React, { useState } from 'react';

type FormProps = {
    addTodo: (text: string) => void;
}

export const Input_Form = ({addTodo}: FormProps) => {
    const [input, setInput] = useState("");                     // 입력용 state

    const getInput = (e: React.FormEvent) => {                  // 입력받기
        e.preventDefault();                                     // 새로고침 방지
        if(!input.trim()) return;                               // trim을 사용, 값이 없으면 리턴
        addTodo(input);                                         // input을 기존 todo_list에 추가
        setInput("");                                           // input을 ""로 초기화
    }

    return(
        <form id="root_form" onSubmit={getInput}>
            <input id="input_text" type="text" placeholder="할 일을 입력하세요"
            value={input} onChange={(e) => setInput(e.target.value)} />
            <button id="input_button" type="submit">추가</button>
        </form>        
    );
}

export default Input_Form;