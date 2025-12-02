import { create } from "zustand";

// 타입 정의
interface ModalState {
  isOpen: boolean;
  modalType: "clearCart" | null;
}

interface ModalActions {
  openModal: (modalType: "clearCart") => void;
  closeModal: () => void;
}

type ModalStore = ModalState & ModalActions;

// Zustand store 생성
export const useModalStore = create<ModalStore>((set) => ({
  // 초기 상태
  isOpen: false,
  modalType: null,

  // 액션들
  // 모달 열기
  openModal: (modalType: "clearCart") =>
    set({
      isOpen: true,
      modalType,
    }),

  // 모달 닫기
  closeModal: () =>
    set({
      isOpen: false,
      modalType: null,
    }),
}));
