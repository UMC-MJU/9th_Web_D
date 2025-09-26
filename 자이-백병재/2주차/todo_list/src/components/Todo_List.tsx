import React, { useState, type JSX } from "react";
import type { Items } from "../types/Items";
import List_Component from "./List_component";
import Input_Form from "./Input_Form";

const Todo_List = (): JSX.Element => {
    const [todo_list, setTodo_list] = useState<Items[]>([]);    // useState를 이용, Items[]형식의 todo_list
    const [done_list, setDone_list] = useState<Items[]>([]);    // useState를 이용, Items[]형식의 todo_list

    const addTodoList = (text: string) => {                  // 입력받기
        const newTodo: Items = {                                // 입력값을 newTodo로 가져옴
            id: Date.now(),
            text,
            complete: false,
        };
        setTodo_list([...todo_list, newTodo]);                  // todo_list에 newTodo값 추가
    }

    const doneTodo = (id: number) => {                                  // 완료하기
        const doneItem = todo_list.find(item => item.id === id);        // 완료한 아이템 찾기
        if (!doneItem) return;                                          // 항목이 없으면 함수 종료

        const newTodo_list = todo_list.filter(item => item.id !== id);  // 필터링
        setTodo_list(newTodo_list);                                     // todo_list 수정

        setDone_list([...done_list, {...doneItem, complete: true}]);    // done_list 수정

    }

    const deleteDone = (id: number) => {
        const newDone_list = done_list.filter(item => item.id !== id);  // 필터링
        setDone_list(newDone_list);
    }

    return (
    <div id="root_container">
        <h1 id="root_title">Todo-List</h1>
        <Input_Form addTodo={addTodoList} />
        <hr />
        <div id="list_wrapper">
            {/* List_Component 사용해 컴포넌트 분리 */}
            <List_Component title="Todo" list={todo_list} buttonText="완료" onButtonClick={doneTodo} BG={{backgroundColor: 'green'}} />
            <List_Component title="Done" list={done_list} buttonText="삭제" onButtonClick={deleteDone} BG={{backgroundColor: 'darkred'}} />
        </div>
    </div>
    );
};

export default Todo_List;