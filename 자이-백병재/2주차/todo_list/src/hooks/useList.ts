import { useState } from 'react';
import type { Items } from '../types/Items';


export const useList = () => {
    const [todo_list, setTodo_list] = useState<Items[]>([]);
    const [done_list, setDone_list] = useState<Items[]>([]);

    const addTodoList = (text: string) => {
        const newTodo: Items = {
            id: Date.now(),
            text,
            complete: false,
        };
        setTodo_list([...todo_list, newTodo]);
    };

    const doneTodo = (id: number) => {
        const doneItem = todo_list.find(item => item.id === id);
        if (!doneItem) return;
        setTodo_list(todo_list.filter(item => item.id !== id));
        setDone_list([...done_list, { ...doneItem, complete: true }]);
    };

    const deleteDone = (id: number) => {
        setDone_list(done_list.filter(item => item.id !== id));
    };

    // 객체로 반환
    return {
        todo_list,
        done_list,
        addTodoList,
        doneTodo,
        deleteDone
    };
};