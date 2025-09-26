import React, { useState, type JSX } from "react";
import type { Items } from "../types/Items";

const Todo_List = (): JSX.Element => {
    const [todo_list, setTodo_list] = useState<Items[]>([]);    // useState를 이용, Items[]형식의 todo_list
    const [done_list, setDone_list] = useState<Items[]>([]);    // useState를 이용, Items[]형식의 todo_list
    const [input, setInput] = useState("");                     // 입력용 state

    const getInput = (e: React.FormEvent) => {                  // 입력받기
        e.preventDefault();                                     // 새로고침 방지
        if(!input.trim()) return;                               // trim을 사용, 값이 없으면 리턴

        const newTodo: Items = {                                // 입력값을 newTodo로 가져옴
            id: Date.now(),
            text: input,
            complete: false,
        };

        setTodo_list([...todo_list, newTodo]);                  // todo_list에 newTodo값 추가
        setInput("");                                           // input을 ""로 초기화

    }

    const doneTodo = (id: number) => {                                  // 완료하기
        const doneItem = todo_list.find(item => item.id === id);        // 완료한 아이템 찾기
        if (!doneItem) return;                                          // 항목이 없으면 함수 종료

        const newTodo_list = todo_list.filter(item => item.id !== id);  // 필터링
        setTodo_list(newTodo_list);                                     // todo_list 수정

        setDone_list([...done_list, {...doneItem, complete: true}]);    // done_list 수정

    }


    return (
    <div id="root_container">
        <h1 id="root_title">Todo-List</h1>
        <form id="root_form" onSubmit={getInput}>
            <input id="input_text" type="text" placeholder="할 일을 입력하세요"
            value={input} onChange={(e) => setInput(e.target.value)} />
            <button id="input_button" type="submit">추가</button>
        </form>
        <hr />
        <div id="list_wrapper">
            <div className="list_container">
                <h2 className="list_title">Todo</h2>
                <div className="li_container">
                    <ul id="todo_list">
                        {todo_list.map(item => (           
                            <li key={item.id}>     
                                <span>{item.text}</span>
                                <button onClick={() => doneTodo(item.id)}>완료</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="list_container" style={{backgroundColor: 'darkred'}}>
                <h2 className="list_title">Done</h2>
                <div className="li_container">
                    <ul id="done_list">
                        {done_list.map(item => (           
                            <li key={item.id}>     
                                <span>{item.text}</span>
                                <button>삭제</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    </div>
    );
};

export default Todo_List;