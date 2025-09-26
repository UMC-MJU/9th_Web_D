import { type JSX } from "react";
import List_Component from "./List_Component";
import Input_Form from "./Input_Form";
import { useList } from "../hooks/useList";

const Todo_List = (): JSX.Element => {
    const {todo_list, done_list, addTodoList, doneTodo, deleteDone} = useList();    // hook을 이용해 한번에 state, 함수 받기

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