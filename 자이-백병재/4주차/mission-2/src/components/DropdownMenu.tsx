// src/components/ui/DropdownMenu.jsx

import React from 'react';

interface MenuItem {
    label: string;
    onClick: () => void;
  }
  interface DropdownMenuProps<T extends string | number> {
    triggerId: T;
    openMenuId: T | null;
    /** 부모의 state setter (타입 T 또는 null) */
    setOpenMenuId: React.Dispatch<React.SetStateAction<T | null>>;
    menuItems: MenuItem[];
  }

  function DropdownMenu<T extends string | number>({
    triggerId,
    openMenuId,
    setOpenMenuId,
    menuItems = [],
  }: DropdownMenuProps<T>) {
  const isOpen = openMenuId === triggerId;

  // "..." 버튼 클릭 핸들러
  const handleTriggerClick = (e) => {
    setOpenMenuId((prevId) => (prevId === triggerId ? null : triggerId));
  };

  // 메뉴 항목 클릭 핸들러
  const handleItemClick = (e, onClickHandler) => {
    onClickHandler(); // props로 받은 함수 실행
    setOpenMenuId(null); // 메뉴 닫기
  };

  return (
    <div className="relative">
      <button
        // 부모의 '바깥 클릭' 로직이 감지할 수 있도록 data 속성을 설정
        data-menu-trigger={triggerId}
        onClick={handleTriggerClick}
        className="p-1 rounded-full text-gray-400 hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
      </button>

      {isOpen && (
        <div
          // 부모의 '바깥 클릭' 로직이 감지할 수 있도록 data 속성을 설정
          data-menu-dropdown={triggerId}
          className="absolute top-full right-0 mt-2 w-32 bg-gray-700 rounded-lg shadow-lg z-10"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label || index}
              onClick={(e) => handleItemClick(e, item.onClick)}
              className={`
                w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === menuItems.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;