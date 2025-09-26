import type { JSX } from "react";

const Todo_List = (): JSX.Element => {
    return (
    <div id="root_container">
        <h1 id="root_title">Todo-List</h1>
        <form id="root_form">
            <input id="input_text" type="text" placeholder="할 일을 입력하세요"></input>
            <button id="input_button" type="submit">추가</button>
        </form>
        <hr />
        <div id="list_wrapper">
            <div className="list_container">
                <h2 className="list_title">Todo</h2>
                <div className="li_container">
                    <ul id="todo_list">
                        { /* 여기에 todo_list 값 추가 */}
                    </ul>
                </div>
            </div>
            <div className="list_container" style={{backgroundColor: 'darkred'}}>
                <h2 className="list_title">Done</h2>
                <div className="li_container">
                    <ul id="done_list">
                        { /* 여기에 done_list 값 추가 */}
                    </ul>
                </div>
            </div>

        </div>
    </div>
    );
};

export default Todo_List;