import React from "react";
import type { Items } from "../types/Items";

type ListProps = {
    title: string;
    list: Items[];
    buttonText: string;
    onButtonClick: (id: number) => void;
    BG: React.CSSProperties;
}

export const List_Component = ({title, list, buttonText, onButtonClick, BG}: ListProps) => {
    return (
            <div className="list_container" style={BG}>     {/* background-color 설정 */}
                <h2 className="list_title">{title}</h2>     {/* 리스트 이름 설정 */}
                <div className="li_container">          
                    <ul>
                        {list.map(item => (                 // map을 이용, 받아온 list 순회
                            <li key={item.id}>              {/* key 설정 */}
                                <span>{item.text}</span>    {/* list 글자 설정 */}
                                <button onClick={() => onButtonClick(item.id)}>{buttonText}</button>
                            </li>                           // 버튼과 버튼 이벤트 연결
                        ))}
                    </ul>
                </div>
            </div>
    );
}

export default List_Component