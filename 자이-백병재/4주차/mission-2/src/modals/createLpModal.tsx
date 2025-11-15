import React from 'react';

// 모달 컴포넌트의 props 타입 정의
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}


function CreateLpModal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        className="fixed inset-0 z-40"
        onClick={onClose} 
      ></div>

      {/* 모달 컨텐츠*/}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   bg-gray-800 rounded-lg shadow-xl z-50 p-6 w-full max-w-md"
      >
        <div onClick={(e) => e.stopPropagation()}>
          {children} {/* 모달 내부에 표시될 내용 */}
        </div>
      </div>
    </>
  );
}

export default CreateLpModal;